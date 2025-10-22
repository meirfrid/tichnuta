import { useState, useEffect } from 'react';

export interface SiteContent {
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroButtonText: string;

  // About Section
  aboutTitle: string;
  aboutDescription1: string;
  aboutDescription2: string;
  aboutDescription3: string;
  missionTitle: string;
  missionDescription: string;

  // Statistics
  studentsCount: string;
  experienceYears: string;
  satisfactionRate: string;

  // Values
  values: Array<{
    title: string;
    description: string;
  }>;

  // Courses Section
  coursesTitle: string;
  coursesSubtitle: string;

  // Contact Section
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;

  // Footer
  footerDescription: string;
}

const defaultContent: SiteContent = {
  heroTitle: "העתיד מתחיל כאן",
  heroSubtitle: "חוגי תכנות חווייתיים לילדים חרדים",
  heroDescription: "הילדים בונים משחקים, יוצרים אפליקציות ולומדים לחשוב כמו מהנדסים - בסביבה מקצועית, ערכית ומהנה.",
  heroButtonText: "גלה את הקורסים שלנו",

  aboutTitle: "אוות תכנותא",
  aboutDescription1: "תכנותא היא מובילה בחינוך טכנולוגי לילדים מהמגזר החרדי. אנחנו מאמינים שכל ילד יכול ללמוד תכנות ולהצליח בעולם הטכנולוגיה, תוך שמירה על הערכים והמסורת שלנו.",
  aboutDescription2: "הקורסים שלנו מעוצבים במיוחד כדי להתאים לילדים חרדים, עם תכנים מותאמים ופדגוגיה שמתחשבת בצרכים הייחודיים של הקהילה. אנחנו גאים במאות הילדים שעברו דרכנו וממשיכים ללימודים גבוהים בתחום.",
  aboutDescription3: "המטרה שלנו היא לפתח את הדור הבא של מתכנתים ומפתחים מהמגזר החרדי, ולתת להם את הכלים הנדרשים להצלחה בעולם הטכנולוגיה המודרני.",
  missionTitle: "המשימה שלנו",
  missionDescription: "להכשיר את הדור הבא של מתכנתים ומפתחים מהמגזר החרדי, תוך שמירה על הזהות והערכים היהודיים, ולאפשר להם להשתלב בהצלחה בעולם הטכנולוגיה המתפתח.",

  studentsCount: "200+",
  experienceYears: "5",
  satisfactionRate: "95%",

  values: [
    {
      title: "חינוך ערכי",
      description: "לימוד תכנות בסביבה מותאמת לילדים חרדים עם דגש על ערכים יהודיים"
    },
    {
      title: "איכות מקצועית",
      description: "מורים מקצועיים ומנוסים עם תוכניות לימוד מתקדמות ומותאמות"
    },
    {
      title: "קבוצות קטנות",
      description: "למידה אישית וממוקדת בקבוצות קטנות למקסימום התקדמות"
    },
    {
      title: "הוכחת הצלחה",
      description: "תלמידים שלנו ממשיכים ללימודי הנדסה ומחשבים ברמה גבוהה"
    }
  ],

  coursesTitle: "הקורסים שלנו",
  coursesSubtitle: "קורסי תכנות מותאמים לכל גיל ורמה, עם דגש על למידה מהנה ויעילה",

  contactPhone: "053-271-2650",
  contactEmail: "info@tichnuta.com",
  contactAddress: "רחוב לוחמי הגטו 32 פתח תקווה",

  footerDescription: "תכנותא - חוגי תכנות מקצועיים לילדים חרדים"
};

export const useSiteContent = () => {
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultContent);

  // Load content from localStorage on mount
  useEffect(() => {
    const savedContent = localStorage.getItem('siteContent');
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent);
        setSiteContent({ ...defaultContent, ...parsedContent });
      } catch (error) {
        console.error('Error loading site content:', error);
      }
    }
  }, []);

  // Save content to localStorage
  const saveSiteContent = (newContent: Partial<SiteContent>) => {
    const updatedContent = { ...siteContent, ...newContent };
    setSiteContent(updatedContent);
    localStorage.setItem('siteContent', JSON.stringify(updatedContent));
    return true;
  };

  // Reset to default content
  const resetToDefault = () => {
    setSiteContent(defaultContent);
    localStorage.removeItem('siteContent');
  };

  return {
    siteContent,
    setSiteContent,
    saveSiteContent,
    resetToDefault
  };
};