import { Shield, Crown, Sword, Flower } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

export const About = () => {
  const t = useTranslation();
  
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t.about.title}
            </h2>
            <p className="text-xl text-secondary font-semibold">
              {t.about.subtitle}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-6"></div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left: Description */}
            <div className="space-y-8">
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {t.about.description}
              </p>
              
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-3xl">
                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                  <Crown className="h-6 w-6 text-primary mr-3" />
                  {t.about.rajaTitle}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t.about.rajaDescription}
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-secondary/10 to-accent/10 p-8 rounded-3xl">
                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                  <Shield className="h-6 w-6 text-secondary mr-3" />
                  {t.about.legacyTitle}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t.about.legacyDescription}
                </p>
              </div>
            </div>

            {/* Right: Values Cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="card-heritage">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h5 className="font-semibold text-lg text-foreground mb-2">धर्म - Dharma</h5>
                  <p className="text-sm text-muted-foreground">Righteousness and moral duty guide our actions</p>
                </CardContent>
              </Card>

              <Card className="card-heritage">
                <CardContent className="p-6 text-center">
                  <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sword className="h-8 w-8 text-secondary" />
                  </div>
                  <h5 className="font-semibold text-lg text-foreground mb-2">वीरता - Valor</h5>
                  <p className="text-sm text-muted-foreground">Courage in face of challenges and adversity</p>
                </CardContent>
              </Card>

              <Card className="card-heritage">
                <CardContent className="p-6 text-center">
                  <div className="bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Flower className="h-8 w-8 text-accent" />
                  </div>
                  <h5 className="font-semibold text-lg text-foreground mb-2">एकता - Unity</h5>
                  <p className="text-sm text-muted-foreground">Strength through community bonds and solidarity</p>
                </CardContent>
              </Card>

              <Card className="card-heritage">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary-glow/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-8 w-8 text-primary-glow" />
                  </div>
                  <h5 className="font-semibold text-lg text-foreground mb-2">गौरव - Pride</h5>
                  <p className="text-sm text-muted-foreground">Honor in our heritage and ancestral legacy</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};