import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Quote, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Recommendation {
  id: string;
  parent_name: string;
  child_name: string | null;
  recommendation_text: string;
  rating: number | null;
  is_featured: boolean;
}

interface RecommendationCardProps {
  rec: Recommendation;
  isFeatured?: boolean;
}

const RecommendationCard = ({ rec, isFeatured = false }: RecommendationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Check if text is long enough to need "read more"
  useEffect(() => {
    const checkTextLength = () => {
      if (textRef.current) {
        const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight) || 20;
        const maxHeight = lineHeight * 4; // 4 lines max
        setShouldShowButton(textRef.current.scrollHeight > maxHeight);
      }
    };

    // Small delay to ensure DOM is rendered
    setTimeout(checkTextLength, 100);
    window.addEventListener('resize', checkTextLength);
    return () => window.removeEventListener('resize', checkTextLength);
  }, [rec.recommendation_text]);

  return (
    <Card className={`${isFeatured ? "border-primary/20 shadow-lg hover:shadow-xl transition-shadow" : "border-none shadow-md hover:shadow-lg transition-shadow"} flex flex-col`}>
      <CardContent className="pt-6 pb-6 flex flex-col" style={{ maxHeight: '350px' }}>
        <div className="flex items-start gap-3 mb-4 flex-shrink-0">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Quote className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {rec.rating && (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < rec.rating!
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            <p className="font-semibold text-sm">{rec.parent_name}</p>
            {rec.child_name && (
              <p className="text-xs text-muted-foreground">הורה של {rec.child_name}</p>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className={`relative flex-1 ${isExpanded ? 'overflow-y-auto' : ''}`}>
            <p
              ref={textRef}
              className={`text-muted-foreground leading-relaxed text-sm transition-all duration-300 ${
                isExpanded ? '' : 'line-clamp-4'
              }`}
            >
              "{rec.recommendation_text}"
            </p>
          </div>
          {shouldShowButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 self-start text-primary hover:text-primary/80 p-0 h-auto font-normal flex-shrink-0"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 ml-1" />
                  קרא פחות
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 ml-1" />
                  קרא עוד
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ParentRecommendationsSection = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const { data, error } = await supabase
        .from('parent_recommendations')
        .select('id, parent_name, child_name, recommendation_text, rating, is_featured')
        .eq('is_approved', true)
        .order('is_featured', { ascending: false })
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) {
        console.error('Error fetching recommendations:', error);
      } else {
        setRecommendations(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="recommendations" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  const featuredRecommendations = recommendations.filter(r => r.is_featured);
  const regularRecommendations = recommendations.filter(r => !r.is_featured);

  return (
    <section id="recommendations" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">המלצות הורים</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            הורים ותלמידים מספרים על החוויה שלהם בתכנותא
          </p>
        </div>

        {/* Featured Recommendations */}
        {featuredRecommendations.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-center">המלצות מובילות</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRecommendations.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} isFeatured={true} />
              ))}
            </div>
          </div>
        )}

        {/* Regular Recommendations */}
        {regularRecommendations.length > 0 && (
          <div>
            {featuredRecommendations.length > 0 && (
              <h3 className="text-2xl font-semibold mb-6 text-center">עוד המלצות</h3>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularRecommendations.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} isFeatured={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ParentRecommendationsSection;
