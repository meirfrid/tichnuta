
import { Button } from "@/components/ui/button";
import { Code2, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthButton from "./AuthButton";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (section: string) => {
    // Close mobile menu if open
    setIsMenuOpen(false);

    // If we're already on the home page, just scroll
    if (location.pathname === "/") {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to home page first, then scroll after a short delay
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Desktop Navigation - moved to left */}
          <nav className="hidden md:flex items-center gap-6 h-24">
            <button onClick={() => handleNavigation("home")} className="text-foreground hover:text-primary transition-colors">בית</button>
            <button onClick={() => handleNavigation("courses")} className="text-foreground hover:text-primary transition-colors">קורסים</button>
            <button onClick={() => handleNavigation("contact")} className="text-foreground hover:text-primary transition-colors">צור קשר</button>
          </nav>

          {/* Mobile Menu Button - moved to left */}
          <button
            className="md:hidden p-2 h-24 flex items-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo Image - centered */}
          <button 
            onClick={() => navigate("/")}
            className="flex items-center justify-center h-24"
          >
            <img
              src={logo}
              alt="תכנותא - חוגי תכנות מקצועיים לילדים"
              className="h-16 md:h-20 w-auto object-contain"
            />
          </button>

          {/* Desktop Auth Button - moved to right */}
          <div className="hidden md:flex items-center h-24">
            <AuthButton />
          </div>

          {/* Empty div for mobile to maintain spacing */}
          <div className="md:hidden w-10 h-24"></div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-4">
              <button onClick={() => handleNavigation("home")} className="text-foreground hover:text-primary transition-colors text-right">בית</button>
              <button onClick={() => handleNavigation("courses")} className="text-foreground hover:text-primary transition-colors text-right">קורסים</button>
              <button onClick={() => handleNavigation("contact")} className="text-foreground hover:text-primary transition-colors text-right">צור קשר</button>
              <AuthButton />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
