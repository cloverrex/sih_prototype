'use client';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Users, Calendar, MessageCircle, TrendingUp, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const features = [
    {
      icon: Users,
      title: 'Alumni Directory',
      description: 'Connect with fellow graduates and expand your professional network'
    },
    {
      icon: Calendar,
      title: 'Events & Reunions',
      description: 'Stay updated on upcoming events, reunions, and networking opportunities'
    },
    {
      icon: MessageCircle,
      title: 'Mentorship Program',
      description: 'Guide current students or get mentored by experienced professionals'
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Access job opportunities, career advice, and professional development'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Alumni Connect</h1>
            </div>
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/auth/login')}
              >
                Sign In
              </Button>
              <Button onClick={() => router.push('/auth/register')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Connect. Engage. <span className="text-indigo-600">Grow Together.</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join our digital alumni community and unlock opportunities for networking, mentorship, 
            and lifelong connections with fellow graduates.
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg"
              onClick={() => router.push('/auth/register')}
              className="flex items-center"
            >
              Join Our Community <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => router.push('/auth/login')}
            >
              Already a Member?
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Stay Connected
            </h3>
            <p className="text-lg text-gray-600">
              Our platform brings together all the tools you need for meaningful alumni engagement
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Reconnect with Your Alma Mater?
          </h3>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of alumni who are already part of our growing community
          </p>
          <Button 
            variant="secondary"
            size="lg"
            onClick={() => router.push('/auth/register')}
          >
            Start Your Journey Today
          </Button>
        </div>
      </section>
    </div>
  );
}