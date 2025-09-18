'use client';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { getCollection } from '@/lib/firestore';
import { Search, Filter, MapPin, Briefcase, Calendar, Mail, Phone } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Directory() {
  const [alumni, setAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    graduationYear: '',
    course: '',
    location: '',
    company: ''
  });

  useEffect(() => {
    fetchAlumni();
  }, []);

  useEffect(() => {
    filterAlumni();
  }, [searchTerm, filters, alumni]);

  const fetchAlumni = async () => {
    const { data, error } = await getCollection('users', [
      { type: 'where', field: 'role', operator: '==', value: 'alumni' }
    ]);

    if (data) {
      // Add mock data for demonstration
      const mockAlumni = [
        {
          id: '1',
          fullName: 'John Smith',
          email: 'john.smith@email.com',
          graduationYear: 2020,
          course: 'Computer Science',
          currentPosition: 'Software Engineer',
          company: 'Google',
          location: 'San Francisco, CA',
          bio: 'Passionate about AI and machine learning. Love to mentor young developers.',
          avatar: null,
          skills: ['React', 'Python', 'Machine Learning']
        },
        {
          id: '2',
          fullName: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          graduationYear: 2018,
          course: 'Business Administration',
          currentPosition: 'Product Manager',
          company: 'Microsoft',
          location: 'Seattle, WA',
          bio: 'Product management enthusiast with 5+ years of experience.',
          avatar: null,
          skills: ['Product Management', 'Strategy', 'Analytics']
        },
        {
          id: '3',
          fullName: 'Mike Wilson',
          email: 'mike.wilson@email.com',
          graduationYear: 2019,
          course: 'Electrical Engineering',
          currentPosition: 'Senior Developer',
          company: 'Tesla',
          location: 'Austin, TX',
          bio: 'Building the future of sustainable transport.',
          avatar: null,
          skills: ['C++', 'Embedded Systems', 'Hardware']
        }
      ];
      setAlumni([...data, ...mockAlumni]);
    }
    setLoading(false);
  };

  const filterAlumni = () => {
    let filtered = alumni;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(person =>
        person.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.currentPosition?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Year filter
    if (filters.graduationYear) {
      filtered = filtered.filter(person => 
        person.graduationYear?.toString() === filters.graduationYear
      );
    }

    // Course filter
    if (filters.course) {
      filtered = filtered.filter(person =>
        person.course?.toLowerCase().includes(filters.course.toLowerCase())
      );
    }

    setFilteredAlumni(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      graduationYear: '',
      course: '',
      location: '',
      company: ''
    });
    setSearchTerm('');
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Alumni Directory</h1>
          <p className="text-gray-600">Connect with fellow graduates from your institution</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, company, position..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={filters.graduationYear}
                onChange={(e) => handleFilterChange('graduationYear', e.target.value)}
              >
                <option value="">All Years</option>
                {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Course/Major"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={filters.course}
                onChange={(e) => handleFilterChange('course', e.target.value)}
              />

              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredAlumni.length} of {alumni.length} alumni
          </p>
        </div>

        {/* Alumni Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((person) => (
            <div key={person.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Avatar and Basic Info */}
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {person.fullName?.charAt(0) || 'A'}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{person.fullName}</h3>
                    <p className="text-sm text-gray-600">Class of {person.graduationYear}</p>
                  </div>
                </div>

                {/* Course */}
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700">{person.course}</p>
                </div>

                {/* Current Position */}
                <div className="flex items-center mb-3">
                  <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{person.currentPosition}</p>
                    <p className="text-sm text-gray-600">{person.company}</p>
                  </div>
                </div>

                {/* Location */}
                {person.location && (
                  <div className="flex items-center mb-3">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-600">{person.location}</p>
                  </div>
                )}

                {/* Bio */}
                {person.bio && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{person.bio}</p>
                )}

                {/* Skills */}
                {person.skills && person.skills.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {person.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {person.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{person.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Connect
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredAlumni.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No alumni found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        )}
      </div>
    </Layout>
  );
}