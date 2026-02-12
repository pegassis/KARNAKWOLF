import { motion } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Award, Target, Users, Lightbulb } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-16">
      {/* About the Fest Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-7xl mb-6">About KARNAK</h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#C65D3B]" />
            <div className="w-24 h-1 bg-gradient-to-r from-[#C65D3B] to-[#B8956A]" />
            <div className="w-2 h-2 rounded-full bg-[#B8956A]" />
            <div className="w-24 h-1 bg-gradient-to-r from-[#B8956A] to-[#5BA3A3]" />
            <div className="w-2 h-2 rounded-full bg-[#5BA3A3]" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="/pics/abtkarnak.png"
                alt="Tech fest event"
                className="w-full h-[380px] sm:h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A2A2A]/60 to-transparent" />
            </div>
            {/* Decorative corner */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border-4 border-[#C65D3B] rounded-3xl -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-4xl mb-6 text-[#C65D3B]">Tech Fest</h2>
            <p className="text-lg text-[#B0B0B0] leading-relaxed mb-4">
              KARNAK is amongst the most awaited techno-cultural event being organized by MBITS.  
              KARNAK is a 6-day event that will feature music, dance, arts, cultural and technical events.
              Our Tech Fest gives young minds an opportunity to showcase their skills and compete with other likeminded individuals and the best talent will emerge as the winner.
            </p>
            <p className="text-lg text-[#B0B0B0] leading-relaxed mb-4">
             Sports and games not only create a lively environment in the campus, it also gives a platform for the students to develop their motor skills, 
             leadership quality, refine their respective sporting skills.
            </p>
            <p className="text-lg text-[#B0B0B0] leading-relaxed">
              MBITS feels proud to organize KARNAK as a successful event and would like to convey thanks to management and principal 
              for their timely advice and cooperation for organizing successful Fest
            </p>

            {/* Key highlights */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#C65D3B]/10 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-[#C65D3B]" />
                </div>
                <div>
                  <div className="text-sm text-[#6B6B6B]">High Level</div>
                  <div className="text-[#2A2A2A]">Recognition</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#B8956A]/10 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-[#B8956A]" />
                </div>
                <div>
                  <div className="text-sm text-[#6B6B6B]">50+ Events</div>
                  <div className="text-[#2A2A2A]">Across Domains</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#5BA3A3]/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-[#5BA3A3]" />
                </div>
                <div>
                  <div className="text-sm text-[#6B6B6B]">5000+</div>
                  <div className="text-[#2A2A2A]">Participants</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#C65D3B]/10 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-[#C65D3B]" />
                </div>
                <div>
                  <div className="text-sm text-[#6B6B6B]">Innovation</div>
                  <div className="text-[#2A2A2A]">Focused</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Circuit Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-32">
        <div className="relative h-px bg-gradient-to-r from-transparent via-[#C65D3B]/30 to-transparent">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3">
            <div className="w-3 h-3 rounded-full bg-[#C65D3B] ring-4 ring-[#C65D3B]/20" />
            <div className="w-3 h-3 rounded-full bg-[#B8956A] ring-4 ring-[#B8956A]/20" />
            <div className="w-3 h-3 rounded-full bg-[#5BA3A3] ring-4 ring-[#5BA3A3]/20" />
          </div>
        </div>
      </div>

      {/* About the College Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl mb-6 text-[#C65D3B]">About MBITS</h2>
            <h3 className="text-2xl mb-4 text-[#22222]">
              Mar Baselios Institute of Technology and Science
            </h3>
            <p className="text-lg text-[#B0B0B0] leading-relaxed mb-4">
              Mar Baselios Institute of Technology and Science (MBITS), Kothamangalam, Cochin, Kerala was started 
              in the year 2009 upholding the motto, “Wisdom Crowns Knowledge” and aims to provide quality higher education at par with international standards.
               The institute offers various B.Tech and M.Tech courses at highly affordable fee structures and with scholarships provided by Mar Thoma Cheria pally, Kothamangalam and the Government of India. 
              The global standards set at MBITS in the field of teaching and research constantly encourage students to a relentless pursuit of excellence through highly experienced teachers.
              
            </p>
            <p className="text-lg text-[#B0B0B0] leading-relaxed mb-6">
             The institute imparts innovative technical education and gives importance to discipline, result, and campus placement and prepare the students technologically superior and ethically strong.
               MBITS is equipped with the most modern facilities required for study, practice, consultancy and research centres, serving regional needs. It also promotes students’ co-curricular and extra-curricular activities. 
               We are committed to nurturing our students’ talents and providing them with the skills they need to succeed in the global workforce.
              We are thrilled to be recognized for our efforts and are motivated to continue providing excellent education to our students.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white rounded-2xl shadow-md border border-gray-100">
                <div className="text-3xl text-[#C65D3B] mb-1">16+</div>
                <div className="text-sm text-[#6B6B6B]">Years</div>
              </div>
              <div className="text-center p-4 bg-white rounded-2xl shadow-md border border-gray-100">
                <div className="text-3xl text-[#B8956A] mb-1">15</div>
                <div className="text-sm text-[#6B6B6B]">Departments</div>
              </div>
              <div className="text-center p-4 bg-white rounded-2xl shadow-md border border-gray-100">
                <div className="text-3xl text-[#5BA3A3] mb-1">2000+</div>
                <div className="text-sm text-[#6B6B6B]">Students</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="/pics/mbits.jpeg"
                alt="MBITS Campus"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A2A2A]/60 to-transparent" />
            </div>
            {/* Decorative corner */}
            <div className="absolute -top-4 -left-4 w-32 h-30 border-4 border-[#B8956A] rounded-3xl -z-10" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}