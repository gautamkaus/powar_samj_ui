import { Users, Heart, Globe, BookOpen, Handshake, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import communityValuesImage from '@/assets/community-values.jpg';

export const CommunityValues = () => {
  const t = useTranslation();
  const values = [
    {
      icon: Users,
      title: "सामुदायिक एकता",
      subtitle: "Community Unity",
      description: "Building bridges between Powar families across the globe, fostering connections that transcend geographical boundaries.",
      color: "primary"
    },
    {
      icon: Heart,
      title: "पारस्परिक सहायता",
      subtitle: "Mutual Support",
      description: "Supporting each other in times of need, celebrating successes together, and growing as one unified community.",
      color: "secondary"
    },
    {
      icon: BookOpen,
      title: "शिक्षा एवं ज्ञान",
      subtitle: "Education & Knowledge",
      description: "Promoting educational excellence, preserving traditional wisdom, and encouraging lifelong learning among members.",
      color: "accent"
    },
    {
      icon: Globe,
      title: "सांस्कृतिक संरक्षण",
      subtitle: "Cultural Preservation",
      description: "Maintaining our rich cultural heritage while adapting to modern times, ensuring traditions pass to future generations.",
      color: "primary-glow"
    },
    {
      icon: Handshake,
      title: "व्यावसायिक नेटवर्क",
      subtitle: "Professional Network",
      description: "Creating opportunities for business collaboration, career advancement, and entrepreneurial ventures within our community.",
      color: "secondary-glow"
    },
    {
      icon: Star,
      title: "नेतृत्व विकास",
      subtitle: "Leadership Development",
      description: "Nurturing leadership qualities in youth, encouraging community service, and building the next generation of leaders.",
      color: "accent-glow"
    }
  ];

  return (
    <section id="community" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t.values.title}
            </h2>
            <p className="text-xl text-secondary font-semibold max-w-2xl mx-auto">
              {t.values.subtitle}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-6"></div>
          </div>
            
          {/* Feature Image */}
          <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden mb-12">
            <img 
              src={communityValuesImage} 
              alt="Community Values and Unity" 
              className="w-full h-64 sm:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent flex items-end">
              <div className="p-8 text-center w-full">
                <p className="font-devanagari text-xl sm:text-2xl font-semibold text-primary-foreground mb-2">
                  "वसुधैव कुटुम्बकम्"
                </p>
                <p className="text-sm sm:text-base text-primary-foreground/90 italic">
                  "The World is One Family" - Our Global Vision
                </p>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="card-heritage h-full group">
                  <CardHeader className="text-center pb-4">
                    <div className={`bg-${value.color}/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`h-10 w-10 text-${value.color}`} />
                    </div>
                    <CardTitle className="space-y-2">
                      <h4 className="font-devanagari text-lg font-bold text-primary">
                        {value.title}
                      </h4>
                      <h5 className="font-inter text-base font-semibold text-foreground">
                        {value.subtitle}
                      </h5>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed text-center">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Call to Action Section */}
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 sm:p-12 text-center">
            <h4 className="font-devanagari text-2xl sm:text-3xl font-bold text-heritage mb-4">
              समुदाय में शामिल हों
            </h4>
            <h5 className="font-inter text-xl sm:text-2xl font-bold text-foreground mb-6">
              Join Our Growing Community
            </h5>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Become part of a thriving network of Powar community members who are making a difference 
              in their fields while staying connected to their roots. Together, we honor our heritage 
              and build a stronger future.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button className="btn-royal text-lg px-8 py-4">
                <Users className="h-5 w-5 mr-2" />
                Become a Member
              </Button>
              <Button variant="outline" className="btn-heritage text-lg px-8 py-4 border-2 border-accent hover:bg-accent hover:text-accent-foreground">
                Learn More About Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};