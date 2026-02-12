// Local storage manager for events persistence
const EVENTS_STORAGE_KEY = 'techfest_events';

export interface StoredEvents {
  [departmentId: string]: {
    name: string;
    color: string;
    events: any[];
  };
}

// Get all events from localStorage
export function getStoredEvents(): StoredEvents | null {
  try {
    const stored = localStorage.getItem(EVENTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.error('Error reading from localStorage:', err);
    return null;
  }
}

// Get events for a specific department from localStorage
export function getStoredDepartmentEvents(departmentId: string) {
  try {
    const events = getStoredEvents();
    return events?.[departmentId]?.events || null;
  } catch (err) {
    console.error('Error getting department events from localStorage:', err);
    return null;
  }
}

// Save all events to localStorage
export function saveStoredEvents(events: StoredEvents): boolean {
  try {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    return true;
  } catch (err) {
    console.error('Error writing to localStorage:', err);
    return false;
  }
}

// Update a specific event in localStorage
export function updateStoredEvent(departmentId: string, eventId: number, updatedEvent: any): boolean {
  try {
    const allEvents = getStoredEvents() || {};
    if (!allEvents[departmentId]) return false;

    const eventIndex = allEvents[departmentId].events.findIndex((e: any) => e.id === eventId);
    if (eventIndex === -1) return false;

    allEvents[departmentId].events[eventIndex] = {
      ...allEvents[departmentId].events[eventIndex],
      ...updatedEvent,
      id: eventId
    };

    return saveStoredEvents(allEvents);
  } catch (err) {
    console.error('Error updating event in localStorage:', err);
    return false;
  }
}

// Add a new event to localStorage
export function addStoredEvent(departmentId: string, newEvent: any): boolean {
  try {
    const allEvents = getStoredEvents() || {};
    if (!allEvents[departmentId]) return false;

    const maxId = Math.max(...allEvents[departmentId].events.map((e: any) => e.id), 0);
    newEvent.id = maxId + 1;

    allEvents[departmentId].events.push(newEvent);
    return saveStoredEvents(allEvents);
  } catch (err) {
    console.error('Error adding event to localStorage:', err);
    return false;
  }
}

// Delete an event from localStorage
export function deleteStoredEvent(departmentId: string, eventId: number): boolean {
  try {
    const allEvents = getStoredEvents() || {};
    if (!allEvents[departmentId]) return false;

    const eventIndex = allEvents[departmentId].events.findIndex((e: any) => e.id === eventId);
    if (eventIndex === -1) return false;

    allEvents[departmentId].events.splice(eventIndex, 1);
    return saveStoredEvents(allEvents);
  } catch (err) {
    console.error('Error deleting event from localStorage:', err);
    return false;
  }
}

// Initialize localStorage with department data (call once with mock data)
export function initializeStorage(departmentsData: StoredEvents): void {
  try {
    const existing = getStoredEvents();
    if (!existing) {
      saveStoredEvents(departmentsData);
    }
  } catch (err) {
    console.error('Error initializing storage:', err);
  }
}
