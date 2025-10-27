import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
      setInitialLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Starting sign up for:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      console.log('Sign up response:', { data, error });

      if (error) throw error;

      if (data.user && !data.session) {
        toast({
          title: "הצלחה!",
          description: "נשלח לך מייל אישור. אנא בדוק את תיבת הדואר שלך ולחץ על הקישור",
        });
      } else if (data.session) {
        toast({
          title: "נרשמת בהצלחה!",
          description: "ברוך הבא!",
        });
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: "שגיאה",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Starting sign in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Sign in response:', { data, error });

      if (error) throw error;

      toast({
        title: "התחברת בהצלחה!",
        description: "ברוך הבא חזרה",
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "שגיאה בהתחברות",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col-reverse items-center justify-center gap-10 px-4 py-8 lg:flex-row lg:items-stretch lg:px-12 lg:py-12" dir="rtl">
        <Card className="w-full max-w-lg self-center shadow-lg">
          <CardHeader className="text-center lg:text-right">
            <CardTitle className="text-2xl font-bold">התחברות לאתר</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              הכנס את פרטיך כדי להתחבר או להירשם
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                <TabsTrigger value="signin" className="w-full">התחברות</TabsTrigger>
                <TabsTrigger value="signup" className="w-full">הרשמה</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2 text-right">
                    <Label htmlFor="signin-email" className="text-right">כתובת מייל</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 text-right">
                    <Label htmlFor="signin-password" className="text-right">סיסמה</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="הכנס סיסמה"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        מתחבר...
                      </>
                    ) : (
                      "התחבר"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2 text-right">
                    <Label htmlFor="signup-email" className="text-right">כתובת מייל</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 text-right">
                    <Label htmlFor="signup-password" className="text-right">סיסמה</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="בחר סיסמה חזקה"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        נרשם...
                      </>
                    ) : (
                      "הירשם"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-sm text-muted-foreground"
              >
                חזור לעמוד הראשי
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex w-full max-w-xl flex-col items-center justify-center rounded-2xl bg-primary/10 p-8 text-center shadow-inner lg:max-w-md lg:text-right">
          <h2 className="mb-4 text-3xl font-bold text-primary">ברוכים הבאים!</h2>
          <p className="text-lg text-muted-foreground">
            הצטרפו אלינו ותיהנו מגישה נוחה לכל התכנים והשירותים של המערכת מכל מקום ובכל זמן.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;