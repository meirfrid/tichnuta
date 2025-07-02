import { Button } from "@/components/ui/button";
import { Code2, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Code2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">תכנותא</h1>
              <p className="text-sm text-muted-foreground">חוגי תכנות לילדים</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">בית</a>
            <a href="#courses" className="text-foreground hover:text-primary transition-colors">קורסים</a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">אודות</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">צור קשר</a>
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:block">
            <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
              הרשמה לקורס
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-4">
              <a href="#home" className="text-foreground hover:text-primary transition-colors">בית</a>
              <a href="#courses" className="text-foreground hover:text-primary transition-colors">קורסים</a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">אודות</a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">צור קשר</a>
              <Button className="bg-gradient-primary hover:opacity-90 transition-opacity w-full">
                הרשמה לקורס
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;