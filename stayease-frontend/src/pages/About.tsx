import { Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Search, 
  BedDouble, 
  Calendar,
  Lock,
  CheckCircle
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const AboutPage = () => {
  const features = [
    {
      icon: Building2,
      title: 'Property Management',
      description: 'Owners can list and manage multiple properties with detailed information, amenities, and pricing.',
    },
    {
      icon: BedDouble,
      title: 'Bed-Level Control',
      description: 'Track individual beds across rooms with real-time availability and occupancy status.',
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Filter properties by city, type, gender preference, rent range, and bed availability.',
    },
    {
      icon: Calendar,
      title: 'Booking System',
      description: 'Seamless booking flow with status tracking from pending to checked-in.',
    },
    {
      icon: Lock,
      title: 'Secure Authentication',
      description: 'JWT-based authentication with role-based access control for users and owners.',
    },
    {
      icon: CheckCircle,
      title: 'Verified Properties',
      description: 'Property verification system to build trust and ensure quality listings.',
    },
  ];

  const stats = [
    { label: 'Property Types', value: '4+', description: 'PG, Hostel, Flat, Apartment' },
    { label: 'Real-time', value: '24/7', description: 'Bed availability updates' },
    { label: 'User Roles', value: '2', description: 'Owner & User access' },
    { label: 'Secure', value: '100%', description: 'JWT authentication' },
  ];

  const techStack = [
    { category: 'Frontend', items: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4'] },
    { category: 'State & Data', items: ['TanStack Query', 'React Hook Form', 'Zod', 'Axios'] },
    { category: 'Backend', items: ['Spring Boot 4', 'Java 21', 'MySQL', 'JWT Authentication'] },
    { category: 'Architecture', items: ['REST API', 'Role-based Access', 'Pagination', 'Entity Relations'] },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-12 text-white shadow-xl shadow-blue-500/10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-blue-100 ring-1 ring-white/20">
            About StayEase
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-tight lg:text-5xl">
            Modern Accommodation Management Platform
          </h1>
          <p className="mt-4 text-lg text-blue-100">
            A full-stack solution connecting property owners with tenants through an intuitive, secure, and feature-rich platform.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/search">
              <Button size="lg" variant="primary" className="bg-white text-slate-900 hover:bg-blue-50">
                <Search className="h-4 w-4" />
                Browse Properties
              </Button>
            </Link>
            <Link to="/register?role=OWNER">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                <Building2 className="h-4 w-4" />
                List Your Property
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <p className="text-4xl font-bold text-(--color-primary)">{stat.value}</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{stat.label}</p>
              <p className="mt-1 text-xs text-slate-500">{stat.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Platform capabilities</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Key Features</h2>
          <p className="mt-2 text-slate-600">Everything you need to manage accommodations efficiently</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="group hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-blue-50 p-3 text-(--color-primary) group-hover:bg-(--color-primary) group-hover:text-white transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{feature.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Simple workflow</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">How StayEase Works</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--color-primary) text-white font-bold">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">For Property Seekers</h3>
            </div>
            <ol className="mt-4 space-y-3 text-sm text-slate-700">
              <li className="flex gap-3">
                <span className="font-bold text-(--color-primary)">1.</span>
                <span><strong>Search:</strong> Browse properties by location, price, and preferences</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-(--color-primary)">2.</span>
                <span><strong>Select:</strong> Choose a room and bed that fits your needs</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-(--color-primary)">3.</span>
                <span><strong>Book:</strong> Submit booking request with check-in date</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-(--color-primary)">4.</span>
                <span><strong>Move-in:</strong> Await owner confirmation and move in</span>
              </li>
            </ol>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white font-bold">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">For Property Owners</h3>
            </div>
            <ol className="mt-4 space-y-3 text-sm text-slate-700">
              <li className="flex gap-3">
                <span className="font-bold text-emerald-600">1.</span>
                <span><strong>Register:</strong> Create an owner account and verify credentials</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-emerald-600">2.</span>
                <span><strong>List:</strong> Add properties with rooms, beds, and amenities</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-emerald-600">3.</span>
                <span><strong>Manage:</strong> Track bookings, update availability in real-time</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-emerald-600">4.</span>
                <span><strong>Earn:</strong> Confirm bookings and manage tenant relationships</span>
              </li>
            </ol>
          </Card>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="space-y-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Built with modern tools</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Technology Stack</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {techStack.map((tech) => (
            <Card key={tech.category}>
              <h3 className="text-sm font-bold text-(--color-primary)">{tech.category}</h3>
              <ul className="mt-3 space-y-1.5">
                {tech.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="h-1.5 w-1.5 rounded-full bg-(--color-primary)" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-12 text-white text-center shadow-xl">
        <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
        <p className="mt-2 text-lg text-blue-100">
          Join StayEase today and experience seamless accommodation management
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link to="/register">
            <Button size="lg" variant="primary" className="bg-white text-blue-600 hover:bg-blue-50">
              Create Account
            </Button>
          </Link>
          <Link to="/search">
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              Explore Properties
            </Button>
          </Link>
        </div>
        <p className="mt-6 text-sm text-blue-100">
          Demo credentials: owner@test.com / password123 · user@test.com / password123
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
