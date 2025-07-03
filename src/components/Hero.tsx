import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Code2, Gamepad2, Smartphone, Monitor } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const Hero = () => {
  const { siteContent } = useSiteContent();
  
  return (
    <section id="home" className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-6xl">{"</>"}</div>
        <div className="absolute top-40 right-20 text-4xl">{"{ }"}</div>
        <div className="absolute bottom-40 left-20 text-5xl">{"</ >"}</div>
        <div className="absolute bottom-20 right-10 text-3xl">{"( )"}</div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center text-primary-foreground mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {siteContent.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl mb-4 opacity-90">
            {siteContent.heroSubtitle}
          </p>
          <p className="text-lg opacity-80 max-w-2xl mx-auto mb-8">
            {siteContent.heroDescription}
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3">
            {siteContent.heroButtonText}
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center text-primary-foreground">
            <Code2 className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">4</div>
            <div className="text-sm opacity-80">קורסים</div>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center text-primary-foreground">
            <Gamepad2 className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">משחקים</div>
            <div className="text-sm opacity-80">פיתוח</div>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center text-primary-foreground">
            <Smartphone className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">אפליקציות</div>
            <div className="text-sm opacity-80">יצירת</div>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center text-primary-foreground">
            <Monitor className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">פייתון</div>
            <div className="text-sm opacity-80">לימוד</div>
          </Card>
        </div>

        {/* Age Groups Preview */}
        <div className="text-center text-primary-foreground">
          <h2 className="text-3xl font-bold mb-8">קורסים לכל הגילאים</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-primary-foreground hover:bg-white/20 transition-colors">
              <h3 className="text-lg font-semibold mb-2">כיתות א'-ב'</h3>
              <p className="text-sm opacity-80">פיתוח משחקים בקוד</p>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-primary-foreground hover:bg-white/20 transition-colors">
              <h3 className="text-lg font-semibold mb-2">כיתות ג'-ד'</h3>
              <p className="text-sm opacity-80">פיתוח משחקים בסקראץ</p>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-primary-foreground hover:bg-white/20 transition-colors">
              <h3 className="text-lg font-semibold mb-2">כיתות ה'-ו'</h3>
              <p className="text-sm opacity-80">פיתוח אפליקציות App Inventor</p>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-primary-foreground hover:bg-white/20 transition-colors">
              <h3 className="text-lg font-semibold mb-2">כיתות ז'-ח'</h3>
              <p className="text-sm opacity-80">פיתוח משחקים בפייתון</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;