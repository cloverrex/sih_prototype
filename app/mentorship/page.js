'use client';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/components/AuthProvider';
import { MessageCircle, User, Star, Clock, Search, Filter } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Mentorship() {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('find-mentor'); // find-mentor, my-connections, be-mentor
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    // Mock mentor data
    const mockMentors = [
      {
        id: '1',
        fullName: 'Dr. Emily Chen',
        currentPosition: 'Senior Data Scientist',
        company: 'Netflix',
        graduationYear: 2015,
        course: 'Computer Science',
        expertise: ['Data Science', 'Machine Learning', 'Python', 'AI'],
        bio: 'Passionate about using data to solve complex problems. I love mentoring junior developers and helping them navigate their career paths in tech.',
        rating: 4.9,
        totalMentees: 23,
        yearsExperience: 8,
        availableSlots: 3,
        location: 'Los Gatos, CA',
        preferredMenteeLevel: ['Beginner', 'Intermediate'],
        responseTime: '< 24 hours'
      },
      {
        id: '2',
        fullName: 'Mark Rodriguez',
        currentPosition: 'VP of Engineering',
        company: 'Uber',
        graduationYear: 2012,
        course: 'Software Engineering',
        expertise: ['Leadership', 'System Design', 'Team Management', 'Startups'],
        bio: 'Building and scaling engineering teams for over 10 years. Happy to share insights about career growth, leadership, and startup culture.',
        rating: 4.8,
        totalMentees: 45,
        yearsExperience: 12,
        availableSlots: 2,
        location: 'San Francisco, CA',
        preferredMenteeLevel: ['Intermediate', 'Advanced'],
        responseTime: '< 48 hours'
      },
      {
        id: '3',
        fullName: 'Lisa Thompson',
        currentPosition: 'Product Manager',
        company: 'Airbnb',
        graduationYear: 2017,
        course: 'Business Administration',
        expertise: ['Product Management', 'Strategy', 'User Research', 'Analytics'],
        bio: 'Helping build products that millions of people use daily. I enjoy mentoring those interested in product management and business strategy.',
        rating: 4.7,
        totalMentees: 18,
        yearsExperience: 6,
        availableSlots: 5,
        location: 'San Francisco, CA',
        preferredMenteeLevel: ['Beginner'],
        responseTime: '< 12 hours'
      }
    ];

    setMentors(mockMentors);
    setLoading(false);
  };

  const filteredMentors = mentors.filter(mentor =>
    mentor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
    mentor.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mentorship Program</h1>
          <p className="text-gray-600">Connect with experienced alumni for guidance and career advice</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'find-mentor', label: 'Find a Mentor', count: mentors.length },
                { id: 'my-connections', label: 'My Connections', count: 3 },
                { id: 'be-mentor', label: 'Become a Mentor' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                  {tab.count && (
                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'find-mentor' && (
              <div>
                {/* Search and Filter */}
                <div className="mb-6">
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name, skills, or company..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>

                {/* Mentors Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredMentors.map((mentor) => (
                    <div key={mentor.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      {/* Mentor Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {mentor.fullName.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">{mentor.fullName}</h3>
                            <p className="text-sm text-gray-600">{mentor.currentPosition} at {mentor.company}</p>
                            <p className="text-xs text-gray-500">Class of {mentor.graduationYear} • {mentor.course}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="flex mr-2">
                            {renderStars(mentor.rating)}
                          </div>
                          <span className="text-sm text-gray-600">({mentor.rating})</span>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{mentor.bio}</p>

                      {/* Expertise */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Expertise</h4>
                        <div className="flex flex-wrap gap-1">
                          {mentor.expertise.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{mentor.totalMentees}</p>
                          <p className="text-xs text-gray-500">Mentees</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{mentor.yearsExperience}</p>
                          <p className="text-xs text-gray-500">Years Exp.</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{mentor.availableSlots}</p>
                          <p className="text-xs text-gray-500">Available</p>
                        </div>
                      </div>

                      {/* Response Time */}
                      <div className="flex items-center justify-between mb-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Response time: {mentor.responseTime}</span>
                        </div>
                        <span className="text-gray-500">📍 {mentor.location}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button className="flex-1">
                          Request Mentorship
                        </Button>
                        <Button variant="outline">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'my-connections' && (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Mentorship Connections Yet</h3>
                <p className="text-gray-600 mb-4">Start by requesting mentorship from experienced alumni</p>
                <Button onClick={() => setActiveTab('find-mentor')}>Find a Mentor</Button>
              </div>
            )}

            {activeTab === 'be-mentor' && (
              <div>
                <div className="max-w-2xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Become a Mentor</h3>
                  <p className="text-gray-600 mb-6">
                    Share your experience and help guide the next generation of professionals. 
                    Mentoring is a rewarding way to give back to your alumni community.
                  </p>
                  
                  <div className="bg-blue-50 rounded-lg p-6 mb-6">
                    <h4 className="font-medium text-blue-900 mb-2">Benefits of Being a Mentor</h4>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>• Give back to your alma mater community</li>
                      <li>• Develop leadership and coaching skills</li>
                      <li>• Stay connected with emerging trends and perspectives</li>
                      <li>• Build meaningful professional relationships</li>
                      <li>• Enhance your professional network</li>
                    </ul>
                  </div>

                  <Button size="lg">Apply to be a Mentor</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}