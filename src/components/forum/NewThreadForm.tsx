import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface NewThreadFormProps {
  onSubmit: (title: string, body: string) => Promise<void>;
  onCancel: () => void;
}

export function NewThreadForm({ onSubmit, onCancel }: NewThreadFormProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});

  const validate = () => {
    const newErrors: { title?: string; body?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'נא להזין כותרת';
    } else if (title.length > 200) {
      newErrors.title = 'הכותרת ארוכה מדי (מקסימום 200 תווים)';
    }
    
    if (!body.trim()) {
      newErrors.body = 'נא להזין תוכן';
    } else if (body.length > 5000) {
      newErrors.body = 'התוכן ארוך מדי (מקסימום 5000 תווים)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setSubmitting(true);
    await onSubmit(title.trim(), body.trim());
    setSubmitting(false);
  };

  return (
    <Card className="border-primary/50">
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="thread-title">כותרת הדיון</Label>
            <Input
              id="thread-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="מה נושא הדיון?"
              maxLength={200}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="thread-body">תוכן</Label>
            <Textarea
              id="thread-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="פרטו את השאלה או הנושא שלכם..."
              className={`min-h-[120px] ${errors.body ? 'border-destructive' : ''}`}
              maxLength={5000}
            />
            {errors.body && (
              <p className="text-sm text-destructive">{errors.body}</p>
            )}
            <p className="text-xs text-muted-foreground text-left">
              {body.length}/5000
            </p>
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={submitting}
            >
              ביטול
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'שולח...' : 'פרסם דיון'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
