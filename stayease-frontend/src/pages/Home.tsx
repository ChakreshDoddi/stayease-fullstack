import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Search, ShieldCheck, Building2, MapPin } from 'lucide-react';
import { fetchCities, fetchFeaturedProperties } from '@/api/properties';
import { PropertyCard } from '@/components/PropertyCard';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

const HomePage = () => {
  const { data: featured, isLoading: loadingFeatured } = useQuery({
    queryKey: ['featured-properties'],
    queryFn: fetchFeaturedProperties,
  });

  const { data: cities } = useQuery({
    queryKey: ['cities'],
    queryFn: fetchCities,
  });

  return (
    <div className="space-y-12">
      <section className="grid gap-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-10 text-white shadow-xl shadow-blue-500/10 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100 ring-1 ring-white/20">
            StayEase · Accommodation Management
          </p>
          <h1 className="text-4xl font-bold leading-tight lg:text-5xl">
            Manage PGs effortlessly and help students find their stay in minutes.
          </h1>
          <p className="text-lg text-blue-100">
            Owners control inventory, beds, and bookings. Users search verified PGs with transparent pricing and
            availability.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/search">
              <Button size="lg" variant="primary" className="bg-white text-slate-900 hover:bg-blue-50">
                <Search className="h-4 w-4" />
                Start searching
              </Button>
            </Link>
            <Link to="/register?role=OWNER">
              <Button
                size="lg"
                variant="outline"
                className="border border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                <ArrowRight className="h-4 w-4" />
                List your PG
              </Button>
            </Link>
          </div>
          <div className="flex gap-4 text-sm text-blue-100">
            <div className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Secured with JWT & role-based guards
            </div>
            <div className="inline-flex items-center gap-2">
              <Building2 className="h-4 w-4 text-amber-200" />
              Real-time bed availability
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white/10 p-6 shadow-lg shadow-blue-500/20">
          <h3 className="text-xl font-semibold">Popular cities</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {cities?.slice(0, 6).map((city) => (
              <Link
                key={city}
                to={`/search?city=${encodeURIComponent(city)}`}
                className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
              >
                <MapPin className="h-4 w-4" />
                {city}
              </Link>
            )) || <p className="text-sm text-blue-100">Fetching cities...</p>}
          </div>
          <p className="mt-4 text-sm text-blue-100">Data seeded for Bangalore & demo users: owner@test.com / password123</p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Curated picks</p>
            <h2 className="text-2xl font-bold text-slate-900">Featured properties</h2>
          </div>
          <Link to="/search">
            <Button variant="ghost" className="text-slate-700">
              View all
            </Button>
          </Link>
        </div>
        {loadingFeatured ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : featured && featured.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-600">No featured properties yet. Owners can mark properties as featured.</p>
        )}
      </section>
    </div>
  );
};

export default HomePage;
