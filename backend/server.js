import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Path to events data
const eventsFilePath = path.join(__dirname, 'events.json');

// Helper function to read events
function readEvents() {
  try {
    const data = fs.readFileSync(eventsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading events file:', err);
    return { departments: {} };
  }
}

// Helper function to write events
function writeEvents(data) {
  try {
    fs.writeFileSync(eventsFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing events file:', err);
    return false;
  }
}

// Admin credentials
const ADMIN_USERNAME = 'adminkarmin';
const ADMIN_PASSWORD = 'adminkuttan123';
const SECRET_TOKEN = 'admin-authenticated';

// Session management - only one admin at a time
let activeAdminSession = null; // { token, loginTime, sessionId }

// Middleware to verify admin session
function verifyAdminSession(req, res, next) {
  const token = req.headers['authorization']?.replace('Bearer ', '') || req.body.token;
  const sessionId = req.body.sessionId;

  if (token === SECRET_TOKEN && activeAdminSession && activeAdminSession.sessionId === sessionId) {
    next();
  } else {
    res.status(403).json({ 
      message: 'Unauthorized or session expired' 
    });
  }
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend server is running' });
});

// Check admin session status
app.get('/api/auth/status', (req, res) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  const sessionId = req.query.sessionId;

  if (token === SECRET_TOKEN && activeAdminSession && activeAdminSession.sessionId === sessionId) {
    res.json({ 
      isValid: true,
      message: 'Session is active',
      sessionId: activeAdminSession.sessionId,
      loginTime: activeAdminSession.loginTime
    });
  } else if (activeAdminSession && (!sessionId || activeAdminSession.sessionId !== sessionId)) {
    res.status(409).json({ 
      isValid: false,
      message: 'Another admin session is active',
      error: 'SESSION_CONFLICT'
    });
  } else {
    res.status(401).json({ 
      isValid: false,
      message: 'No active session'
    });
  }
});

// Get all events
app.get('/api/events', (req, res) => {
  const events = readEvents();
  res.json(events);
});

// Get events for specific department
app.get('/api/events/:departmentId', (req, res) => {
  const { departmentId } = req.params;
  const events = readEvents();
  
  if (events.departments[departmentId]) {
    res.json(events.departments[departmentId]);
  } else {
    res.status(404).json({ message: 'Department not found' });
  }
});

// Update event (admin only)
app.put('/api/events/:departmentId/:eventId', verifyAdminSession, (req, res) => {
  const { departmentId, eventId } = req.params;
  const updatedEventData = req.body;
  
  const events = readEvents();
  
  if (!events.departments[departmentId]) {
    return res.status(404).json({ message: 'Department not found' });
  }
  
  const departmentEvents = events.departments[departmentId].events;
  const eventIndex = departmentEvents.findIndex(e => e.id === parseInt(eventId));
  
  if (eventIndex === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }
  
  // Update event with new data
  // Sanitize incoming update and ensure id is not overwritten
  const sanitizedUpdate = { ...updatedEventData };
  delete sanitizedUpdate.token;
  delete sanitizedUpdate.sessionId;
  departmentEvents[eventIndex] = {
    ...departmentEvents[eventIndex],
    ...sanitizedUpdate,
    id: parseInt(eventId)
  };
  
  if (writeEvents(events)) {
    res.json({ 
      message: 'Event updated successfully',
      event: departmentEvents[eventIndex]
    });
  } else {
    res.status(500).json({ message: 'Failed to update event' });
  }
});

// Add new event (admin only)
app.post('/api/events/:departmentId', verifyAdminSession, (req, res) => {
  const { departmentId } = req.params;
  const newEventData = req.body;
  
  const events = readEvents();
  
  if (!events.departments[departmentId]) {
    return res.status(404).json({ message: 'Department not found' });
  }
  
  const departmentEvents = events.departments[departmentId].events;
  const newId = Math.max(...departmentEvents.map(e => e.id), 0) + 1;
  
  // Prevent client from forcing id or leaking session/token into stored data
  const sanitized = { ...newEventData };
  delete sanitized.token;
  delete sanitized.sessionId;

  const newEvent = {
    ...sanitized,
    id: newId
  };

  departmentEvents.push(newEvent);
  
  if (writeEvents(events)) {
    res.json({ 
      message: 'Event created successfully',
      event: newEvent
    });
  } else {
    res.status(500).json({ message: 'Failed to create event' });
  }
});

// Delete event (admin only)
app.delete('/api/events/:departmentId/:eventId', verifyAdminSession, (req, res) => {
  const { departmentId, eventId } = req.params;
  
  const events = readEvents();
  
  if (!events.departments[departmentId]) {
    return res.status(404).json({ message: 'Department not found' });
  }
  
  const departmentEvents = events.departments[departmentId].events;
  const eventIndex = departmentEvents.findIndex(e => e.id === parseInt(eventId));
  
  if (eventIndex === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }
  
  const deletedEvent = departmentEvents.splice(eventIndex, 1);
  
  if (writeEvents(events)) {
    res.json({ 
      message: 'Event deleted successfully',
      event: deletedEvent[0]
    });
  } else {
    res.status(500).json({ message: 'Failed to delete event' });
  }
});
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ 
      message: 'Username and password are required' 
    });
  }

  // Check credentials
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Check if another admin is already logged in
    if (activeAdminSession !== null) {
      return res.status(409).json({ 
        message: 'Admin is already logged in. Please try again later.',
        error: 'ADMIN_ALREADY_LOGGED_IN',
        existingSession: {
          loginTime: activeAdminSession.loginTime
        }
      });
    }

    // Create new session
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    activeAdminSession = {
      token: SECRET_TOKEN,
      loginTime: new Date().toISOString(),
      sessionId: sessionId
    };

    return res.json({ 
      token: SECRET_TOKEN,
      message: 'Login successful',
      user: { username: ADMIN_USERNAME },
      sessionId: sessionId
    });
  }

  // Invalid credentials
  return res.status(401).json({ 
    message: 'Invalid username or password' 
  });
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  const { sessionId } = req.body;

  // Clear active session
  if (activeAdminSession && activeAdminSession.sessionId === sessionId) {
    activeAdminSession = null;
    return res.json({ 
      message: 'Logout successful' 
    });
  }

  // Session mismatch or no active session
  res.json({ 
    message: 'Logout successful' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Endpoint not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ 
    message: 'Internal server error' 
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
   console.log(`                                           [ WOLF ]                                       \n\n\n`);
  console.log(`>>>>>>>>>>>>>>>>>>>>>>>>Backend Server Running http://localhost:${PORT}<<<<<<<<<<<<<<<<<<<`);
  console.log(`>>>>>>>>>>>>>>>>>>>>>>>>http://localhost:${PORT}/api/auth/login<<<<<<<<<<<<<<<<<<<`);
});
