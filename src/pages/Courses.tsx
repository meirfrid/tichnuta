import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, Gamepad2, Smartphone, Bot, Clock, Users, GraduationCap, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import scratchLogo from "@/assets/scratch-logo.png";
import pythonLogo from "@/assets/python-logo.png";
import appinventorLogo from "@/assets/appinventor-logo.png";

const getCourseImage = (title: string): string | null => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('סקראץ') || lowerTitle.includes('scratch')) {
    return scratchLogo;
  }
  if (lowerTitle.includes('פייתון') || lowerTitle.includes('python')) {
    return pythonLogo;
  }
  if (lowerTitle.includes('אפליקציות') || lowerTitle.includes('app')) {
    return appinventorLogo;
  }
  return null;
};

const Courses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
    }
  };

  // Map icon names to components
  const iconMap: Record<string, any> = {
    Code2,
    Gamepad2,
    Smartphone,
    Bot
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-16 md:py-24">
          <div className="container mx-auto px-4 text-center text-primary-foreground">
            <GraduationCap className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">הקורסים שלנו</h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              קורסי תכנות מקצועיים לילדים בכל הגילאים
            </p>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <p className="text-xl">אין קורסים זמינים כרגע</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {courses.map((course) => {
                  const IconComponent = iconMap[course.icon] || Code2;
                  const courseImage = getCourseImage(course.title);
                  return (
                    <Card 
                      key={course.id} 
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                      onClick={() => navigate(`/courses/${course.slug || course.id}`)}
                    >
                      {courseImage ? (
                        <div className="h-40 overflow-hidden">
                          <img 
                            src={courseImage} 
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div 
                          className="h-32 flex items-center justify-center"
                          style={{ backgroundColor: course.color || 'hsl(var(--primary))' }}
                        >
                          <IconComponent className="h-16 w-16 text-white" />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="mb-4">
                          <span className="inline-block px-3 py-1 text-sm rounded-full bg-primary/10 text-primary font-medium">
                            {course.subtitle}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{course.group_size}</span>
                          </div>
                        </div>
                        <Button 
                          className="w-full mt-4"
                          variant="outline"
                        >
                          <ArrowLeft className="ml-2 h-4 w-4" />
                          לפרטים נוספים
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
