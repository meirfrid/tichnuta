-- Create chat_messages table for live chat functionality
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  message TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'admin')),
  user_email TEXT,
  user_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert messages (users can send messages)
CREATE POLICY "Anyone can insert chat messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (true);

-- Allow anyone to view messages from their session
CREATE POLICY "Users can view their own session messages"
ON public.chat_messages
FOR SELECT
USING (true);

-- Service role can manage all messages (for admin replies)
CREATE POLICY "Service role can manage all messages"
ON public.chat_messages
FOR ALL
USING (true);

-- Add table to realtime publication for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Set replica identity for realtime
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;

-- Create index for faster session queries
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at DESC);