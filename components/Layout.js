'use client';
import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { logoutUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Calendar, 
  MessageCircle, 
  DollarSign,
  Settings,
  LogOut,
  User
} from 'lucide-react';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, userProfile, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: true },
    { name: 'Alumni Directory', href: '/directory', icon: Users, current: false },
    { name: 'Events', href: '/events', icon: Calendar, current: false },
    { name: 'Mentorship', href: '/mentorship', icon: MessageCircle, current: false },
    { name: 'Donations', href: '/donations', icon: DollarSign, current: false },
  ];

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden`} onClick={() => setSidebarOpen(false)}></div>
      
      <div className={`${sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'} fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-white lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-center mt-8">
          <div className="flex items-center">
            <span className="text-2xl font-semibold text-gray-800">Alumni Connect</span>
          </div>
        </div>

        <nav className="mt-10">
          <div className="px-4 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  item.current
                    ? 'bg-indigo-100 text-indigo-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="mr-4 h-6 w-6" />
                {item.name}
              </a>
            ))}
          </div>
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{userProfile?.fullName || user?.email}</p>
              <p className="text-xs text-gray-500 capitalize">{userProfile?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-auto p-2 text-gray-400 hover:text-gray-600"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden lg:pl-64">
        <div className="flex items-center justify-between p-4 bg-white border-b lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 focus:outline-none focus:text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}