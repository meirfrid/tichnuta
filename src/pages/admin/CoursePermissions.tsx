import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Plus, Trash2, Upload } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AllowedEmail {
  id: string;
  email: string;
  created_at: string;
}

const CoursePermissions = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [allowedEmails, setAllowedEmails] = useState<AllowedEmail[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [bulkEmails, setBulkEmails] = useState("");
  const [showBulkAdd, setShowBulkAdd] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin");
      return;
    }
    fetchCourse();
    fetchAllowedEmails();
  }, [courseId, isAdmin]);

  const fetchCourse = async () => {
    if (!courseId) return;
    const { data } = await supabase.from("courses").select("*").eq("id", courseId).single();
    if (data) setCourse(data);
  };

  const fetchAllowedEmails = async () => {
    if (!courseId) return;
    const { data } = await supabase
      .from("course_allowed_emails")
      .select("*")
      .eq("course_id", courseId)
      .order("created_at", { ascending: false });
    if (data) setAllowedEmails(data);
  };

  const handleAddEmail = async () => {
    const email = newEmail.trim().toLowerCase();
    if (!email || !courseId) {
      toast({ title: "שגיאה", description: "יש למלא כתובת מייל", variant: "destructive" });
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "שגיאה", description: "כתובת מייל לא תקינה", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase.from("course_allowed_emails").insert({
        course_id: courseId,
        email: email,
      });

      if (error) {
        if (error.code === "23505") {
          toast({ title: "המייל כבר קיים ברשימה", variant: "destructive" });
        } else {
          throw error;
        }
        return;
      }

      toast({ title: "מייל נוסף בהצלחה" });
      setNewEmail("");
      fetchAllowedEmails();
    } catch (error: any) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    }
  };

  const handleBulkAdd = async () => {
    if (!bulkEmails.trim() || !courseId) return;

    const emails = bulkEmails
      .split(/[\n,;]/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

    if (emails.length === 0) {
      toast({ title: "שגיאה", description: "לא נמצאו מיילים תקינים", variant: "destructive" });
      return;
    }

    try {
      let added = 0;
      let skipped = 0;

      for (const email of emails) {
        const { error } = await supabase.from("course_allowed_emails").insert({
          course_id: courseId,
          email: email,
        });

        if (error) {
          if (error.code === "23505") {
            skipped++;
          } else {
            // Skip silently if not duplicate
          }
        } else {
          added++;
        }
      }

      toast({
        title: "הוספה בהצלחה",
        description: `נוספו ${added} מיילים${skipped > 0 ? `, ${skipped} כבר היו קיימים` : ""}`,
      });
      setBulkEmails("");
      setShowBulkAdd(false);
      fetchAllowedEmails();
    } catch (error: any) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteEmail = async (id: string) => {
    if (!confirm("האם למחוק מייל זה מהרשימה?")) return;

    try {
      const { error } = await supabase.from("course_allowed_emails").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "מייל נמחק בהצלחה" });
      fetchAllowedEmails();
    } catch (error: any) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/admin")} className="mb-6">
          <ArrowRight className="ml-2 h-4 w-4" />
          חזרה לניהול
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>ניהול הרשאות: {course?.title}</CardTitle>
            <CardDescription>
              הוסף מיילים של משתמשים שיכולים לגשת לקורס זה
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label>הוסף מייל בודד</Label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="example@email.com"
                    onKeyDown={(e) => e.key === "Enter" && handleAddEmail()}
                  />
                  <Button onClick={handleAddEmail}>
                    <Plus className="ml-2 h-4 w-4" />
                    הוסף
                  </Button>
                </div>
              </div>
            </div>

            {!showBulkAdd && (
              <Button variant="outline" onClick={() => setShowBulkAdd(true)}>
                <Upload className="ml-2 h-4 w-4" />
                הוסף מיילים מרובים
              </Button>
            )}

            {showBulkAdd && (
              <Card>
                <CardHeader>
                  <CardTitle>הוסף מיילים מרובים</CardTitle>
                  <CardDescription>
                    הזן מיילים מופרדים בפסיקים, נקודה-פסיק או שורה חדשה
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={bulkEmails}
                    onChange={(e) => setBulkEmails(e.target.value)}
                    placeholder="user1@example.com, user2@example.com&#10;user3@example.com"
                    rows={6}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleBulkAdd}>הוסף הכל</Button>
                    <Button variant="outline" onClick={() => setShowBulkAdd(false)}>
                      ביטול
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-4">
                מיילים מאושרים ({allowedEmails.length})
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>כתובת מייל</TableHead>
                    <TableHead>תאריך הוספה</TableHead>
                    <TableHead className="text-left">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allowedEmails.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        אין מיילים מאושרים עדיין
                      </TableCell>
                    </TableRow>
                  ) : (
                    allowedEmails.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>
                          {new Date(item.created_at).toLocaleDateString("he-IL")}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteEmail(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoursePermissions;
