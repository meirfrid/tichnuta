import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gamepad2, Smartphone, Monitor, Code2, Bot, Users } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import GroupsIcon from '@mui/icons-material/Groups';
const Hero = () => {
  const { siteContent } = useSiteContent();
  const [courses, setCourses] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching courses:', error);
      } else {
        setCourses(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Map icon names to components
  const iconMap = {
    Code2,
    Gamepad2,
    Smartphone,
    Bot
  } as any;

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
          {siteContent.heroTitle && (
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {siteContent.heroTitle}
            </h1>
          )}
          {siteContent.heroSubtitle && (
            <p className="text-xl md:text-2xl mb-4 opacity-90">
              {siteContent.heroSubtitle}
            </p>
          )}
          {siteContent.heroDescription && (
            <p className="text-lg opacity-80 max-w-2xl mx-auto mb-8">
              {siteContent.heroDescription}
            </p>
          )}
          {siteContent.heroButtonText && (
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3"
              onClick={() => navigate("/courses")}
            >
              {siteContent.heroButtonText}
            </Button>
          )}
        </div>

        {/* Course Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 max-w-2xl mx-auto">
          <Card 
            className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center text-primary-foreground hover:bg-white/20 transition-colors cursor-pointer"
            onClick={() => navigate("/online-learning")}
          >
            <Monitor className="h-8 w-8 mx-auto mb-3" />
            <div className="text-2xl font-bold mb-2">קורסים אונליין</div>
            <div className="text-sm opacity-80">למידה מהבית בזמנים נוחים</div>
          </Card>
          <Card 
            className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center text-primary-foreground hover:bg-white/20 transition-colors cursor-pointer"
            onClick={() => navigate("/frontal-learning")}
          >
            <Users className="h-8 w-8 mx-auto mb-3" />
            <div className="text-2xl font-bold mb-2">קורסים פרונטליים</div>
            <div className="text-sm opacity-80">למידה בקבוצות קטנות עם מדריך</div>
          </Card>
        </div>


        {/* Age Groups Preview */}
        {courses.length > 0 && (
          <div className="text-center text-primary-foreground">
            <h2 className="text-3xl font-bold mb-8">קורסים לכל הגילאים</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {courses.map((course) => {
                const IconComponent = iconMap[course.icon] || Code2;
                return (
                  <Card 
                    key={course.id} 
                    className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-primary-foreground hover:bg-white/20 transition-colors w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] min-w-[200px] cursor-pointer"
                    onClick={() => navigate(`/courses/${course.slug || course.id}`)}
                  >
                    <div className="flex justify-center mb-3">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{course.subtitle}</h3>
                    <p className="text-sm opacity-80">{course.title}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;