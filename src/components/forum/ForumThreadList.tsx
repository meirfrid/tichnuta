import { useState } from 'react';
import { MessageSquare, Pin, Lock, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ForumThread, Profile } from './types';
import { ForumThreadDetail } from './ForumThreadDetail';
import { NewThreadForm } from './NewThreadForm';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

interface ForumThreadListProps {
  threads: ForumThread[];
  profiles: Record<string, Profile>;
  loading: boolean;
  lessonId: string;
  onCreateThread: (title: string, body: string) => Promise<ForumThread | null>;
  onFetchReplies: (threadId: string) => Promise<any[]>;
  onCreateReply: (threadId: string, body: string) => Promise<any | null>;
  onUpdateThread: (threadId: string, title: string, body: string) => Promise<boolean>;
  onDeleteThread: (threadId: string) => Promise<boolean>;
  onUpdateReply: (replyId: string, body: string) => Promise<boolean>;
  onDeleteReply: (replyId: string) => Promise<boolean>;
  onRefresh: () => void;
}

export function ForumThreadList({
  threads,
  profiles,
  loading,
  lessonId,
  onCreateThread,
  onFetchReplies,
  onCreateReply,
  onUpdateThread,
  onDeleteThread,
  onUpdateReply,
  onDeleteReply,
  onRefresh
}: ForumThreadListProps) {
  const { user } = useAuth();
  const [showNewThread, setShowNewThread] = useState(false);
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);

  const getAuthorName = (authorId: string) => {
    return profiles[authorId]?.display_name || 'משתמש אנונימי';
  };

  const getAuthorInitials = (authorId: string) => {
    const name = getAuthorName(authorId);
    return name.substring(0, 2);
  };

  const handleToggleThread = (threadId: string) => {
    setExpandedThreadId(prev => prev === threadId ? null : threadId);
  };

  if (loading) {
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

  return (
    <Card className="mt-8" dir="rtl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          דיון בשיעור
        </CardTitle>
        {user && (
          <Button
            onClick={() => setShowNewThread(!showNewThread)}
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            דיון חדש
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {showNewThread && (
          <NewThreadForm
            onSubmit={async (title, body) => {
              const result = await onCreateThread(title, body);
              if (result) setShowNewThread(false);
            }}
            onCancel={() => setShowNewThread(false)}
          />
        )}

        {threads.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">היו הראשונים לפתוח דיון בשיעור הזה!</p>
            <p className="text-sm mt-2">שאלו שאלות, שתפו תובנות או עזרו לאחרים</p>
          </div>
        ) : (
          <div className="space-y-3">
            {threads.map(thread => (
              <div key={thread.id} className="border rounded-lg overflow-hidden">
                <div
                  className="flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleToggleThread(thread.id)}
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={profiles[thread.author_id]?.avatar_url || undefined} />
                    <AvatarFallback>{getAuthorInitials(thread.author_id)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {thread.is_pinned && (
                        <Badge variant="secondary" className="gap-1">
                          <Pin className="h-3 w-3" />
                          נעוץ
                        </Badge>
                      )}
                      {thread.is_locked && (
                        <Badge variant="outline" className="gap-1">
                          <Lock className="h-3 w-3" />
                          נעול
                        </Badge>
                      )}
                      <h4 className="font-semibold truncate">{thread.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {thread.body}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{getAuthorName(thread.author_id)}</span>
                      <span>
                        {formatDistanceToNow(new Date(thread.created_at), {
                          addSuffix: true,
                          locale: he
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {thread.replies_count || 0} תגובות
                      </span>
                    </div>
                  </div>
                  
                  <div className="shrink-0">
                    {expandedThreadId === thread.id ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
                
                {expandedThreadId === thread.id && (
                  <ForumThreadDetail
                    thread={thread}
                    profiles={profiles}
                    currentUserId={user?.id}
                    onFetchReplies={onFetchReplies}
                    onCreateReply={onCreateReply}
                    onUpdateThread={onUpdateThread}
                    onDeleteThread={onDeleteThread}
                    onUpdateReply={onUpdateReply}
                    onDeleteReply={onDeleteReply}
                    onClose={() => setExpandedThreadId(null)}
                    onRefresh={onRefresh}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
