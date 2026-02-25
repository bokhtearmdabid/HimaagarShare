import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { Snowflake, DollarSign, Clock, Shield, Thermometer, MapPin } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Snowflake className="w-8 h-8 text-maroon" />,
      title: 'Flexible Storage',
      description: 'Access cold storage exactly when you need it, from a few hours to months'
    },
    {
      icon: <DollarSign className="w-8 h-8 text-maroon" />,
      title: 'Cost Effective',
      description: 'Pay only for the space you use. No long-term commitments required'
    },
    {
      icon: <Clock className="w-8 h-8 text-maroon" />,
      title: 'Instant Booking',
      description: 'Find and book cold storage spaces in minutes, not days'
    },
    {
      icon: <Shield className="w-8 h-8 text-maroon" />,
      title: 'Secure & Safe',
      description: 'All listings are verified. Your goods are protected with proper insurance'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Create Account',
      description: 'Sign up as a Host (have space) or Renter (need space)'
    },
    {
      step: '2',
      title: 'List or Search',
      description: 'Hosts list their spaces. Renters search for available storage'
    },
    {
      step: '3',
      title: 'Book & Connect',
      description: 'Renters book space. Hosts approve requests'
    },
    {
      step: '4',
      title: 'Store & Earn',
      description: 'Start using or earning from your cold storage space'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-babyPink to-lightPink py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Snowflake className="w-16 h-16 text-maroon" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-maroon">HimaagarShare</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              The marketplace connecting cold storage owners with businesses needing flexible, 
              short-term refrigeration solutions. <span className="font-semibold text-maroon">Cooling-as-a-Service</span> made simple.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/register')}
                className="text-lg px-8 py-3"
              >
                Get Started
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/login')}
                className="text-lg px-8 py-3"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* For Who Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Who is <span className="text-maroon">HimaagarShare</span> For?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="text-center" padding="p-8" hover>
              <div className="flex justify-center mb-4">
                <div className="bg-babyPink p-4 rounded-full">
                  <Thermometer className="w-12 h-12 text-maroon" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-maroon mb-4">Have Space?</h3>
              <p className="text-gray-600 mb-6">
                Own a freezer, chiller, or cold room with unused capacity? Turn your idle cold storage into income.
              </p>
              <ul className="text-left text-gray-600 space-y-2 mb-6">
                <li>• Restaurants with extra freezer space</li>
                <li>• Cold storage facilities with availability</li>
                <li>• Grocery stores with unused capacity</li>
                <li>• Warehouses with refrigeration</li>
              </ul>
              <Button 
                onClick={() => navigate('/register?role=host')}
                className="w-full"
              >
                List Your Space
              </Button>
            </Card>

            <Card className="text-center" padding="p-8" hover>
              <div className="flex justify-center mb-4">
                <div className="bg-babyPink p-4 rounded-full">
                  <MapPin className="w-12 h-12 text-maroon" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-maroon mb-4">Need Space?</h3>
              <p className="text-gray-600 mb-6">
                Looking for flexible, short-term cold storage without long-term commitments?
              </p>
              <ul className="text-left text-gray-600 space-y-2 mb-6">
                <li>• Small restaurant owners</li>
                <li>• Catering businesses</li>
                <li>• Farmers and agricultural producers</li>
                <li>• Florists and event planners</li>
              </ul>
              <Button 
                onClick={() => navigate('/register?role=renter')}
                className="w-full"
              >
                Find Storage
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-lightPink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose <span className="text-maroon">HimaagarShare</span>?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center" hover>
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-maroon text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-maroon text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join HimaagarShare today and be part of the cooling-as-a-service revolution
          </p>
          <Button 
            variant="secondary"
            onClick={() => navigate('/register')}
            className="text-lg px-8 py-3"
          >
            Create Your Account
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
