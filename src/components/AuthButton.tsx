import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AuthButton = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "התנתקת בהצלחה",
        description: "להתראות!",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא הצלחנו להתנתק",
        variant: "destructive",
      });
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {isAdmin && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            ניהול אתר
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          התנתק
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate("/auth")}
      className="flex items-center gap-2"
    >
      <User className="h-4 w-4" />
      התחברות
    </Button>
  );
};

export default AuthButton;