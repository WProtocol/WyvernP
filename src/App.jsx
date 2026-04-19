import { Routes, Route } from 'react-router-dom'
import WyvernProtocol from './WyvernProtocol'
import AppDashboard   from './pages/AppDashboard'
import MarketsPage    from './pages/MarketsPage'
import DocsPage       from './pages/DocsPage'
import ContactPage    from './pages/ContactPage'

export default function App() {
  return (
    <Routes>
      <Route path="/"        element={<WyvernProtocol />} />
      <Route path="/app"     element={<AppDashboard />} />
      <Route path="/markets" element={<MarketsPage />} />
      <Route path="/docs"    element={<DocsPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  )
}
