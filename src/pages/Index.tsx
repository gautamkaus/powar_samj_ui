import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { CommunityValues } from '@/components/CommunityValues';
import { UserDashboard } from '@/components/UserDashboard';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  try {
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
  } catch (error) {
    console.error('Error in Index component:', error);
    // Fallback UI if auth context is not available
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <About />
          <CommunityValues />
        </main>
        <Footer />
      </div>
    );
  }
};

export default Index;
