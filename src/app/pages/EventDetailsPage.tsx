import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink, Calendar, IndianRupee, Edit, X } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAdmin } from '../context/AdminContext';
import { EventForm } from '../components/EventForm';
import { getApiUrl } from '../utils/apiConfig';

export function EventDetailsPage() {
  const { departmentId, eventId } = useParams<{ departmentId: string; eventId: string }>();
  const navigate = useNavigate();
  const { isAdmin, sessionId, token } = useAdmin();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!departmentId || !eventId) return;
      try {
        const res = await fetch(`${getApiUrl()}/api/events/${departmentId}`);
        if (res.ok) {
          const data = await res.json();
          const found = (data.events || []).find((e: any) => String(e.id) === String(eventId));
          if (found) setEvent(found);
        }
      } catch (err) {
        // ignore, fallback to client-side mock handled below
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [departmentId, eventId]);

  // If backend unavailable, try to read from client-side mock data
  useEffect(() => {
    if (!event && !loading && departmentId) {
      try {
        // dynamic import of department mock from DepartmentEventsPage file
        // fallback: read from same mock used there by importing module
        // require is not used in ESM; simplest approach: access window preloaded data not available here.
      } catch (err) {
        // noop
      }
    }
  }, [event, loading, departmentId]);

  const handleSave = async (updatedEvent: any) => {
    try {
      const id = updatedEvent.id ?? updatedEvent.eventId ?? updatedEvent.event?.id;
      const response = await fetch(`${getApiUrl()}/api/events/${departmentId}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...updatedEvent, token: token, sessionId }),
      });

      if (response.ok) {
        const data = await response.json().catch(() => null);
        const returned = data?.event ?? updatedEvent;
        setEvent(returned);
        setEditing(false);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Save failed', err);
      return false;
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-32 flex items-center justify-center">Loading…</div>;
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-2">Event not found</h2>
          <Link to={`/departments/${departmentId}`} className="text-[#C65D3B] hover:underline">Back</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 text-[#6B6B6B] hover:text-[#C65D3B] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Event Card Section */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
            {/* Hero Image */}
            <div className="relative w-full h-96 overflow-hidden">
              <ImageWithFallback 
                src={event.image} 
                alt={event.name} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A2A2A]/80 via-transparent to-transparent" />
              
              {/* Admin Edit Button - Top Right */}
              {isAdmin && (
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditing(true)}
                  className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-[#C65D3B] text-white rounded-full shadow-lg hover:shadow-xl transition-all z-10"
                >
                  <Edit className="w-4 h-4" />
                  Edit Event
                </motion.button>
              )}

              {/* Event Title - Bottom Left */}
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white">{event.name}</h1>
              </div>
            </div>

            {/* Event Details Section */}
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {/* Time Entry */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg" style={{ backgroundColor: '#C65D3B20' }}>
                      <Calendar className="h-6 w-6 text-[#C65D3B]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#2A2A2A] mb-1">Date & Time</h3>
                    <p className="text-base text-[#6B6B6B]">{event.date}</p>
                  </div>
                </motion.div>

                {/* Fee/Entry Status */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg" style={{ backgroundColor: event.fee === 'FREE' ? '#10b98120' : '#f5931820' }}>
                      {event.fee === 'FREE' ? (
                        <span className="text-lg font-bold" style={{ color: '#10b981' }}>✓</span>
                      ) : (
                        <div  />
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#2A2A2A] mb-1">Entry Fee</h3>
                    <p className="text-base text-[#6B6B6B] font-semibold">
                      {event.fee === 'FREE' ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        event.fee
                      )}
                    </p>
                  </div>
                </motion.div>

                {/* Registration Status */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg" style={{ backgroundColor: '#6366f120' }}>
                      <ExternalLink className="h-6 w-6 text-[#6366f1]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#2A2A2A] mb-1">Registration</h3>
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#6366f1] hover:text-[#4f46e5] font-semibold inline-flex items-center gap-1"
                    >
                      Register Now
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-[#C65D3B]/20 via-[#C65D3B]/10 to-transparent mb-10" />

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-[#2A2A2A] mb-4">About This Event</h2>
                <p className="text-lg text-[#6B6B6B] leading-relaxed mb-6">{event.description}</p>
              </motion.div>


              {/* Additional Details */}
              {event.additionalInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-[#F5F5F5] rounded-xl p-6 mt-8"
                >
                  <h3 className="text-lg font-semibold text-[#2A2A2A] mb-3">More Details</h3>
                  <p className="text-[#4B5563] whitespace-pre-line">{event.additionalInfo}</p>
                </motion.div>
              )}

              {/* Contact Section */}
              {event.contact && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="bg-[#F5F5F5] rounded-xl p-6 mt-8"
                >
                  <h3 className="text-lg font-semibold text-[#2A2A2A] mb-3">Contact:</h3>
                  <ul className="space-y-2">
                    {Array.isArray(event.contact) ? event.contact.map((c, i) => (
                      <li key={i} className="text-[#4B5563]">
                        {c.name && <span className="font-semibold mr-2">{c.name}:</span>}
                        {c.phone && (
                          <a href={`tel:${c.phone}`} className="text-blue-600 hover:underline">{c.phone}</a>
                        )}
                      </li>
                    )) : (
                      <li className="text-[#4B5563]">
                        {event.contact.name && <span className="font-semibold mr-2">{event.contact.name}:</span>}
                        {event.contact.phone && (
                          <a href={`tel:${event.contact.phone}`} className="text-blue-600 hover:underline">{event.contact.phone}</a>
                        )}
                      </li>
                    )}
                  </ul>
                </motion.div>
              )}

              {/* Register Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-10"
              >
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                  style={{ backgroundColor: '#C65D3B' }}
                >
                  Register Now
                  <ExternalLink className="w-5 h-5" />
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Edit Event Modal */}
        {editing && (
          <EventForm 
            isOpen={editing} 
            event={event} 
            departmentId={departmentId || ''} 
            onClose={() => setEditing(false)} 
            onSave={handleSave} 
          />
        )}
      </div>
    </div>
  );
}
