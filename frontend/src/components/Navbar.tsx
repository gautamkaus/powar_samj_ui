import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Crown, LogOut, Settings } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { PhoneNumberPopup } from './PhoneNumberPopup';
import { useNavigate } from 'react-router-dom';
import communityEmblem from '@/assets/community-emblem.jpg';
import { LanguageDropdown } from './LanguageDropdown';
import { authAPI } from '@/services/api';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPhonePopupOpen, setIsPhonePopupOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isStoringPhone, setIsStoringPhone] = useState(false);
  const t = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const handleJoinCommunity = () => {
    setAuthMode('register');
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleBlogNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src={communityEmblem} 
                alt="Powar Community Emblem" 
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <h1 className="font-devanagari font-bold text-lg text-primary">पवार समुदाय</h1>
                <p className="font-inter text-xs text-muted-foreground">Powar Community</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-foreground hover:text-primary transition-colors font-medium">
                {t.nav.home}
              </a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
                {t.nav.about}
              </a>
              <a href="#community" className="text-foreground hover:text-primary transition-colors font-medium">
                {t.nav.community}
              </a>
              <a href="#events" className="text-foreground hover:text-primary transition-colors font-medium">
                {t.nav.events}
              </a>
              <a href="#heritage" className="text-foreground hover:text-primary transition-colors font-medium">
                Heritage
              </a>
              <a 
                href="/blog" 
                className="text-foreground hover:text-primary transition-colors font-medium"
                onClick={handleBlogNavigation}
              >
                Blog
              </a>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <LanguageDropdown />
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {user?.profile?.first_name || user?.email_id}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/profile')} 
                    className="text-foreground hover:text-primary"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  <Button variant="ghost" onClick={handleLogout} className="text-foreground hover:text-primary">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={handleSignIn} className="text-foreground hover:text-primary">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                  <Button onClick={handleJoinCommunity} className="btn-royal">
                    <Crown className="h-4 w-4 mr-2" />
                    {t.hero.joinCommunity}
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-foreground hover:text-primary"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
                {/* Language Selector for Mobile */}
                <div className="px-3 py-2 border-b border-border/50">
                  <LanguageDropdown />
                </div>
                
                <a 
                  href="#home" 
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.nav.home}
                </a>
                <a 
                  href="#about" 
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.nav.about}
                </a>
                <a 
                  href="#community" 
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.nav.community}
                </a>
                <a 
                  href="#events" 
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.nav.events}
                </a>
                <a 
                  href="#heritage" 
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Heritage
                </a>
                <a 
                  href="/blog" 
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                  onClick={(e) => { 
                    e.preventDefault();
                    setIsMenuOpen(false);
                    handleBlogNavigation(e);
                  }}
                >
                  Blog
                </a>
                <div className="px-3 py-2 space-y-2">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center space-x-2 px-3 py-2">
                        <User className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">
                          {user?.profile?.first_name || user?.email_id}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        onClick={() => { navigate('/profile'); setIsMenuOpen(false); }} 
                        className="w-full justify-start text-foreground hover:text-primary"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                      <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-foreground hover:text-primary">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" onClick={handleSignIn} className="w-full justify-start text-foreground hover:text-primary">
                        <User className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                      <Button onClick={handleJoinCommunity} className="btn-royal w-full justify-start">
                        <Crown className="h-4 w-4 mr-2" />
                        {t.hero.joinCommunity}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
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