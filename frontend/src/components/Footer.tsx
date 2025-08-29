import { Crown, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import communityEmblem from '@/assets/community-emblem.jpg';

export const Footer = () => {
  const t = useTranslation();
  return (
    <footer className="bg-gradient-to-b from-background to-muted/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src={communityEmblem} 
                alt="Powar Community Emblem" 
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-devanagari font-bold text-xl text-primary">पवार समुदाय</h3>
                <p className="font-inter text-sm text-muted-foreground">Powar Community</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
              {t.footer.description}
            </p>
            <p className="font-devanagari text-primary font-semibold mb-4">
              {t.footer.slogan}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-primary/20 p-3 rounded-full hover:bg-primary/30 transition-colors">
                <Facebook className="h-5 w-5 text-primary" />
              </a>
              <a href="#" className="bg-secondary/20 p-3 rounded-full hover:bg-secondary/30 transition-colors">
                <Twitter className="h-5 w-5 text-secondary" />
              </a>
              <a href="#" className="bg-accent/20 p-3 rounded-full hover:bg-accent/30 transition-colors">
                <Instagram className="h-5 w-5 text-accent" />
              </a>
              <a href="#" className="bg-primary-glow/20 p-3 rounded-full hover:bg-primary-glow/30 transition-colors">
                <Linkedin className="h-5 w-5 text-primary-glow" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-6 flex items-center">
              <Crown className="h-5 w-5 text-primary mr-2" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li><a href="#home" className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
              <li><a href="#about" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#community" className="text-muted-foreground hover:text-primary transition-colors">Community</a></li>
              <li><a href="#events" className="text-muted-foreground hover:text-primary transition-colors">Events</a></li>
              <li><a href="#heritage" className="text-muted-foreground hover:text-primary transition-colors">Heritage</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Member Directory</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Join Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-6 flex items-center">
              <Mail className="h-5 w-5 text-secondary mr-2" />
              Connect With Us
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a href="mailto:contact@powarcommunity.org" className="text-foreground hover:text-primary transition-colors">
                    contact@powarcommunity.org
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-secondary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <a href="tel:+911234567890" className="text-foreground hover:text-secondary transition-colors">
                    +91 123 456 7890
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Headquarters</p>
                  <p className="text-foreground">Mumbai, Maharashtra, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Heritage Quote */}
        <div className="text-center py-8 mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl">
          <p className="font-devanagari text-lg text-primary font-semibold mb-2">
            "धर्म एव हतो हन्ति धर्मो रक्षति रक्षितः"
          </p>
          <p className="text-sm text-muted-foreground italic">
            "Dharma destroys those who destroy it; Dharma protects those who protect it"
          </p>
          <p className="text-xs text-muted-foreground mt-1">- Ancient Kshatriya Wisdom</p>
        </div>

        {/* Bottom Border */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 Powar Community. All rights reserved. | Preserving heritage, Building future.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Community Guidelines</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};