import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, RefreshCw, Edit, Trash2 } from 'lucide-react';

interface SchoolsManagementProps {
  schools: any[];
  showNewSchoolForm: boolean;
  schoolForm: {
    name: string;
    description: string;
    icon: string;
    color: string;
  };
  editingSchool: any;
  setShowNewSchoolForm: (show: boolean) => void;
  setSchoolForm: (form: any) => void;
  setEditingSchool: (school: any) => void;
  fetchSchools: () => void;
  saveSchool: () => void;
  editSchool: (school: any) => void;
  deleteSchool: (schoolId: string) => void;
}

const SchoolsManagement = ({
  schools,
  showNewSchoolForm,
  schoolForm,
  editingSchool,
  setShowNewSchoolForm,
  setSchoolForm,
  setEditingSchool,
  fetchSchools,
  saveSchool,
  editSchool,
  deleteSchool
}: SchoolsManagementProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>ניהול תלמודי תורה</CardTitle>
            <CardDescription>
              ערוך תלמודי תורה קיימים או הוסף חדשים ({schools.length} תלמודי תורה)
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchSchools} variant="outline">
              <RefreshCw className="h-4 w-4 ml-2" />
              רענן
            </Button>
            <Button onClick={() => {
              setShowNewSchoolForm(true);
              setEditingSchool(null);
              setSchoolForm({
                name: '',
                description: '',
                icon: 'GraduationCap',
                color: 'bg-gradient-to-br from-blue-500 to-blue-600'
              });
            }}>
              <Plus className="h-4 w-4 ml-2" />
              הוסף תלמוד תורה חדש
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showNewSchoolForm ? (
          <div className="space-y-6 p-6 border rounded-lg bg-muted/30">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {editingSchool ? 'עריכת תלמוד תורה' : 'הוספת תלמוד תורה חדש'}
              </h3>
              <Button variant="outline" onClick={() => {
                setShowNewSchoolForm(false);
                setEditingSchool(null);
              }}>
                ביטול
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schoolName">שם תלמוד התורה</Label>
                <Input
                  id="schoolName"
                  value={schoolForm.name}
                  onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                  placeholder="למשל: תלמוד תורה שארית ישראל"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="schoolDescription">תיאור (אופציונלי)</Label>
                <Textarea
                  id="schoolDescription"
                  value={schoolForm.description}
                  onChange={(e) => setSchoolForm({ ...schoolForm, description: e.target.value })}
                  placeholder="תיאור קצר על תלמוד התורה..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="schoolIcon">אייקון</Label>
                <Input
                  id="schoolIcon"
                  value={schoolForm.icon}
                  onChange={(e) => setSchoolForm({ ...schoolForm, icon: e.target.value })}
                  placeholder="GraduationCap, School"
                />
              </div>

              <div>
                <Label htmlFor="schoolColor">צבע (Tailwind class)</Label>
                <Input
                  id="schoolColor"
                  value={schoolForm.color}
                  onChange={(e) => setSchoolForm({ ...schoolForm, color: e.target.value })}
                  placeholder="bg-gradient-to-br from-blue-500 to-blue-600"
                />
              </div>
            </div>

            <Button onClick={saveSchool} className="w-full">
              {editingSchool ? 'עדכן תלמוד תורה' : 'הוסף תלמוד תורה'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {schools.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                אין תלמודי תורה בינתיים. לחץ על "הוסף תלמוד תורה חדש" כדי להוסיף.
              </p>
            ) : (
              schools.map((school) => (
                <div key={school.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{school.name}</h4>
                      {school.description && (
                        <p className="text-muted-foreground text-sm mb-2">{school.description}</p>
                      )}
                      <div className="flex gap-2 text-sm text-muted-foreground">
                        <span>אייקון: {school.icon}</span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded ${school.color} text-white`}>
                          צבע
                        </span>
                        <span>•</span>
                        <span>{school.active ? 'פעיל' : 'מושבת'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editSchool(school)}
                      >
                        <Edit className="h-4 w-4 ml-1" />
                        ערוך
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteSchool(school.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 ml-1" />
                        מחק
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SchoolsManagement;
