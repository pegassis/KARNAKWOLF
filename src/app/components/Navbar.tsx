import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Zap, Menu, X, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, logout } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastY = useRef<number>(typeof window !== 'undefined' ? window.scrollY : 0);

  useEffect(() => {
    const threshold = 10;
    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastY.current + threshold && currentY > 80) {
        setVisible(false);
      } else if (currentY < lastY.current - threshold) {
        setVisible(true);
      }
      // Close mobile menu on scroll
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
      lastY.current = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileMenuOpen]);
  
  const isActive = (path: string) => {
    if (location.pathname === path) return true;
    // treat hash anchors on home as active for their respective paths
    if (location.pathname === '/' && location.hash) {
      if (path === '/about' && location.hash === 'about') return true;
      if (path === '/departments' && location.hash === 'departments') return true;
    }
    return false;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      // Already on home, scroll to top
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/departments', label: 'Events' },
    { path: '/mainevent', label: 'MainEvents' },
  ];

  return (
    <>
      {/* (Logo for Home is rendered inside the HomePage hero) */}
      {/* Desktop Navigation */}
      <motion.nav 
        className="fixed top-8 left-1/2 -translate-x-1/2 z-50 hidden lg:block"
        initial={{ y: -100, opacity: 0 }}
        animate={visible ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
        transition={{ duration: 0.35 }}
        style={{ pointerEvents: visible ? 'auto' : 'none' }}
      >
        <div className="flex items-center gap-3">
          {/* Left Pill - College Branding */}
         

          {/* Center - Navigation Links */}
          <div className="bg-white/90 backdrop-blur-sm px-8 py-3 rounded-full shadow-lg border border-[#C65D3B]/20">
            <div className="flex items-center gap-6">
              {navLinks.map(({ path, label }) => {
                // Home link special handling: scroll to top if already on home
                if (path === '/') {
                  return (
                    <Link
                      key={path}
                      to={path}
                      onClick={handleHomeClick}
                      className={`relative transition-colors duration-200 ${
                        isActive(path) ? 'text-[#C65D3B]' : 'text-[#2A2A2A] hover:text-[#C65D3B]'
                      }`}
                    >
                      {label}
                      {isActive(path) && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C65D3B]"
                        />
                      )}
                    </Link>
                  );
                }

                // Use in-page anchors when on home for About/Departments
                if (location.pathname === '/' && (path === '/about' || path === '/departments')) {
                  const anchor = path === '/about' ? 'about' : 'departments';
                  return (
                    <a
                      key={path}
                      href={anchor}
                      className={`relative transition-colors duration-200 ${
                        isActive(path) ? 'text-[#C65D3B]' : 'text-[#2A2A2A] hover:text-[#C65D3B]'
                      }`}
                    >
                      {label}
                      {isActive(path) && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C65D3B]"
                        />
                      )}
                    </a>
                  );
                }

                return (
                  <Link
                    key={path}
                    to={path}
                    className={`relative transition-colors duration-200 ${
                      isActive(path) ? 'text-[#C65D3B]' : 'text-[#2A2A2A] hover:text-[#C65D3B]'
                    }`}
                  >
                    {label}
                    {isActive(path) && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C65D3B]"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Pill - Tech Fest Branding */}
         

          {/* Logout Button - Admin Only */}
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-full flex items-center gap-2 shadow-lg transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </motion.button>
          )}
        </div>

        {/* Decorative circuit line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C65D3B]/20 to-transparent -z-10" />
      </motion.nav>

      {/* Mobile Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 lg:hidden"
        initial={{ y: -100, opacity: 0 }}
        animate={visible ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
        transition={{ duration: 0.35 }}
        style={{ pointerEvents: visible ? 'auto' : 'none' }}
      >
        <div >
          
            <button style={{"position": "absolute", "top": "1.5rem", "right": "1.5rem"}}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-full left bg-[#2A2A2A] flex items-center justify-center text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
      

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-[#C65D3B]/20 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-0">
                {navLinks.map(({ path, label }, index) => (
                  <>
                    <Link
                      key={path}
                      to={path}
                      onClick={(e) => {
                        setMobileMenuOpen(false);
                        if (path === '/') {
                          handleHomeClick(e);
                        }
                      }}
                      className={`block px-4 py-3 rounded-xl transition-colors ${
                        isActive(path)
                          ? 'bg-[#C65D3B] text-white'
                          : 'text-[#2A2A2A] hover:bg-[#C65D3B]/10'
                      }`}
                    >
                      {label}
                    </Link>
                    {index < navLinks.length - 1 && (
                      <div className="h-px bg-[#C65D3B]/20" />
                    )}
                  </>
                ))}
                {isAdmin && (
                  <>
                    <div className="h-px bg-[#C65D3B]/20" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors font-medium flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}