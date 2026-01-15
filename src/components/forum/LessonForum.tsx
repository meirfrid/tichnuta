import { useForumData } from './useForumData';
import { ForumThreadList } from './ForumThreadList';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface LessonForumProps {
  lessonId: string;
}

export function LessonForum({ lessonId }: LessonForumProps) {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const {
    threads,
    loading,
    profiles,
    fetchThreads,
    fetchReplies,
    createThread,
    createReply,
    updateThread,
    deleteThread,
    updateReply,
    deleteReply
  } = useForumData(lessonId);

  if (authLoading) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            דיון בשיעור
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="mt-8" dir="rtl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            דיון בשיעור
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <LogIn className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">
              עליכם להתחבר כדי להשתתף בדיון
            </p>
            <Button onClick={() => navigate('/auth')}>
              התחברות
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ForumThreadList
      threads={threads}
      profiles={profiles}
      loading={loading}
      lessonId={lessonId}
      onCreateThread={createThread}
      onFetchReplies={fetchReplies}
      onCreateReply={createReply}
      onUpdateThread={updateThread}
      onDeleteThread={deleteThread}
      onUpdateReply={updateReply}
      onDeleteReply={deleteReply}
      onRefresh={fetchThreads}
    />
  );
}
