import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Phone, MessageSquare } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  message: string | null;
  status: string;
  created_at: string;
}

const ContactsList = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setContacts(data || []);
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לטעון את רשימת יצירות הקשר",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            יצירות קשר
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          יצירות קשר ({contacts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {contacts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            אין יצירות קשר עדיין
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>שם</TableHead>
                  <TableHead>אימייל</TableHead>
                  <TableHead>טלפון</TableHead>
                  <TableHead>קורס</TableHead>
                  <TableHead>הודעה</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>תאריך</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={`mailto:${contact.email}`}
                          className="text-primary hover:underline"
                        >
                          {contact.email}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={`tel:${contact.phone}`}
                          className="text-primary hover:underline"
                        >
                          {contact.phone}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>{contact.course}</TableCell>
                    <TableCell className="max-w-[200px]">
                      {contact.message ? (
                        <div className="truncate" title={contact.message}>
                          {contact.message}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">אין הודעה</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(contact.status)}>
                        {contact.status === 'new' ? 'חדש' : 
                         contact.status === 'contacted' ? 'טופל' : 
                         contact.status === 'closed' ? 'סגור' : contact.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(contact.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactsList;