import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Cpu, Zap, Cog, Building2, Lightbulb, Hammer } from 'lucide-react';
// import StarBorder from '../components/StarBorder';

const departments = [
   {
    id: 'civil',
    name: 'Civil',
    icon: Building2,
    color: '#C65D3B',
    description: 'Structures, Design, Planning',
    gradient: 'from-[#C65D3B]/20 to-[#C65D3B]/5'
  },
    {
    id: 'mechanical',
    name: 'Mechanical',
    icon: Cog,
    color: '#5BA3A3',
    description: 'Robotics, CAD, Manufacturing',
    gradient: 'from-[#5BA3A3]/20 to-[#5BA3A3]/5'
  },
   {
    id: 'electrical',
    name: 'Electrical',
    icon: Lightbulb,
    color: '#B8956A',
    description: 'Power Systems, Control, Energy',
    gradient: 'from-[#B8956A]/20 to-[#B8956A]/5'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: Zap,
    color: '#B8956A',
    description: 'Circuits, Embedded Systems, IoT',
    gradient: 'from-[#B8956A]/20 to-[#B8956A]/5'
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    icon: Cpu,
    color: '#C65D3B',
    description: 'Coding, AI, Web Dev, Cybersecurity',
    gradient: 'from-[#C65D3B]/20 to-[#C65D3B]/5'
  },
  {
    id: 'general',
    name: 'Computer Applications',
    icon: Hammer,
    color: '#5BA3A3',
    description: 'Cross-domain, Workshops, Talks',
    gradient: 'from-[#5BA3A3]/20 to-[#5BA3A3]/5'
  }
];

export function DepartmentsPage() {
  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-7xl mb-6">Departments</h1>
          <p className="text-xl text-[#6B6B6B] max-w-2xl mx-auto mb-8">
            Select a department to explore events and competitions
          </p>
          
          {/* Decorative Circuit Underline */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#C65D3B]" />
            <div className="w-24 h-1 bg-gradient-to-r from-[#C65D3B] to-[#B8956A]" />
            <div className="w-3 h-3 rounded-full bg-[#B8956A] ring-4 ring-[#B8956A]/20" />
            <div className="w-24 h-1 bg-gradient-to-r from-[#B8956A] to-[#5BA3A3]" />
            <div className="w-2 h-2 rounded-full bg-[#5BA3A3]" />
          </div>
        </motion.div>

        {/* Department Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept, index) => {
            const Icon = dept.icon;
            
            return (
              <div key={dept.id} className="w-full h-full">
                <Link to={`/departments/${dept.id}`} className="block w-full h-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${dept.gradient}`} />
                  
                  {/* Tech Pattern Overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id={`pattern-${dept.id}`} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                          <circle cx="30" cy="30" r="2" fill={dept.color} />
                          <line x1="30" y1="30" x2="60" y2="30" stroke={dept.color} strokeWidth="1" />
                          <line x1="30" y1="30" x2="30" y2="60" stroke={dept.color} strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#pattern-${dept.id})`} />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-8">
                    {/* Icon */}
                    <div className="flex justify-between items-start">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                      >
                        <Icon className="w-8 h-8" style={{ color: dept.color }} />
                      </div>

                      {/* Hover arrow */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center"
                      >
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke={dept.color}
                          strokeWidth="2"
                        >
                          <path d="M5 12h14m-7-7 7 7-7 7" />
                        </svg>
                      </motion.div>
                    </div>

                    {/* Text */}
                    <div>
                      <h3 
                        className="text-3xl mb-2 group-hover:translate-x-2 transition-transform duration-300"
                        style={{ color: dept.color }}
                      >
                        {dept.name}
                      </h3>
                      <p className="text-[#6B6B6B]">
                        {dept.description}
                      </p>
                    </div>
                  </div>

                  {/* Border glow on hover */}
                  <div 
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ 
                      boxShadow: `inset 0 0 0 2px ${dept.color}40`
                    }}
                  />

                  {/* Corner decoration */}
                  <div className="absolute top-4 right-4 w-24 h-24 opacity-20">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="40" stroke={dept.color} strokeWidth="2" />
                      <circle cx="50" cy="50" r="25" stroke={dept.color} strokeWidth="1" />
                      <circle cx="50" cy="50" r="5" fill={dept.color} />
                      <line x1="50" y1="10" x2="50" y2="25" stroke={dept.color} strokeWidth="2" />
                      <line x1="50" y1="75" x2="50" y2="90" stroke={dept.color} strokeWidth="2" />
                      <line x1="10" y1="50" x2="25" y2="50" stroke={dept.color} strokeWidth="2" />
                      <line x1="75" y1="50" x2="90" y2="50" stroke={dept.color} strokeWidth="2" />
                    </svg>
                  </div>
                </motion.div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 p-8 bg-[#1A1A1A] rounded-3xl shadow-lg border border-[#FF6B35]/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FF6B35]/10 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-[#FF6B35]" />
            </div>
            <div>
              <h3 className="text-xl mb-2 text-[#E8E8E8]">Ready to participate?</h3>
              <p className="text-[#B0B0B0] leading-relaxed">
                Click on any department to view all events. Each event card will have a registration button 
                that redirects you to the official registration form. Make sure to read the event details 
                carefully before registering.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}