import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { ArrowRight, Send, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Message {
  id: string;
  session_id: string;
  message: string;
  sender_type: "user" | "admin";
  created_at: string;
  user_name: string | null;
  user_email: string | null;
}

interface ChatSession {
  session_id: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

const AdminChat = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load all chat sessions
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading sessions:", error);
      return;
    }

    // Group messages by session_id
    const sessionMap = new Map<string, ChatSession>();
    data?.forEach((msg) => {
      if (!sessionMap.has(msg.session_id)) {
        sessionMap.set(msg.session_id, {
          session_id: msg.session_id,
          last_message: msg.message,
          last_message_time: msg.created_at,
          unread_count: msg.sender_type === "user" ? 1 : 0,
        });
      }
    });

    setSessions(Array.from(sessionMap.values()));
  };

  // Load messages for selected session
  useEffect(() => {
    if (!selectedSession) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", selectedSession)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading messages:", error);
        return;
      }

      setMessages((data || []) as Message[]);
    };

    loadMessages();
  }, [selectedSession]);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel("admin_chat_channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        (payload) => {
          const newMsg = payload.new as Message;
          
          // Update sessions list
          loadSessions();

          // If the message is for the selected session, add it
          if (selectedSession && newMsg.session_id === selectedSession) {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedSession]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedSession || isLoading) return;

    setIsLoading(true);
    const messageText = newMessage.trim();
    setNewMessage("");

    const { error } = await supabase.from("chat_messages").insert({
      session_id: selectedSession,
      message: messageText,
      sender_type: "admin",
    });

    if (error) {
      console.error("Error sending message:", error);
      toast({
        title: "שגיאה",
        description: "לא הצלחנו לשלוח את ההודעה. נסה שוב.",
        variant: "destructive",
      });
      setNewMessage(messageText);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">ניהול צ׳אט</h1>
          <Button variant="outline" onClick={() => navigate("/admin")}>
            <ArrowRight className="ml-2 h-4 w-4" />
            חזרה לניהול
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Sessions List */}
          <Card className="p-4 lg:col-span-1">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              שיחות
            </h2>
            <ScrollArea className="h-[calc(100%-60px)]">
              <div className="space-y-2">
                {sessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    אין שיחות פעילות
                  </p>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.session_id}
                      onClick={() => setSelectedSession(session.session_id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedSession === session.session_id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <p className="font-medium text-sm mb-1">
                        {session.session_id.substring(0, 20)}...
                      </p>
                      <p className="text-xs opacity-70 truncate">
                        {session.last_message}
                      </p>
                      <p className="text-xs opacity-60 mt-1">
                        {format(new Date(session.last_message_time), "dd/MM/yyyy HH:mm")}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>

          {/* Chat Area */}
          <Card className="p-4 lg:col-span-2 flex flex-col">
            {!selectedSession ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                בחר שיחה כדי להתחיל
              </div>
            ) : (
              <>
                <ScrollArea className="flex-1 mb-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender_type === "admin" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.sender_type === "admin"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.sender_type === "admin"
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {format(new Date(msg.created_at), "HH:mm")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <form onSubmit={handleSendMessage} className="border-t pt-4">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="הקלד תשובה..."
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
