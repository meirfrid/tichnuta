import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowRight, Plus, Trash2, Edit, GripVertical, Image, Video } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  media_type: string;
  drive_url: string;
  thumbnail_url: string | null;
  sort_order: number;
  is_active: boolean;
}

const GalleryManagement = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    media_type: "image",
    drive_url: "",
    thumbnail_url: "",
    is_active: true,
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchItems();
    }
  }, [user, isAdmin]);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      toast.error("שגיאה בטעינת פריטי הגלריה");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      media_type: "image",
      drive_url: "",
      thumbnail_url: "",
      is_active: true,
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      media_type: item.media_type,
      drive_url: item.drive_url,
      thumbnail_url: item.thumbnail_url || "",
      is_active: item.is_active,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.drive_url) {
      toast.error("יש למלא כותרת וקישור");
      return;
    }

    try {
      if (editingItem) {
        const { error } = await supabase
          .from("gallery_items")
          .update({
            title: formData.title,
            description: formData.description || null,
            media_type: formData.media_type,
            drive_url: formData.drive_url,
            thumbnail_url: formData.thumbnail_url || null,
            is_active: formData.is_active,
          })
          .eq("id", editingItem.id);

        if (error) throw error;
        toast.success("הפריט עודכן בהצלחה");
      } else {
        const maxSortOrder = items.length > 0 ? Math.max(...items.map(i => i.sort_order)) : -1;
        
        const { error } = await supabase
          .from("gallery_items")
          .insert({
            title: formData.title,
            description: formData.description || null,
            media_type: formData.media_type,
            drive_url: formData.drive_url,
            thumbnail_url: formData.thumbnail_url || null,
            is_active: formData.is_active,
            sort_order: maxSortOrder + 1,
          });

        if (error) throw error;
        toast.success("הפריט נוסף בהצלחה");
      }
      
      resetForm();
      fetchItems();
    } catch (error) {
      console.error("Error saving gallery item:", error);
      toast.error("שגיאה בשמירת הפריט");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק פריט זה?")) return;

    try {
      const { error } = await supabase
        .from("gallery_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("הפריט נמחק בהצלחה");
      fetchItems();
    } catch (error) {
      console.error("Error deleting gallery item:", error);
      toast.error("שגיאה במחיקת הפריט");
    }
  };

  const toggleActive = async (item: GalleryItem) => {
    try {
      const { error } = await supabase
        .from("gallery_items")
        .update({ is_active: !item.is_active })
        .eq("id", item.id);

      if (error) throw error;
      fetchItems();
    } catch (error) {
      console.error("Error toggling item status:", error);
      toast.error("שגיאה בעדכון הסטטוס");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
                <ArrowRight className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold">ניהול גלריה</h1>
            </div>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              הוסף פריט
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Add/Edit Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingItem ? "עריכת פריט" : "הוספת פריט חדש"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">כותרת *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="הזן כותרת"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="media_type">סוג מדיה *</Label>
                    <Select
                      value={formData.media_type}
                      onValueChange={(value) => setFormData({ ...formData, media_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">תמונה</SelectItem>
                        <SelectItem value="video">סרטון</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="drive_url">קישור Google Drive *</Label>
                  <Input
                    id="drive_url"
                    value={formData.drive_url}
                    onChange={(e) => setFormData({ ...formData, drive_url: e.target.value })}
                    placeholder="https://drive.google.com/file/d/..."
                    dir="ltr"
                  />
                  <p className="text-xs text-muted-foreground">
                    העתק את הקישור לשיתוף מ-Google Drive (וודא שהקובץ משותף לכולם)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail_url">קישור תמונה ממוזערת (אופציונלי)</Label>
                  <Input
                    id="thumbnail_url"
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    placeholder="https://..."
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">תיאור (אופציונלי)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="הזן תיאור"
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">פעיל</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingItem ? "עדכן" : "הוסף"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    ביטול
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Items List */}
        <div className="space-y-4">
          {items.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">אין פריטים בגלריה</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowForm(true)}
                >
                  הוסף פריט ראשון
                </Button>
              </CardContent>
            </Card>
          ) : (
            items.map((item) => (
              <Card key={item.id} className={!item.is_active ? "opacity-60" : ""}>
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                    
                    <div className="flex-shrink-0 w-20 h-14 bg-muted rounded overflow-hidden">
                      {item.media_type === "video" ? (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Video className="h-6 w-6 text-muted-foreground" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Image className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{item.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {item.media_type === "video" ? "סרטון" : "תמונה"} • {item.description || "ללא תיאור"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.is_active}
                        onCheckedChange={() => toggleActive(item)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default GalleryManagement;
