import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Crown, ArrowRight, BookOpen } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { PhoneNumberPopup } from './PhoneNumberPopup';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/services/api';
import heroImage from '@/assets/hero-heritage.jpg';

export const Hero = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPhonePopupOpen, setIsPhonePopupOpen] = useState(false);
  const [isStoringPhone, setIsStoringPhone] = useState(false);
  const t = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleJoinCommunity = () => {
    setIsAuthModalOpen(true);
  };

  const handleExploreBlog = () => {
    if (isAuthenticated) {
      navigate('/blog');
    } else {
      setIsPhonePopupOpen(true);
    }
  };

  const handlePhoneSubmit = async (phoneNumber: string) => {
    try {
      setIsStoringPhone(true);
      const response = await authAPI.storePhoneNumber(phoneNumber);
      
      // Store the user ID for later use in profile completion
      localStorage.setItem('guestUserId', response.user.id.toString());
      
      setIsPhonePopupOpen(false);
      navigate('/blog');
    } catch (error) {
      console.error('Error storing phone number:', error);
      // You could show a toast notification here
    } finally {
      setIsStoringPhone(false);
    }
  };

  return (
    <>
      <section id="home" className="relative min-h-screen flex items-center hero-bg overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Powar Community Heritage" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/60" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            {/* Large Yellow Hindi Text at Top */}
            <div className="mb-8">
              <h1 className="font-devanagari text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-yellow-400 mb-6 leading-none drop-shadow-lg">
                पवार समुदाय
              </h1>
            </div>

            {/* Main Heading */}
            <div className="mb-8">
              <h2 className="font-inter text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                {t.hero.subtitle}
              </h2>
              <p className="font-devanagari text-lg sm:text-xl md:text-2xl text-secondary font-semibold mb-2">
                {t.hero.slogan}
              </p>
              <p className="font-inter text-base sm:text-lg md:text-xl text-muted-foreground italic mb-8">
                "{t.hero.sloganTranslation}"
              </p>
            </div>

            {/* Description */}
            <div className="mb-12 max-w-3xl">
              <p className="text-lg sm:text-xl text-foreground leading-relaxed mb-6">
                {t.hero.description}
              </p>
              <p className="font-devanagari text-base sm:text-lg text-muted-foreground leading-relaxed">
                {t.hero.descriptionHindi}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {!isAuthenticated ? (
                <Button onClick={handleJoinCommunity} className="btn-royal text-lg px-8 py-4">
                  <Crown className="h-5 w-5 mr-2" />
                  {t.hero.joinCommunity}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              ) : (
                <Button className="btn-royal text-lg px-8 py-4" disabled>
                  <Crown className="h-5 w-5 mr-2" />
                  Already a Member
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              )}
              <Button 
                variant="outline" 
                className="btn-heritage text-lg px-8 py-4 border-2 border-accent hover:bg-accent hover:text-accent-foreground"
                onClick={handleExploreBlog}
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Explore Blog
              </Button>
            </div>

            {/* Cultural Quote */}
            <div className="mt-16 p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 max-w-2xl">
              <p className="font-devanagari text-lg text-primary font-semibold mb-2">
                "{t.hero.quote}"
              </p>
              <p className="text-sm text-muted-foreground italic">
                "{t.hero.quoteTranslation}"
              </p>
              <p className="text-xs text-muted-foreground mt-2">- {t.hero.quoteSource}</p>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 opacity-20">
          <Crown className="h-32 w-32 text-primary animate-pulse" />
        </div>
        <div className="absolute bottom-20 left-10 opacity-10">
          <div className="w-24 h-24 bg-gradient-to-br from-accent to-secondary rounded-full animate-bounce" />
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode="register"
      />

      {/* Phone Number Popup */}
      <PhoneNumberPopup
        isOpen={isPhonePopupOpen}
        onClose={() => setIsPhonePopupOpen(false)}
        onSubmit={handlePhoneSubmit}
        isLoading={isStoringPhone}
      />
    </>
  );
};