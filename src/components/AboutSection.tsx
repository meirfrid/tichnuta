import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Heart, Trophy, Users } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const AboutSection = () => {
  const { siteContent } = useSiteContent();
  
  const iconMap = [Heart, Trophy, Users, CheckCircle];
  
  const values = siteContent.values.map((value, index) => ({
    ...value,
    icon: iconMap[index] || CheckCircle
  }));

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-6">{siteContent.aboutTitle}</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg">
                {siteContent.aboutDescription1}
              </p>
              <p>
                {siteContent.aboutDescription2}
              </p>
              <p>
                {siteContent.aboutDescription3}
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{siteContent.studentsCount}</div>
                <div className="text-sm text-muted-foreground">תלמידים</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{siteContent.experienceYears}</div>
                <div className="text-sm text-muted-foreground">שנות ניסיון</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{siteContent.satisfactionRate}</div>
                <div className="text-sm text-muted-foreground">שביעות רצון</div>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="border-2 border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Mission Statement */}
        <Card className="mt-16 bg-gradient-card border-2 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">{siteContent.missionTitle}</h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {siteContent.missionDescription}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AboutSection;