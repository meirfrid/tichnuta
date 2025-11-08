import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  useEffect(() => {
    // Update meta tags
    document.title = "מדיניות פרטיות – תכנותא";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "מדיניות הפרטיות של תכנותא: איזה מידע נאסף, למה, היכן נשמר, למי נמסר, וכיצד מבקשים מחיקה."
      );
    }

    const metaRobots = document.querySelector('meta[name="robots"]');
    if (metaRobots) {
      metaRobots.setAttribute("content", "index,follow");
    } else {
      const newMetaRobots = document.createElement("meta");
      newMetaRobots.name = "robots";
      newMetaRobots.content = "index,follow";
      document.head.appendChild(newMetaRobots);
    }
  }, []);

  const lastUpdated = "2025-01-08";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 md:py-16">
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              מדיניות פרטיות – תכנותא
            </h1>
            <p className="text-sm text-muted-foreground">
              עודכן לאחרונה: {new Date(lastUpdated).toLocaleDateString("he-IL", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
                1. כללי
              </h2>
              <p className="text-foreground/90 leading-relaxed">
                האפליקציה/האתר "תכנותא" (tichnuta.com) מפעיל שירותי לימוד וקורסים. מסמך זה מסביר איזה מידע אנו אוספים וכיצד אנו משתמשים בו.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
                2. איזה מידע נאסף
              </h2>
              <ul className="list-disc list-inside space-y-3 text-foreground/90 leading-relaxed mr-4">
                <li>פרטי זיהוי בסיסיים בעת התחברות עם Google (שם, כתובת אימייל, תמונת פרופיל אם קיימת).</li>
                <li>נתוני הרשמה לקורסים והתקדמות לימודית (אם רלוונטי).</li>
                <li>Cookies הכרחיים לתפקוד המערכת (Session).</li>
                <li>אין שימוש בעוגיות פרסום ואין שיתוף נתוני פרופיל לצרכי שיווק מצד שלישי.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
                3. שימוש במידע
              </h2>
              <ul className="list-disc list-inside space-y-3 text-foreground/90 leading-relaxed mr-4">
                <li>לאימות משתמשים (Google OAuth).</li>
                <li>לניהול חשבון, הרשאות לקורסים והצגת תכנים שרכשת/אליהם נרשמת.</li>
                <li>לשיפור חוויית שימוש ותמיכה טכנית.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
                4. שיתוף מידע
              </h2>
              <ul className="list-disc list-inside space-y-3 text-foreground/90 leading-relaxed mr-4">
                <li>לא משתפים מידע אישי עם צדדים שלישיים, למעט ספקי תשתית הנדרשים להפעלת השירות (למשל: Supabase לאחסון ול־Auth).</li>
                <li>אין מכירת מידע ואין פרסום מבוסס פרופיל.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
                5. אחסון ואבטחה
              </h2>
              <ul className="list-disc list-inside space-y-3 text-foreground/90 leading-relaxed mr-4">
                <li>המידע נשמר בספקי ענן מאובטחים (למשל Supabase).</li>
                <li>אנו מיישמים אמצעי הגנה מקובלים; יחד עם זאת, לא ניתן להבטיח אבטחה מוחלטת.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
                6. Google OAuth
              </h2>
              <p className="text-foreground/90 leading-relaxed">
                השירות עושה שימוש ב-Google Authentication בהתאם למדיניות Google. השימוש מוגבל לאימות ולזיהוי המשתמש בלבד.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
                7. שמירת מידע ומחיקה
              </h2>
              <p className="text-foreground/90 leading-relaxed mb-3">
                באפשרותך לבקש מחיקה/עדכון של המידע האישי. פנה אלינו ונפעל בהתאם לדין.
              </p>
              <p className="text-foreground/90 leading-relaxed">
                דוא״ל לתמיכה: <a href="mailto:meirfrid650@gmail.com" className="text-primary hover:underline">meirfrid650@gmail.com</a>
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
                8. משתמשים קטינים
              </h2>
              <p className="text-foreground/90 leading-relaxed">
                השירות מיועד לתלמידים בליווי הורה/אפוטרופוס כאשר נדרש לפי דין. אם נודע לנו שנאסף מידע של קטין ללא אישור מתאים, נפעל למחיקתו. לפניות: <a href="mailto:meirfrid650@gmail.com" className="text-primary hover:underline">meirfrid650@gmail.com</a>.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
                9. עוגיות (Cookies)
              </h2>
              <p className="text-foreground/90 leading-relaxed">
                משמשות לתפקוד בסיסי (Session). אין עוגיות פרסום. ניתן לחסום Cookies בדפדפן – ייתכן שחלק מהפונקציות לא יעבדו.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
                10. שינויים במדיניות
              </h2>
              <p className="text-foreground/90 leading-relaxed">
                נעדכן את המסמך לפי הצורך. תאריך "עודכן לאחרונה" מופיע בראש העמוד.
              </p>
            </section>
          </div>

          {/* Footer Credit */}
          <footer className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© תכנותא</p>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
