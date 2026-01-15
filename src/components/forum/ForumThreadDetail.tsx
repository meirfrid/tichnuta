import { useState, useEffect } from 'react';
import { Edit2, Trash2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ForumThread, ForumReply, Profile } from './types';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ForumThreadDetailProps {
  thread: ForumThread;
  profiles: Record<string, Profile>;
  currentUserId?: string;
  onFetchReplies: (threadId: string) => Promise<ForumReply[]>;
  onCreateReply: (threadId: string, body: string) => Promise<ForumReply | null>;
  onUpdateThread: (threadId: string, title: string, body: string) => Promise<boolean>;
  onDeleteThread: (threadId: string) => Promise<boolean>;
  onUpdateReply: (replyId: string, body: string) => Promise<boolean>;
  onDeleteReply: (replyId: string) => Promise<boolean>;
  onClose: () => void;
  onRefresh: () => void;
}

export function ForumThreadDetail({
  thread,
  profiles,
  currentUserId,
  onFetchReplies,
  onCreateReply,
  onUpdateThread,
  onDeleteThread,
  onUpdateReply,
  onDeleteReply,
  onClose,
  onRefresh
}: ForumThreadDetailProps) {
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReply, setNewReply] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyText, setEditReplyText] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'thread' | 'reply'; id: string } | null>(null);

  const isAuthor = currentUserId === thread.author_id;

  const getAuthorName = (authorId: string) => {
    return profiles[authorId]?.display_name || 'משתמש אנונימי';
  };

  const getAuthorInitials = (authorId: string) => {
    const name = getAuthorName(authorId);
    return name.substring(0, 2);
  };

  useEffect(() => {
    const loadReplies = async () => {
      setLoading(true);
      const data = await onFetchReplies(thread.id);
      setReplies(data);
      setLoading(false);
    };
    loadReplies();
  }, [thread.id, onFetchReplies]);

  const handleSubmitReply = async () => {
    if (!newReply.trim() || submitting) return;
    
    setSubmitting(true);
    const result = await onCreateReply(thread.id, newReply.trim());
    if (result) {
      setNewReply('');
      const updatedReplies = await onFetchReplies(thread.id);
      setReplies(updatedReplies);
      onRefresh();
    }
    setSubmitting(false);
  };

  const handleEditReply = async (replyId: string) => {
    if (!editReplyText.trim()) return;
    
    const success = await onUpdateReply(replyId, editReplyText.trim());
    if (success) {
      setEditingReplyId(null);
      const updatedReplies = await onFetchReplies(thread.id);
      setReplies(updatedReplies);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    
    if (deleteTarget.type === 'thread') {
      const success = await onDeleteThread(deleteTarget.id);
      if (success) onClose();
    } else {
      const success = await onDeleteReply(deleteTarget.id);
      if (success) {
        const updatedReplies = await onFetchReplies(thread.id);
        setReplies(updatedReplies);
        onRefresh();
      }
    }
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  return (
    <div className="border-t bg-muted/30 p-4 space-y-4">
      {/* Thread Actions */}
      {isAuthor && (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDeleteTarget({ type: 'thread', id: thread.id });
              setDeleteDialogOpen(true);
            }}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Replies */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : replies.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            אין תגובות עדיין. היו הראשונים להגיב!
          </p>
        ) : (
          replies.map(reply => (
            <div key={reply.id} className="flex gap-3 bg-background rounded-lg p-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={profiles[reply.author_id]?.avatar_url || undefined} />
                <AvatarFallback className="text-xs">{getAuthorInitials(reply.author_id)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{getAuthorName(reply.author_id)}</span>
                    <span className="text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(reply.created_at), {
                        addSuffix: true,
                        locale: he
                      })}
                    </span>
                  </div>
                  
                  {currentUserId === reply.author_id && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          setEditingReplyId(reply.id);
                          setEditReplyText(reply.body);
                        }}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={() => {
                          setDeleteTarget({ type: 'reply', id: reply.id });
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {editingReplyId === reply.id ? (
                  <div className="mt-2 space-y-2">
                    <Textarea
                      value={editReplyText}
                      onChange={(e) => setEditReplyText(e.target.value)}
                      className="min-h-[60px]"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleEditReply(reply.id)}>
                        שמור
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingReplyId(null)}
                      >
                        ביטול
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm mt-1 whitespace-pre-wrap">{reply.body}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Reply Form */}
      {currentUserId && !thread.is_locked && (
        <div className="flex gap-3 pt-3 border-t">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={profiles[currentUserId]?.avatar_url || undefined} />
            <AvatarFallback className="text-xs">
              {profiles[currentUserId]?.display_name?.substring(0, 2) || '??'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            <Textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="כתבו תגובה..."
              className="min-h-[60px] flex-1"
              maxLength={2000}
            />
            <Button
              onClick={handleSubmitReply}
              disabled={!newReply.trim() || submitting}
              size="icon"
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {thread.is_locked && (
        <p className="text-sm text-muted-foreground text-center py-2">
          הדיון נעול ולא ניתן להוסיף תגובות
        </p>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteTarget?.type === 'thread' ? 'מחיקת דיון' : 'מחיקת תגובה'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.type === 'thread'
                ? 'האם אתם בטוחים שברצונכם למחוק את הדיון? כל התגובות יימחקו גם כן.'
                : 'האם אתם בטוחים שברצונכם למחוק את התגובה?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              מחק
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
