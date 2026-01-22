import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Play, Image as ImageIcon, ArrowRight } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  media_type: string;
  drive_url: string;
  thumbnail_url: string | null;
  sort_order: number;
}

const Gallery = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Convert Google Drive share link to embeddable format
  const getEmbedUrl = (url: string, type: string) => {
    // Extract file ID from various Google Drive URL formats
    let fileId = "";
    
    if (url.includes("/file/d/")) {
      fileId = url.split("/file/d/")[1]?.split("/")[0] || "";
    } else if (url.includes("id=")) {
      fileId = url.split("id=")[1]?.split("&")[0] || "";
    } else if (url.includes("/d/")) {
      fileId = url.split("/d/")[1]?.split("/")[0] || "";
    }

    if (fileId) {
      if (type === "video") {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }
    
    return url;
  };

  const getThumbnailUrl = (item: GalleryItem) => {
    if (item.thumbnail_url) return item.thumbnail_url;
    return getEmbedUrl(item.drive_url, "image");
  };

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-16 md:py-24">
          <div className="container mx-auto px-4 text-center text-primary-foreground">
            <ImageIcon className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              גלריה
            </h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-6">
              תמונות וסרטונים מהפעילויות והקורסים שלנו
            </p>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={() => navigate("/")}
            >
              <ArrowRight className="ml-2 h-4 w-4" />
              חזרה לדף הבית
            </Button>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">הגלריה ריקה כרגע</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <Card 
                  key={item.id}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                  onClick={() => setSelectedItem(item)}
                >
                  <CardContent className="p-0 relative aspect-video">
                    <img
                      src={getThumbnailUrl(item)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                    {item.media_type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                        <div className="bg-white/90 rounded-full p-3">
                          <Play className="h-8 w-8 text-primary fill-primary" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <h3 className="text-white font-medium text-sm truncate">
                        {item.title}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          </div>
        </section>
      </main>

      {/* Media Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {selectedItem && (
            <div>
              {selectedItem.media_type === "video" ? (
                <iframe
                  src={getEmbedUrl(selectedItem.drive_url, "video")}
                  className="w-full aspect-video"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <img
                  src={getEmbedUrl(selectedItem.drive_url, "image")}
                  alt={selectedItem.title}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              )}
              <div className="p-4 bg-background">
                <h3 className="text-lg font-semibold">{selectedItem.title}</h3>
                {selectedItem.description && (
                  <p className="text-muted-foreground mt-1">{selectedItem.description}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Gallery;
