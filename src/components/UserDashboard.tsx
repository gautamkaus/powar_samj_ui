import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, User, MapPin, Briefcase, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from './UserProfile';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <section id="dashboard" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-devanagari text-3xl md:text-4xl font-bold text-primary mb-4">
            Welcome to Powar Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            You are now part of our growing community. Connect with fellow members, explore heritage, and contribute to our shared culture.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Welcome Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-primary" />
                <span>Welcome, {user.profile?.first_name || 'Member'}!</span>
              </CardTitle>
              <CardDescription>
                You've successfully joined the Powar Community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Member since {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {user.profile?.state_name || 'Location not set'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {user.profile?.employee_type || 'Profession not set'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Community Stats</CardTitle>
              <CardDescription>Your contribution to the community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1</div>
                <div className="text-sm text-muted-foreground">Days as Member</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">0</div>
                <div className="text-sm text-muted-foreground">Events Attended</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">0</div>
                <div className="text-sm text-muted-foreground">Connections Made</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="font-devanagari text-2xl md:text-3xl font-bold text-primary mb-2">
              Your Profile
            </h3>
            <p className="text-muted-foreground">
              Complete your profile to connect better with the community
            </p>
          </div>
          <UserProfile />
        </div>

        {/* Community Actions */}
        <div className="text-center">
          <h3 className="font-devanagari text-2xl md:text-3xl font-bold text-primary mb-6">
            Get Started
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="btn-heritage">
              <Calendar className="h-4 w-4 mr-2" />
              Browse Events
            </Button>
            <Button variant="outline" className="btn-heritage">
              <User className="h-4 w-4 mr-2" />
              Find Members
            </Button>
            <Button variant="outline" className="btn-heritage">
              <Crown className="h-4 w-4 mr-2" />
              Explore Heritage
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
