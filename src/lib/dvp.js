import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

export const NETWORK = "mainnet-beta";
export const RPC = "https://api.mainnet-beta.solana.com";

/* Treasury wallet that receives payment orders */
export const TREASURY = new PublicKey(
  "GsbwXfgiRPjHCXFtmpyqQVJmBtrC1bBCbqY4VYNPTXVX"
);

/* USDC mint on Solana mainnet */
export const USDC_MINT = new PublicKey(
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
);

/* SOL price stub — in production this comes from Pyth oracle */
const SOL_USD = 145;

export function getConnection() {
  return new Connection(RPC, "confirmed");
}

/*
  Place a DvP order.
  - paymentMint: "USDC" | "SOL"
  - tokenAmount: number of security tokens requested
  - pricePerToken: USD price of the security
  - buyerPubkey: PublicKey of the connected wallet
  Returns a signed+sent transaction signature.
*/
export async function placeDvpOrder({
  symbol,
  tokenAmount,
  pricePerToken,
  paymentMint,
  buyerPubkey,
}) {
  const provider = window.solana;
  if (!provider?.isPhantom) throw new Error("Phantom wallet not found");

  const connection = getConnection();
  const tx = new Transaction();
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = buyerPubkey;

  const totalUsd = tokenAmount * pricePerToken;

  if (paymentMint === "SOL") {
    /* Transfer SOL to treasury as payment */
    const lamports = Math.round((totalUsd / SOL_USD) * LAMPORTS_PER_SOL);
    tx.add(
      SystemProgram.transfer({
        fromPubkey: buyerPubkey,
        toPubkey: TREASURY,
        lamports,
      })
    );
  } else {
    /* Transfer USDC to treasury as payment */
    const usdcAmount = Math.round(totalUsd * 1_000_000); // USDC has 6 decimals
    const fromAta = await getAssociatedTokenAddress(USDC_MINT, buyerPubkey);
    const toAta = await getAssociatedTokenAddress(USDC_MINT, TREASURY);

    /* Create treasury ATA if it doesn't exist yet */
    const toAtaInfo = await connection.getAccountInfo(toAta);
    if (!toAtaInfo) {
      tx.add(
        createAssociatedTokenAccountInstruction(
          buyerPubkey,
          toAta,
          TREASURY,
          USDC_MINT
        )
      );
    }

    tx.add(
      createTransferInstruction(fromAta, toAta, buyerPubkey, usdcAmount)
    );
  }

  /* Sign and send via Phantom */
  const { signature } = await provider.signAndSendTransaction(tx);
  await connection.confirmTransaction(
    { signature, blockhash, lastValidBlockHeight },
    "confirmed"
  );

  return signature;
}

export function explorerUrl(sig) {
  return `https://solscan.io/tx/${sig}`;
}
