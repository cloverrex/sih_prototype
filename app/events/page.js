'use client';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { getCollection } from '@/lib/firestore';
import { Calendar, MapPin, Clock, Users, Plus, Filter } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [filter, events]);

  const fetchEvents = async () => {
    // Mock events data for demonstration
    const mockEvents = [
      {
        id: '1',
        title: 'Annual Tech Meetup 2024',
        description: 'Join us for our biggest tech meetup of the year featuring keynotes from industry leaders, networking opportunities, and hands-on workshops.',
        date: new Date('2024-03-15T18:00:00'),
        endDate: new Date('2024-03-15T21:00:00'),
        location: 'San Francisco Convention Center',
        type: 'networking',
        maxAttendees: 200,
        currentAttendees: 87,
        organizer: 'Alumni Tech Committee',
        isVirtual: false,
        registrationDeadline: new Date('2024-03-10T23:59:59'),
        tags: ['Technology', 'Networking', 'Career']
      },
      {
        id: '2',
        title: 'Virtual Career Workshop: Resume Building',
        description: 'Learn how to create compelling resumes that get noticed by top companies. Interactive session with HR professionals.',
        date: new Date('2024-02-28T19:00:00'),
        endDate: new Date('2024-02-28T21:00:00'),
        location: 'Virtual - Zoom',
        type: 'workshop',
        maxAttendees: 50,
        currentAttendees: 34,
        organizer: 'Career Services',
        isVirtual: true,
        registrationDeadline: new Date('2024-02-26T23:59:59'),
        tags: ['Career', 'Professional Development', 'Workshop']
      },
      {
        id: '3',
        title: 'Alumni Homecoming Weekend',
        description: 'Celebrate our alma mater with a weekend full of activities, campus tours, and reunions with classmates.',
        date: new Date('2024-04-20T10:00:00'),
        endDate: new Date('2024-04-21T17:00:00'),
        location: 'University Campus',
        type: 'reunion',
        maxAttendees: 500,
        currentAttendees: 156,
        organizer: 'Alumni Relations Office',
        isVirtual: false,
        registrationDeadline: new Date('2024-04-15T23:59:59'),
        tags: ['Reunion', 'Campus', 'Social']
      },
      {
        id: '4',
        title: 'Entrepreneurship Panel Discussion',
        description: 'Hear from successful alumni entrepreneurs about their journey from graduation to building successful startups.',
        date: new Date('2024-01-15T18:30:00'), // Past event
        endDate: new Date('2024-01-15T20:30:00'),
        location: 'Innovation Hub Downtown',
        type: 'panel',
        maxAttendees: 75,
        currentAttendees: 68,
        organizer: 'Entrepreneurship Club',
        isVirtual: false,
        registrationDeadline: new Date('2024-01-10T23:59:59'),
        tags: ['Entrepreneurship', 'Startups', 'Business']
      }
    ];

    setEvents(mockEvents);
    setLoading(false);
  };

  const filterEvents = () => {
    const now = new Date();
    let filtered = events;

    switch (filter) {
      case 'upcoming':
        filtered = events.filter(event => new Date(event.date) > now);
        break;
      case 'past':
        filtered = events.filter(event => new Date(event.date) < now);
        break;
      default:
        filtered = events;
    }

    // Sort by date (upcoming events first, then by date)
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

    setFilteredEvents(filtered);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getEventTypeColor = (type) => {
    const colors = {
      networking: 'bg-blue-100 text-blue-800',
      workshop: 'bg-green-100 text-green-800',
      reunion: 'bg-purple-100 text-purple-800',
      panel: 'bg-orange-100 text-orange-800',
      social: 'bg-pink-100 text-pink-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const isEventFull = (event) => {
    return event.currentAttendees >= event.maxAttendees;
  };

  const isRegistrationClosed = (event) => {
    return new Date() > new Date(event.registrationDeadline);
  };

  const isEventPast = (event) => {
    return new Date() > new Date(event.date);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Events</h1>
              <p className="text-gray-600">Discover and join alumni events and activities</p>
            </div>
            <Button className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setFilter('all')}
              >
                All Events
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'upcoming'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setFilter('upcoming')}
              >
                Upcoming
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'past'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setFilter('past')}
              >
                Past Events
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Event Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                      {event.isVirtual && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Virtual
                        </span>
                      )}
                      {isEventPast(event) && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          Past Event
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  </div>
                </div>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{formatTime(event.date)} - {formatTime(event.endDate)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{event.currentAttendees} / {event.maxAttendees} attendees</span>
                  </div>
                </div>

                {/* Organizer */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500">Organized by <span className="font-medium">{event.organizer}</span></p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Attendance Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Attendance</span>
                    <span>{Math.round((event.currentAttendees / event.maxAttendees) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        isEventFull(event) ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((event.currentAttendees / event.maxAttendees) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {isEventPast(event) ? (
                    <Button variant="outline" className="flex-1" disabled>
                      Event Ended
                    </Button>
                  ) : isEventFull(event) ? (
                    <Button variant="outline" className="flex-1" disabled>
                      Event Full
                    </Button>
                  ) : isRegistrationClosed(event) ? (
                    <Button variant="outline" className="flex-1" disabled>
                      Registration Closed
                    </Button>
                  ) : (
                    <Button className="flex-1">
                      Register Now
                    </Button>
                  )}
                  <Button variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Events */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'upcoming' ? 'No upcoming events' : 
               filter === 'past' ? 'No past events' : 'No events found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {filter === 'upcoming' ? 'Check back soon for new events!' : 
               filter === 'past' ? 'Past events will appear here.' : 'Events will appear here when they are created.'}
            </p>
            {filter === 'upcoming' && (
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create First Event
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}