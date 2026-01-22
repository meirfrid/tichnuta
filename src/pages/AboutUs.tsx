
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Heart, Target, GraduationCap, Users, Code, Brain } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-bl from-primary/10 via-background to-secondary/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              מי אנחנו
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              מיזם חברתי שמביא את עולם התכנות לילדי הקהילה החרדית
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">המיזם שלנו</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  תכנותא הוא מיזם חברתי ייחודי שנולד מתוך הבנה עמוקה שילדים חרדים ראויים לקבל השכלה טכנולוגית איכותית בסביבה המותאמת להם.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  אנו מאמינים שכל ילד יכול ללמוד לתכנת, ושהכישורים הללו יפתחו בפניו דלתות לעתיד מוצלח. המיזם שלנו מציע חוגי תכנות מקצועיים, עם הפרדה מלאה בין בנים לבנות, ובהנחיית מדריכים מהקהילה שמבינים את הערכים והצרכים הייחודיים של המשפחות שלנו.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  הקורסים שלנו מותאמים לגילאים שונים ולרמות שונות, ומלמדים תכנות דרך משחק ויצירה - כך שהלמידה הופכת לחוויה מהנה ומעשירה.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-xl p-6 text-center shadow-sm">
                  <Target className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-bold text-foreground mb-2">מטרה ברורה</h3>
                  <p className="text-sm text-muted-foreground">להנגיש תכנות לכל ילד</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 text-center shadow-sm">
                  <Users className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-bold text-foreground mb-2">קהילה</h3>
                  <p className="text-sm text-muted-foreground">מדריכים מהקהילה שלנו</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 text-center shadow-sm">
                  <Code className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-bold text-foreground mb-2">מקצועיות</h3>
                  <p className="text-sm text-muted-foreground">תכנים מותאמים ועדכניים</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 text-center shadow-sm">
                  <Brain className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-bold text-foreground mb-2">חשיבה</h3>
                  <p className="text-sm text-muted-foreground">פיתוח חשיבה לוגית</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">הכירו את היזם</h2>
              <p className="text-lg text-muted-foreground">האדם מאחורי החזון</p>
            </div>
            
            <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-lg">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl bg-muted flex items-center justify-center">
                    <Users className="w-24 h-24 text-muted-foreground/50" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-right">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">מאיר פריד</h3>
                  <p className="text-primary font-medium text-lg mb-4">מייסד תכנותא</p>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                    <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      תואר בפסיכולוגיה
                    </span>
                    <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      תואר במדעי המחשב
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                    מאיר פריד הוא בעל תואר כפול בפסיכולוגיה ובמדעי המחשב, שילוב ייחודי שמאפשר לו להבין הן את הצד הטכנולוגי והן את הצד החינוכי-פסיכולוגי של הוראת תכנות לילדים.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    מתוך אהבה לקהילה ורצון לתת לילדים כלים לעתיד, הקים מאיר את תכנותא - מיזם שמשלב מקצועיות טכנולוגית עם הבנה עמוקה של הקהילה החרדית וצרכיה.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">הערכים שמנחים אותנו</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-8 border border-border">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">התאמה לקהילה</h3>
                <p className="text-muted-foreground">
                  כל הפעילות מותאמת לערכי הקהילה החרדית, עם הפרדה מלאה ותכנים מסוננים
                </p>
              </div>
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-8 border border-border">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">מצוינות מקצועית</h3>
                <p className="text-muted-foreground">
                  הוראה ברמה הגבוהה ביותר עם תכנים עדכניים ומקצועיים
                </p>
              </div>
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-8 border border-border">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">נגישות לכולם</h3>
                <p className="text-muted-foreground">
                  מחירים הוגנים ונגישים כדי שכל ילד יוכל ללמוד תכנות
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
