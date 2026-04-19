import { useCallback, useEffect, useState } from "react";

/*  Shared Phantom wallet hook.
    Reads state from window.solana, listens to connect/disconnect events,
    and attempts silent reconnect (trusted apps) on mount. */

const KEY = "wyvern:wallet-trusted";

function getProvider() {
  if (typeof window === "undefined") return null;
  const p = window.solana;
  return p?.isPhantom ? p : null;
}

export function useWallet() {
  const [address, setAddress] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const provider = getProvider();
    if (!provider) return;

    const onConnect = (pk) => setAddress(pk?.toString?.() ?? null);
    const onDisconnect = () => {
      setAddress(null);
      localStorage.removeItem(KEY);
    };
    const onAccountChanged = (pk) =>
      setAddress(pk ? pk.toString() : null);

    provider.on("connect", onConnect);
    provider.on("disconnect", onDisconnect);
    provider.on("accountChanged", onAccountChanged);

    if (localStorage.getItem(KEY) === "1") {
      provider
        .connect({ onlyIfTrusted: true })
        .then((r) => setAddress(r.publicKey.toString()))
        .catch(() => {});
    }

    return () => {
      provider.removeListener?.("connect", onConnect);
      provider.removeListener?.("disconnect", onDisconnect);
      provider.removeListener?.("accountChanged", onAccountChanged);
    };
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    const provider = getProvider();
    if (!provider) {
      setError("no-phantom");
      window.open("https://phantom.app/", "_blank", "noopener");
      return null;
    }
    setConnecting(true);
    try {
      const res = await provider.connect();
      const addr = res.publicKey.toString();
      setAddress(addr);
      localStorage.setItem(KEY, "1");
      return addr;
    } catch (e) {
      setError(e?.message || "connect-failed");
      return null;
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    const provider = getProvider();
    if (provider) {
      try { await provider.disconnect(); } catch {}
    }
    setAddress(null);
    localStorage.removeItem(KEY);
  }, []);

  return {
    address,
    connected: !!address,
    connecting,
    error,
    connect,
    disconnect,
    short: address ? `${address.slice(0, 4)}…${address.slice(-4)}` : null,
  };
}
