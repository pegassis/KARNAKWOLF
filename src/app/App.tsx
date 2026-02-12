import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import { Footer } from './components/Footer';
import { CircuitDecoration } from './components/CircuitDecoration';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { DepartmentEventsPage } from './pages/DepartmentEventsPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { MainEventPage } from './pages/MainEventPage';
import GalleryPage from './pages/GalleryPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminProvider } from './context/AdminContext';

export default function App() {
  return (
    <AdminProvider>
      <Router>
        <div className="relative min-h-screen bg-background">
          {/* Circuit Decorations */}
          <CircuitDecoration side="left" />
          <CircuitDecoration side="right" />
          
          {/* Navigation */}
          <Navbar />
          {/* Ensure we scroll to top when route changes */}
          <ScrollToTop />
          
          {/* Main Content */}
          <main className="relative z-10">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/mainevent" element={<MainEventPage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/departments/:departmentId" element={<DepartmentEventsPage />} />
              <Route path="/departments/:departmentId/events/:eventId" element={<EventDetailsPage />} />
              
              {/* Admin Routes */}
              <Route path="/karmin" element={<AdminLoginPage />} />
            </Routes>
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </AdminProvider>
  );
}