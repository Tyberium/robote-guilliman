import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import GrimDarkBackground from './components/GrimDarkBackground'
import HeroPage from './pages/HeroPage'
import ProblemPage from './pages/ProblemPage'
import ArchitecturePage from './pages/ArchitecturePage'
import ParserPage from './pages/ParserPage'
import DemoPage from './pages/DemoPage'
import StackPage from './pages/StackPage'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <GrimDarkBackground />
        <Navigation />
        <main style={{ paddingTop: '64px' }}>
          <Routes>
            <Route path="/" element={<HeroPage />} />
            <Route path="/problem" element={<ProblemPage />} />
            <Route path="/architecture" element={<ArchitecturePage />} />
            <Route path="/parser" element={<ParserPage />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/stack" element={<StackPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
