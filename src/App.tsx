import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PapersPage from './pages/PapersPage';
import ProjectsPage from './pages/ProjectsPage';
import MembersPage from './pages/MembersPage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/papers" element={<PapersPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/members" element={<MembersPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
