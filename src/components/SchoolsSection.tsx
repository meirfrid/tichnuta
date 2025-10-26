import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, School as SchoolIcon } from "lucide-react";
import { useSchools } from "@/hooks/useSchools";
import { useNavigate } from "react-router-dom";

const SchoolsSection = () => {
  const { schools, loading } = useSchools();
  const navigate = useNavigate();

  // Map icon names to components
  const iconMap = {
    GraduationCap,
    School: SchoolIcon,
  } as any;
  
  return (
    <section id="schools" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">תלמודי תורה</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            בחרו את תלמוד התורה שלכם לצפייה בקורסים זמינים
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">טוען תלמודי תורה...</p>
            </div>
          ) : schools.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">אין תלמודי תורה זמינים כרגע</p>
            </div>
          ) : (
            schools.map((school) => {
              const IconComponent = iconMap[school.icon] || GraduationCap;
              return (
                <Card 
                  key={school.id} 
                  className="overflow-hidden hover:shadow-card transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/school/${school.id}`)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className={`p-4 rounded-lg ${school.color} group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-10 w-10 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl mb-2">{school.name}</CardTitle>
                        {school.description && (
                          <p className="text-muted-foreground text-sm">{school.description}</p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
                      צפייה בקורסים
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default SchoolsSection;
