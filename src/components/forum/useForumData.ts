import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ForumThread, ForumReply, Profile } from './types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useForumData(lessonId: string | undefined) {
  const { user } = useAuth();
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});

  const fetchProfiles = useCallback(async (authorIds: string[]) => {
    if (authorIds.length === 0) return;
    
    const uniqueIds = [...new Set(authorIds)];
    const { data } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url')
      .in('id', uniqueIds);
    
    if (data) {
      const profileMap: Record<string, Profile> = {};
      data.forEach((p: Profile) => {
        profileMap[p.id] = p;
      });
      setProfiles(prev => ({ ...prev, ...profileMap }));
    }
  }, []);

  const fetchThreads = useCallback(async () => {
    if (!lessonId) return;
    
    setLoading(true);
    try {
      const { data: threadsData, error } = await supabase
        .from('lesson_forum_threads')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (threadsData && threadsData.length > 0) {
        // Fetch reply counts
        const threadIds = threadsData.map(t => t.id);
        const { data: repliesData } = await supabase
          .from('lesson_forum_replies')
          .select('thread_id')
          .in('thread_id', threadIds);

        const replyCounts: Record<string, number> = {};
        repliesData?.forEach(r => {
          replyCounts[r.thread_id] = (replyCounts[r.thread_id] || 0) + 1;
        });

        const threadsWithCounts = threadsData.map(t => ({
          ...t,
          replies_count: replyCounts[t.id] || 0
        }));

        setThreads(threadsWithCounts);
        await fetchProfiles(threadsData.map(t => t.author_id));
      } else {
        setThreads([]);
      }
    } catch (error) {
      console.error('Error fetching threads:', error);
      toast.error('שגיאה בטעינת הדיונים');
    } finally {
      setLoading(false);
    }
  }, [lessonId, fetchProfiles]);

  const fetchReplies = useCallback(async (threadId: string): Promise<ForumReply[]> => {
    const { data, error } = await supabase
      .from('lesson_forum_replies')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching replies:', error);
      return [];
    }

    if (data && data.length > 0) {
      await fetchProfiles(data.map(r => r.author_id));
    }

    return data || [];
  }, [fetchProfiles]);

  const createThread = useCallback(async (title: string, body: string) => {
    if (!user || !lessonId) return null;

    const { data, error } = await supabase
      .from('lesson_forum_threads')
      .insert({
        lesson_id: lessonId,
        author_id: user.id,
        title,
        body
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating thread:', error);
      toast.error('שגיאה ביצירת דיון חדש');
      return null;
    }

    toast.success('הדיון נוצר בהצלחה');
    await fetchThreads();
    return data;
  }, [user, lessonId, fetchThreads]);

  const createReply = useCallback(async (threadId: string, body: string) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('lesson_forum_replies')
      .insert({
        thread_id: threadId,
        author_id: user.id,
        body
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating reply:', error);
      toast.error('שגיאה בשליחת התגובה');
      return null;
    }

    toast.success('התגובה נשלחה');
    return data;
  }, [user]);

  const updateThread = useCallback(async (threadId: string, title: string, body: string) => {
    const { error } = await supabase
      .from('lesson_forum_threads')
      .update({ title, body })
      .eq('id', threadId);

    if (error) {
      console.error('Error updating thread:', error);
      toast.error('שגיאה בעדכון הדיון');
      return false;
    }

    toast.success('הדיון עודכן');
    await fetchThreads();
    return true;
  }, [fetchThreads]);

  const deleteThread = useCallback(async (threadId: string) => {
    const { error } = await supabase
      .from('lesson_forum_threads')
      .delete()
      .eq('id', threadId);

    if (error) {
      console.error('Error deleting thread:', error);
      toast.error('שגיאה במחיקת הדיון');
      return false;
    }

    toast.success('הדיון נמחק');
    await fetchThreads();
    return true;
  }, [fetchThreads]);

  const updateReply = useCallback(async (replyId: string, body: string) => {
    const { error } = await supabase
      .from('lesson_forum_replies')
      .update({ body })
      .eq('id', replyId);

    if (error) {
      console.error('Error updating reply:', error);
      toast.error('שגיאה בעדכון התגובה');
      return false;
    }

    toast.success('התגובה עודכנה');
    return true;
  }, []);

  const deleteReply = useCallback(async (replyId: string) => {
    const { error } = await supabase
      .from('lesson_forum_replies')
      .delete()
      .eq('id', replyId);

    if (error) {
      console.error('Error deleting reply:', error);
      toast.error('שגיאה במחיקת התגובה');
      return false;
    }

    toast.success('התגובה נמחקה');
    return true;
  }, []);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  return {
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
  };
}
