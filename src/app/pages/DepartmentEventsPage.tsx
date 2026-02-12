import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, IndianRupee, Users, ExternalLink, Edit, Trash, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { EventForm } from '../components/EventForm';
import { VideoModal } from '../components/VideoModal';
import Lightning from '../components/Lightning';
import LetterGlitch from '../components/LetterGlitch';
import ElectricBorder from '../components/ElectricBorder';
import GridMotion from '../components/GridMotion';

import { useAdmin } from '../context/AdminContext';
import { getApiUrl, checkBackendHealth } from '../utils/apiConfig';
import { getStoredDepartmentEvents, initializeStorage, updateStoredEvent, addStoredEvent, deleteStoredEvent, saveStoredEvents } from '../utils/storageManager';


interface Event {
  id: number;
  name: string;
  tagline: string;
  description: string;
  date: string;
  fee: string;
  prize?: string;
  image: string;
  registrationUrl: string;
  venue?: string;
}

// Mock events data for each department
const departmentEvents: Record<string, any> = {
  'computer-science': {
    name: 'Computer Science',
    color: '#FF6B35',
    events: [
      {
        id: 1,
        name: 'Code Sprint',
        tagline: 'Race against time',
        description: 'Competitive programming challenge',
        date: 'March 15, 2026',
        fee: '₹200',
        venue: 'L1 - 101',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
        registrationUrl: 'https://forms.google.com/example1',
        contact: { name: 'John Doe', phone: '9876543210' }
      },
      {
        id: 2,
        name: 'AI Hackathon',
        tagline: 'Build the future',
        description: '24-hour AI/ML hackathon',
        date: 'March 16, 2026',
        fee: '₹500',
        venue: 'Central Auditorium',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
        registrationUrl: 'https://forms.google.com/example2',
        contact: { name: 'Jane Smith', phone: '9123456780' }
      },
      {
        id: 3,
        name: 'Web Warriors',
        tagline: 'Design meets code',
        description: 'Full-stack web development',
        date: 'March 17, 2026',
        fee: '₹300',
        venue: 'L1 - 201',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
        registrationUrl: 'https://forms.google.com/example3',
        contact: { name: 'Alex Lee', phone: '9988776655' }
      },
      {
        id: 4,
        name: 'Cyber Quest',
        tagline: 'Hack the planet',
        description: 'Cybersecurity CTF challenge',
        date: 'March 18, 2026',
        fee: 'FREE',
        venue: 'L2 - 105',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80',
        registrationUrl: 'https://forms.google.com/example4',
        contact: { name: 'Priya Kumar', phone: '9001122334', }
       
      },
      {
        id: 5,
        name: 'Tech Quiz',
        tagline: 'Test your knowledge',
        description: 'Technology quiz competition',
        date: 'March 19, 2026',
        fee: 'FREE',
        venue: 'L1 - 301',
        image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&q=80',
        registrationUrl: 'https://forms.google.com/example5',
        contact: { name: 'Ravi Patel', phone: '9876501234' }
      },
      {
        id: 6,
        name: 'Mobile Dev Challenge',
        tagline: 'Apps that matter',
        description: 'Cross-platform app development',
        date: 'March 20, 2026',
        fee: '₹400',
        venue: 'Central Lab',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
        registrationUrl: 'https://forms.google.com/example6',
        contact: { name: 'Fatima Noor', phone: '9090909090' }
      }
    ]
  },
  'electronics': {
    name: 'Electronics',
    color: '#FFA500',
    events: [
      {
        id: 1,
        name: 'Circuit Master',
        tagline: 'Wire your way to victory',
        description: 'Circuit design and debugging',
        date: 'March 15, 2026',
        fee: '₹250',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
        registrationUrl: 'https://forms.google.com/example7',
        contact: { name: 'Rahul Mehra', phone: '9812345678' }
      },
      {
        id: 2,
        name: 'IoT Innovation',
        tagline: 'Connect everything',
        description: 'Build smart IoT solutions',
        date: 'March 16, 2026',
        fee: '₹400',
        image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=600&q=80',
        registrationUrl: 'https://forms.google.com/example8',
        contact: { name: 'Sneha Roy', phone: '9823456781' }
      },
      {
        id: 3,
        name: 'Embedded Challenge',
        tagline: 'Code meets hardware',
        description: 'Embedded systems programming',
        date: 'March 17, 2026',
        fee: '₹350',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80',
        registrationUrl: 'https://forms.google.com/example9',
        contact: { name: 'Vikram Singh', phone: '9834567812' }
      },
      {
        id: 4,
        name: 'PCB Design Contest',
        tagline: 'Design precision boards',
        description: 'Professional PCB design',
        date: 'March 18, 2026',
        fee: '₹300',
        image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&q=80',
        registrationUrl: 'https://forms.google.com/example10',
        contact: { name: 'Aarti Sharma', phone: '9845678123' }
      }
    ]
  },
  'mechanical': {
    name: 'Mechanical',
    color: '#FF8C5A',
    events: [
      {
        id: 1,
        name: 'Robo Race',
        tagline: 'Speed and precision',
        description: 'Autonomous robot racing',
        date: 'March 15, 2026',
        fee: '₹500',
        image: 'https://images.unsplash.com/photo-1561144257-e32e8eef8e8e?w=600&q=80',
        registrationUrl: 'https://forms.google.com/example11',
        contact: { name: 'Suresh Babu', phone: '9856781234' }
      },
      {
        id: 2,
        name: 'CAD Master',
        tagline: 'Design excellence',
        description: '3D modeling competition',
        date: 'March 16, 2026',
        fee: '₹250',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80',
        registrationUrl: 'https://forms.google.com/example12',
        contact: { name: 'Meena Pillai', phone: '9867812345' }
      },
      {
        id: 3,
        name: 'Bridge Build',
        tagline: 'Engineering strength',
        description: 'Build the strongest bridge',
        date: 'March 17, 2026',
        fee: '₹400',
        image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600&q=80',
        registrationUrl: 'https://forms.google.com/example13',
        contact: { name: 'Arjun Das', phone: '9878123456' }
      },
      {
        id: 4,
        name: 'Hydraulic Challenge',
        tagline: 'Pressure engineering',
        description: 'Design hydraulic systems',
        date: 'March 18, 2026',
        fee: '₹350',
        image: 'https://images.unsplash.com/photo-1581094794329-c8112e89af45?w=600&q=80',
        registrationUrl: 'https://forms.google.com/example14',
        contact: { name: 'Divya Nair', phone: '9881234567' }
      }
    ]
  },
  'civil': {
    name: 'Civil',
    color: '#FF6B35',
    events: [
      {
        id: 1,
        name: 'Structure Design',
        tagline: 'Build foundations',
        description: 'Structural engineering design',
        date: 'March 15, 2026',
        fee: '₹300',
        image: '/depfolds/civ/trial1.jpeg',
        registrationUrl: 'https://forms.google.com/example15',
        contact: { name: 'Karthik Rao', phone: '9891234567' }
      },
      {
        id: 2,
        name: 'City Planning',
        tagline: 'Design tomorrow',
        description: 'Urban planning competition',
        date: 'March 16, 2026',
        fee: '₹250',
        image: '/depfolds/civ/trial1.jpeg',
        registrationUrl: 'https://forms.google.com/example16',
        contact: { name: 'Shalini Menon', phone: '9901234567' }
      },
      {
        id: 3,
        name: 'AutoCAD Challenge',
        description: 'Technical drawing competition.JAGSJJAERBHBKFBLHBABHBIAEIRIUBBEA.&nbsp;',
        date: 'March 17, 2026',
        fee: '₹200',
        prize:'₹10,000',
        image: '/depfolds/civ/trial1.jpeg',
        registrationUrl: 'https://forms.google.com/example17',
        contact: { name: 'Mohit Verma', phone: '9912345678' }
      }
    ]
  },
  'electrical': {
    name: 'Electrical',
    color: '#FFA500',
    events: [
      {
        id: 1,
        name: 'Power Grid',
        tagline: 'Energize the future',
        description: 'Power systems design',
        date: 'March 15, 2026',
        fee: '₹300',
        image: '/depfolds/civ/trial1.jpeg',
        registrationUrl: 'https://forms.google.com/example18',
        contact: { name: 'Anil Joshi', phone: '9923456781' }
      },
      {
        id: 2,
        name: 'Motor Control',
        tagline: 'Precision automation',
        description: 'Electric motor control systems',
        date: 'March 16, 2026',
        fee: '₹350',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80',
        registrationUrl: 'https://forms.google.com/example19',
        contact: { name: 'Sunita Rao', phone: '9934567812' }
      },
      {
        id: 3,
        name: 'Renewable Energy',
        tagline: 'Green solutions',
        description: 'Sustainable energy projects',
        date: 'March 17, 2026',
        fee: 'FREE',
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80',
        registrationUrl: 'https://forms.google.com/example20',
        contact: { name: 'Rakesh Gupta', phone: '9945678123' }
      }
    ]
  },
  'general': {
    name: 'Computer Applications',
    color: '#FF8C5A',
    events: [
      {
        id: 1,
        name: 'Innovation Summit',
        tagline: 'Ideas that inspire',
        description: 'Cross-domain innovation showcase',
        date: 'March 15, 2026',
        fee: 'FREE',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
        registrationUrl: 'https://forms.google.com/example21',
        contact: { name: 'Nisha Jain', phone: '9956781234' }
      },
      {
        id: 2,
        name: 'Tech Talk Series',
        tagline: 'Learn from experts',
        description: 'Industry expert sessions',
        date: 'March 16-18, 2026',
        fee: 'FREE',
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80',
        registrationUrl: 'https://forms.google.com/example22',
        contact: { name: 'Aman Kapoor', phone: '9967812345' }
      },
      {
        id: 3,
        name: 'Paper Presentation',
        tagline: 'Research showcase',
        description: 'Present your research',
        date: 'March 17, 2026',
        fee: '₹150',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
        registrationUrl: 'https://forms.google.com/example23',
        contact: { name: 'Farhan Ali', phone: '9978123456' }
      },
      {
        id: 4,
        name: 'Startup Pitch',
        tagline: 'From idea to reality',
        description: 'Pitch your startup idea',
        date: 'March 18, 2026',
        fee: '₹200',
        image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80',
        registrationUrl: 'https://forms.google.com/example24',
        contact: { name: 'Geeta Reddy', phone: '9981234567' }
      }
    ]
  }
};

export function DepartmentEventsPage() {
  const { departmentId } = useParams<{ departmentId: string }>();
  const { isAdmin, sessionId, token } = useAdmin();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [isEditingModal, setIsEditingModal] = useState(false);
  const [editFormData, setEditFormData] = useState<any>(null);

  const department = departmentId ? departmentEvents[departmentId] : null;

  // Show video modal only once after component mounts for mechanical department
  useEffect(() => {
    if (departmentId === 'mechanical') {
      setShowVideoModal(true);
    }
  }, [departmentId]);

  // Initialize localStorage with mock data once on component mount
  useEffect(() => {
    initializeStorage(departmentEvents);
  }, []);

  // Check backend health on mount
  useEffect(() => {
    const checkHealth = async () => {
      const isHealthy = await checkBackendHealth();
      setBackendAvailable(isHealthy);
    };
    checkHealth();
  }, []);

  // Fetch events from backend first, fall back to localStorage
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Only fetch from backend if backend is healthy
        if (backendAvailable) {
          const response = await fetch(`${getApiUrl()}/api/events/${departmentId}`);
          if (response.ok) {
            const data = await response.json();
            const backendEvents = data.events || [];
            setEvents(backendEvents);
            
            // Save backend events to localStorage for offline use
            if (departmentId && backendEvents.length > 0) {
              const allStored = { ...departmentEvents };
              if (allStored[departmentId]) {
                allStored[departmentId].events = backendEvents;
                saveStoredEvents(allStored);
              }
            }
          } else {
            // Backend returned error, use default mock data
            setEvents(department?.events || []);
          }
        } else {
          // Backend not available, use default mock data
          setEvents(department?.events || []);
        }
      } catch (err) {
        // If backend fails, use default mock data (not localStorage with admin changes)
        setEvents(department?.events || []);
      } finally {
        setLoading(false);
      }
    };

    if (departmentId) {
      fetchEvents();
    }
  }, [departmentId, department, backendAvailable]);

  const handleEditEvent = (event: Event) => {
    if (!backendAvailable) {
      alert('Backend is not running. Admin operations are disabled.');
      return;
    }
    setEditingEvent(event);
    setFormOpen(true);
  };

  const handleAddNew = () => {
    if (!backendAvailable) {
      alert('Backend is not running. Admin operations are disabled.');
      return;
    }
    const newEvent: Event = {
      id: 0,
      name: '',
      tagline: '',
      description: '',
      date: '',
      fee: 'FREE',
      prize: '',
      image: '',
      registrationUrl: ''
    };
    setEditingEvent(newEvent);
    setFormOpen(true);
  };

  const handleSaveEvent = async (updatedEvent: any): Promise<boolean> => {
    if (!backendAvailable) {
      alert('Backend is not running. Cannot save changes.');
      return false;
    }

    if (!token || !sessionId) {
      console.error('Admin not authenticated');
      return false;
    }

    try {
      console.debug('[handleSaveEvent] editingEvent id:', editingEvent?.id, 'updatedEvent.id:', updatedEvent.id);
      // Prefer the editingEvent's id if available to avoid accidental creates
      const editingId = editingEvent && editingEvent.id ? Number(editingEvent.id) : undefined;
      const providedId = updatedEvent.id !== undefined && updatedEvent.id !== null ? Number(updatedEvent.id) : undefined;
      const id = editingId ?? providedId ?? 0;
      console.debug('[handleSaveEvent] computed ids -> editingId:', editingId, 'providedId:', providedId, 'using id:', id);

      // If id is not a positive integer, create a new event
      if (!Number.isInteger(id) || id <= 0) {
        console.debug('[handleSaveEvent] performing CREATE (POST) for', updatedEvent);
        const response = await fetch(`${getApiUrl()}/api/events/${departmentId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...updatedEvent,
            token: token,
            sessionId: sessionId
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const created = data.event;
          // Remove any temp item with id 0 (if present) and append created
          setEvents(prev => {
            const filtered = prev.filter(e => Number(e.id) !== 0);
            return [...filtered, created];
          });
          // Save to localStorage
          if (departmentId) {
            addStoredEvent(departmentId, created);
          }
          return true;
        } else if (response.status === 403) {
          console.error('Session expired. Please login again.');
          return false;
        }

        // Backend not available
        alert('Backend is not accessible. Cannot save changes.');
        return false;
      }

      // Update existing event using determined id
      console.debug('[handleSaveEvent] performing UPDATE (PUT) for id', id, 'with', updatedEvent);
      const response = await fetch(`${getApiUrl()}/api/events/${departmentId}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...updatedEvent,
          token: token,
          sessionId: sessionId
        }),
      });

      if (response.ok) {
        const data = await response.json().catch(() => null);
        const returned = data?.event ?? { ...updatedEvent, id };
        const returnedId = Number(returned.id ?? id);
        setEvents(prev => prev.map(e => (Number(e.id) === returnedId ? returned : e)));
        // Save to localStorage
        if (departmentId) {
          updateStoredEvent(departmentId, returnedId, returned);
        }
        return true;
      } else if (response.status === 403) {
        console.error('Session expired. Please login again.');
        return false;
      }

      // Backend not available
      alert('Backend is not accessible. Cannot save changes.');
      return false;
    } catch (err) {
      console.error('Failed to save event:', err);
      alert('Backend is not accessible. Cannot save changes.');
      return false;
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!backendAvailable) {
      alert('Backend is not running. Admin operations are disabled.');
      return;
    }

    if (!token || !sessionId) {
      alert('Admin not authenticated');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this event?');
    if (!confirmed) return;

    try {
      const response = await fetch(`${getApiUrl()}/api/events/${departmentId}/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token: token, sessionId: sessionId })
      });

      if (response.ok) {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        // Delete from localStorage
        if (departmentId) {
          deleteStoredEvent(departmentId, eventId);
        }
      } else if (response.status === 403) {
        alert('Session expired or unauthorized. Please login again.');
      } else {
        const err = await response.json().catch(() => ({}));
        alert(err.message || 'Failed to delete event');
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
      alert('Backend is not accessible. Cannot delete event.');
    }
  };

  if (!department) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl mb-4">Department Not Found</h1>
          <Link to="/departments" className="text-[#FF6B35] hover:underline">
            ← Back to Departments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-16 relative">
      {/* Lightning Background for Electronics Department */}
      {departmentId === 'electronics' && (
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
          <Lightning
            hue={30}
            xOffset={0}
            speed={1}
            intensity={1}
            size={1}
          />
        </div>
      )}
      {/* Admin Welcome Message */}
      {isAdmin && (
        <div className="max-w-2xl mx-auto mt-12 mb-12 p-10 rounded-3xl bg-black text-center border-4 border-[#FFA500] shadow-xl">
          <h1 className="text-5xl font-bold mb-8 text-[#FFA500]">WELCOME!</h1>
          <div className="text-3xl font-semibold text-[#FFA500] space-y-4">
            <div>LEEN LEO</div>
            <div>CHRISTEPHER C BIJU</div>
            <div>ARYAN CS</div>
          </div>
        </div>
      )}
      {/* LetterGlitch Background for Computer Science Department */}
      {departmentId === 'computer-science' && (
        <div className="fixed inset-0 top-0 left-0 w-full h-full z-0 opacity-15 pointer-events-none">
          <LetterGlitch
            glitchSpeed={50}
            centerVignette={true}
            outerVignette={false}
            smooth={true}
            glitchColors={['#22C55E', '#16A34A', '#86EFAC']}
          />
        </div>
      )}

      {/* GridMotion Background for Civil Department */}
      {departmentId === 'civil' && (
        <div className="fixed inset-0 top-0 left-0 w-full h-full z-0 pointer-events-none">
          <GridMotion
            items={[
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
              'https://wallpapercat.com/w/full/c/8/5/30761-3840x2160-desktop-4k-seven-wonders-wallpaper-photo.jpg',
            ]}
            gradientColor="black"
          />
        </div>
      )}
     
      {/* Video Modal for Mechanical Department */}
      <VideoModal
        isOpen={showVideoModal}
        videoSrc="/mectyre.mp4"
        onClose={() => setShowVideoModal(false)}
        autoPlay={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link 
            to="/departments" 
            className="inline-flex items-center gap-2 text-[#B0B0B0] hover:text-[#FF6B35] transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Departments
          </Link>

          <h1 
            className="text-6xl md:text-7xl mb-6"
            style={{ color: department.color }}
          >
            {department.name}
          </h1>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: department.color }} />
            <div className="w-24 h-1" style={{ background: `linear-gradient(to right, ${department.color}80, ${department.color}20)` }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: department.color, boxShadow: `0 0 0 4px ${department.color}20` }} />
            <div className="w-24 h-1" style={{ background: `linear-gradient(to right, ${department.color}20, transparent)` }} />
          </div>

          <p className="text-xl text-[#B0B0B0]">
            Explore all events and register through the official forms
          </p>
          {isAdmin && backendAvailable && (
            <div className="mt-6">
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-[#FF6B35] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                + Add Event
              </button>
            </div>
          )}
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(loading ? department.events : events).map((event: any, index: number) => {
            const eventCard = (
              <div className="rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-auto flex flex-col group cursor-pointer">
                {/* Event Poster - Full Height */}
                <div className="relative w-full h-[485px] overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2A2A2A]/80 via-transparent to-transparent" />
                </div>

                {/* View Details Button - Below Card */}
                <div className="p-4 bg-[#1A1A1A] flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowEventModal(true);
                    }}
                    className="w-full py-3 rounded-full flex items-center justify-center gap-2 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
                    style={{ backgroundColor: department.color }}
                  >
                    View Details
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </motion.button>
                </div>

                {/* Admin Edit/Delete Buttons - positioned on the top right */}
                {isAdmin && backendAvailable && (
                  <>
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteEvent(event.id)}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-red-600 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 z-10"
                      style={{ backgroundColor: '#e11d48' }}
                      title="Delete event"
                    >
                      <Trash className="w-5 h-5" />
                    </motion.button>

                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEditEvent(event)}
                      className="absolute top-4 right-16 w-10 h-10 rounded-full bg-[#FF6B35] text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 z-10"
                      style={{ backgroundColor: department.color }}
                      title="Edit event"
                    >
                      <Edit className="w-5 h-5" />
                    </motion.button>
                  </>
                )}

                {/* Border glow on hover */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 2px ${department.color}40` }}
                />
              </div>
            );

            return (
              <motion.div
                key={`${event.id ?? 'ev'}-${index}-${event.name?.replace(/\s+/g,'-') ?? ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                {departmentId === 'electrical' ? (
                  <ElectricBorder
                    color="#00D9FF"
                    speed={1}
                    chaos={0.12}
                    borderRadius={24}
                  >
                    {eventCard}
                  </ElectricBorder>
                ) : (
                  eventCard
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Info Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 p-6 bg-[#1A1A1A]/60 backdrop-blur-sm rounded-2xl border border-[#FF6B35]/20"
        >
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-[#FF6B35] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[#B0B0B0]">
                <strong className="text-[#E8E8E8]">Note:</strong> Clicking "Register Now" will redirect you to the official event description and 
                event registration page. Please fill out all required information accurately. 
                For queries, contact the event cordinators listed .
              </p>
            </div>
          </div>
        </motion.div>

        {/* Event Edit Form Modal */}
        {editingEvent && (
          <EventForm
            isOpen={formOpen}
            event={editingEvent}
            departmentId={departmentId || ''}
            onClose={() => {
              setFormOpen(false);
              setEditingEvent(null);
            }}
            onSave={handleSaveEvent}
            isNew={editingEvent.id === 0}
          />
        )}

        {/* Event Details Modal */}
        {showEventModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowEventModal(false);
              setIsEditingModal(false);
              setEditFormData(null);
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setIsEditingModal(false);
                  setEditFormData(null);
                }}
                className="absolute top-6 left-6 md:left-auto md:right-6 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all"
              >
                <X className="w-6 h-6 text-[#2A2A2A]" />
              </button>

              {/* Event Image */}
              <div className="relative w-full h-80 overflow-hidden">
                <ImageWithFallback
                  src={selectedEvent.image}
                  alt={selectedEvent.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A2A2A]/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-3xl font-bold text-white">{selectedEvent.name}</h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {!isEditingModal ? (
                  <>
                    {/* View Mode */}
                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                      {/* Date/Time */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[#C65D3B]">
                          <Calendar className="w-5 h-5" />
                          <span className="text-sm font-semibold">Date</span>
                        </div>
                        <p className="text-sm text-[#6B6B6B]">{selectedEvent.date}</p>
                      </div>

                      {/* Fee */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[#C65D3B]">
                          <IndianRupee className="w-5 h-5" />
                          <span className="text-sm font-semibold">Fee</span>
                        </div>
                        <p className="text-sm text-[#6B6B6B] font-semibold">
                          {selectedEvent.fee === 'FREE' ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            selectedEvent.fee
                          )}
                        </p>
                      </div>

                      {/* Prize */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[#C65D3B]">
                          <span className="text-sm font-semibold">Prize</span>
                        </div>
                        <p className="text-sm text-[#6B6B6B] font-semibold">{selectedEvent.prize || 'TBA'}</p>
                      </div>

                      {/* Venue */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[#C65D3B]">
                          <ExternalLink className="w-5 h-5" />
                          <span className="text-sm font-semibold">Venue</span>
                        </div>
                        <p className="text-sm text-[#6B6B6B]">{selectedEvent.venue || 'TBA'}</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-[#C65D3B]/20 via-[#C65D3B]/10 to-transparent mb-8" />


                    {/* Description */}
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-[#2A2A2A] mb-3">About This Event</h3>
                      <p className="text-[#6B6B6B] leading-relaxed whitespace-pre-line">{selectedEvent.description}</p>
                    </div>

                    {/* Contact Section */}
                    {selectedEvent.contact && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-[#2A2A2A] mb-2">Contact:</h3>
                        <ul className="space-y-2">
                          {Array.isArray(selectedEvent.contact) ? selectedEvent.contact.map((c, i) => (
                            <li key={i} className="text-[#4B5563]">
                              {c.name && <span className="font-semibold mr-2">{c.name}:</span>}
                              {c.phone && (
                                <a href={`tel:${c.phone}`} className="text-blue-600 hover:underline">{c.phone}</a>
                              )}
                            </li>
                          )) : (
                            <li className="text-[#4B5563]">
                              {selectedEvent.contact.name && <span className="font-semibold mr-2">{selectedEvent.contact.name}:</span>}
                              {selectedEvent.contact.phone && (
                                <a href={`tel:${selectedEvent.contact.phone}`} className="text-blue-600 hover:underline">{selectedEvent.contact.phone}</a>
                              )}
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <a
                        href={selectedEvent.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                        style={{ backgroundColor: department?.color || '#C65D3B' }}
                      >
                        Register Now
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      {isAdmin && backendAvailable && (
                        <button
                          onClick={() => {
                            setEditFormData(selectedEvent);
                            setIsEditingModal(true);
                          }}
                          className="px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all"
                          style={{ backgroundColor: `${department?.color}20`, color: department?.color }}
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Edit Mode */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">Event Name</label>
                        <input
                          type="text"
                          value={editFormData.name}
                          onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                          className="w-full px-4 py-2 border border-[#DDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C65D3B] text-black"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">Date</label>
                        <input
                          type="text"
                          value={editFormData.date}
                          onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                          className="w-full px-4 py-2 border border-[#DDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C65D3B] text-black"
                        />
                      </div>


                      <div>
                        <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">Fee</label>
                        <input
                          type="text"
                          value={editFormData.fee}
                          onChange={(e) => setEditFormData({ ...editFormData, fee: e.target.value })}
                          className="w-full px-4 py-2 border border-[#DDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C65D3B] text-black"
                          placeholder="e.g., ₹200 or FREE"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">Prize</label>
                        <input
                          type="text"
                          value={editFormData.prize || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, prize: e.target.value })}
                          className="w-full px-4 py-2 border border-[#DDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C65D3B] text-black"
                          placeholder="e.g., ₹500 + Certificate"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">Venue</label>
                        <input
                          type="text"
                          value={editFormData.venue || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, venue: e.target.value })}
                          className="w-full px-4 py-2 border border-[#DDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C65D3B] text-black"
                          placeholder="e.g., Main Auditorium"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">Description</label>
                        <textarea
                          value={editFormData.description}
                          onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                          className="w-full px-4 py-2 border border-[#DDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C65D3B] resize-none text-black"
                          rows={4}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#2A2A2A] mb-2">Registration URL</label>
                        <input
                          type="text"
                          value={editFormData.registrationUrl}
                          onChange={(e) => setEditFormData({ ...editFormData, registrationUrl: e.target.value })}
                          className="w-full px-4 py-2 border border-[#DDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C65D3B] text-black"
                        />
                      </div>
                    </div>

                    {/* Edit Action Buttons */}
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={async () => {
                          const success = await handleSaveEvent(editFormData);
                          if (success) {
                            setSelectedEvent(editFormData);
                            setIsEditingModal(false);
                          }
                        }}
                        className="flex-1 px-6 py-3 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                        style={{ backgroundColor: department?.color || '#C65D3B' }}
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingModal(false);
                          setEditFormData(null);
                        }}
                        className="flex-1 px-6 py-3 rounded-full font-semibold transition-all"
                        style={{ backgroundColor: '#F0F0F0', color: '#2A2A2A' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
