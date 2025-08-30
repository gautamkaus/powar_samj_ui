import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { CommunityValues } from '@/components/CommunityValues';
import { UserDashboard } from '@/components/UserDashboard';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        {isAuthenticated && <UserDashboard />}
        <About />
        <CommunityValues />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
