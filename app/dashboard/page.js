'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import Layout from '@/components/Layout';
import { getCollection } from '@/lib/firestore';
import { 
  Users, 
  Calendar, 
  MessageCircle, 
  TrendingUp,
  Bell,
  Award,
  Briefcase
} from 'lucide-react';

export default function Dashboard() {
  const { userProfile, user } = useAuth();
  const [stats, setStats] = useState({
    totalAlumni: 0,
    upcomingEvents: 0,
    activeMentorships: 0,
    totalDonations: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch alumni count
      const alumniResult = await getCollection('users', [
        { type: 'where', field: 'role', operator: '==', value: 'alumni' }
      ]);
      
      // Fetch events
      const eventsResult = await getCollection('events', [
        { type: 'orderBy', field: 'date', direction: 'desc' },
        { type: 'limit', value: 5 }
      ]);

      setStats({
        totalAlumni: alumniResult.data?.length || 0,
        upcomingEvents: eventsResult.data?.length || 0,
        activeMentorships: 12, // Mock data
        totalDonations: 25 // Mock data
      });

      // Mock recent activities
      setRecentActivities([
        {
          id: 1,
          type: 'new_member',
          message: 'John Smith (Class of 2020) joined the platform',
          time: '2 hours ago',
          icon: Users
        },
        {
          id: 2,
          type: 'event',
          message: 'Annual Tech Meetup scheduled for next week',
          time: '1 day ago',
          icon: Calendar
        },
        {
          id: 3,
          type: 'mentorship',
          message: 'New mentorship request from Sarah Johnson',
          time: '2 days ago',
          icon: MessageCircle
        },
        {
          id: 4,
          type: 'achievement',
          message: 'Mike Wilson promoted to Senior Developer at Google',
          time: '3 days ago',
          icon: Award
        }
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Alumni',
      value: stats.totalAlumni,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: Calendar,
      color: 'bg-green-500',
      change: '+3 this month'
    },
    {
      title: 'Active Mentorships',
      value: stats.activeMentorships,
      icon: MessageCircle,
      color: 'bg-purple-500',
      change: '+8 this month'
    },
    {
      title: 'Total Donations',
      value: `${stats.totalDonations}k`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+15%'
    }
  ];

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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {userProfile?.fullName || user?.email}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening in your alumni community today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600">{card.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <activity.icon className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button className="w-full flex items-center p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Users className="w-5 h-5 text-indigo-600 mr-3" />
                  <span className="text-sm font-medium">Update Profile</span>
                </button>
                <button className="w-full flex items-center p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                  <MessageCircle className="w-5 h-5 text-indigo-600 mr-3" />
                  <span className="text-sm font-medium">Find a Mentor</span>
                </button>
                <button className="w-full flex items-center p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Calendar className="w-5 h-5 text-indigo-600 mr-3" />
                  <span className="text-sm font-medium">Browse Events</span>
                </button>
                <button className="w-full flex items-center p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Briefcase className="w-5 h-5 text-indigo-600 mr-3" />
                  <span className="text-sm font-medium">Job Opportunities</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completion Banner */}
        {!userProfile?.isProfileComplete && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center">
              <Bell className="w-6 h-6 text-yellow-600 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">
                  Complete Your Profile
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Add more details to your profile to get better networking opportunities and mentorship matches.
                </p>
                <button className="mt-3 text-sm font-medium text-yellow-800 hover:text-yellow-900">
                  Complete Now →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}