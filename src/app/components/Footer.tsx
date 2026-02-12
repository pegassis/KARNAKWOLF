import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Globe, MessageCircle, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="relative bg-[#0F0F0F] text-white mt-32 overflow-hidden">
      {/* Tech Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="tech-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="white" />
              <line x1="50" y1="50" x2="100" y2="50" stroke="white" strokeWidth="1" />
              <line x1="50" y1="50" x2="50" y2="100" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tech-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* About Section */}
          <div>
            <h3 className="text-xl mb-4 text-[#FF6B35]">About KARNAK</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Technical festival showcasing innovation, creativity, and technological excellence across multiple engineering domains.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://www.facebook.com/mbitsnellimattom?mibextid=LQQJ4d" className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FF6B35] transition-colors duration-200 flex items-center justify-center">
                <Facebook className="w-5 h-5" />
              </a>
              
              <a href="https://www.instagram.com/mbits_kothamangalam/?hl=en" className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FF6B35] transition-colors duration-200 flex items-center justify-center">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/organization-guest/mwlite/school/mbits-nellimattom" className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FF6B35] transition-colors duration-200 flex items-center justify-center">
                <Linkedin className="w-5 h-5" />
              </a>
              
              <a href="https://api.whatsapp.com/send/?phone=919061063801&text&type=phone_number&app_absent=0" className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FF6B35] transition-colors duration-200 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </a>
              
              <a href="https://www.youtube.com/@mbitsnellimattom1479" className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FF6B35] transition-colors duration-200 flex items-center justify-center">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl mb-4 text-[#FF6B35]">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-300 hover:text-[#C65D3B] transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-[#C65D3B] transition-colors duration-200">
                  About
                </a>
              </li>
              <li>
                <a href="/departments" className="text-gray-300 hover:text-[#C65D3B] transition-colors duration-200">
                  Departments
                </a>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-300 hover:text-[#C65D3B] transition-colors duration-200">
                  Gallery
                </Link>
              </li>
              <li>
                <a href="https://mbits.ac.in/contact-us/" className="text-gray-300 hover:text-[#C65D3B] transition-colors duration-200">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl mb-4 text-[#FF6B35]">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-[#FF6B35] flex-shrink-0" />
                <a href="https://www.google.com/maps?um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KfnycxfC6Ac7MZx62tdHgsz4&daddr=Kochi+-+Madurai+-+Dhanushkodi+Road,+Nellimattam,+Ernakulam+District,+Kothamangalam,+Kerala+686693"  className="text-gray-300 hover:text-[#C65D3B] transition-colors">
                  Mar Baselios Institute of Technology and Science<br />
                  Nellimattom P.O, Kothamangalam,
                  Ernakulam District,
                  Kerala, India, PIN : 686693
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#FF6B35] flex-shrink-0" />
                <a href="mailto:info@mbits.ac.in" className="text-gray-300 hover:text-[#C65D3B] transition-colors">
                 info@mbits.ac.in
                </a>
              </li>
               <li className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#FF6B35] flex-shrink-0" />
                <a href="https://mbits.ac.in/" className="text-gray-300 hover:text-[#C65D3B] transition-colors">
                  MBITS
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#C65D3B] flex-shrink-0" />
                <a href="tel:+919876543210" className="text-gray-300 hover:text-[#C65D3B] transition-colors">
                  +91 94467 35380
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="relative h-px bg-white/10 my-8">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-[#C65D3B]" />
            <div className="w-2 h-2 rounded-full bg-[#B8956A]" />
            <div className="w-2 h-2 rounded-full bg-[#5BA3A3]" />
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm">
          <p>&copy; 2026 KARNAK - Mar Baselios Institute of Technology and Science. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
