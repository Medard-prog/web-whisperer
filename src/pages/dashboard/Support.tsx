import React, { useState, useEffect } from 'react';
import { fetchSupportMessages, sendSupportMessage } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface SupportMessage {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  is_from_user: boolean;
  is_read?: boolean;
}

const Support = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadMessages = async () => {
      if (user?.id) {
        setLoading(true);
        try {
          const data = await fetchSupportMessages(user.id);
          setMessages(data);
        } catch (error) {
          console.error('Error loading support messages:', error);
          toast.error('Could not load support messages');
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadMessages();
  }, [user?.id]);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user?.id) return;
    
    try {
      const sentMessage = await sendSupportMessage(user.id, newMessage);
      if (sentMessage) {
        setMessages(prev => [sentMessage, ...prev]);
        setNewMessage('');
        
        // Mock response from support agent (for demo purposes)
        setTimeout(() => {
          const mockResponse = {
            id: `mock-${Date.now()}`,
            user_id: user.id,
            content: 'Thank you for your message. Our team will get back to you shortly.',
            created_at: new Date().toISOString(),
            is_from_user: false,
            is_read: false
          };
          setMessages(prev => [mockResponse, ...prev]);
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Support</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Get help with your projects or account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="min-h-[120px]"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="self-end"
                >
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Message History</h2>
            {loading ? (
              <div className="flex justify-center my-8">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map(message => (
                  <Card key={message.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage 
                            src={user?.profile?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name || 'User'}`} 
                            alt="Profile picture" 
                          />
                          <AvatarFallback>{message.is_from_user ? user?.email?.charAt(0).toUpperCase() || 'U' : 'S'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <p className="font-medium">{message.is_from_user ? 'You' : 'Support Agent'}</p>
                            <span className="text-xs text-gray-500">{formatDate(message.created_at)}</span>
                          </div>
                          <p className="text-gray-700">{message.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-6 text-center text-gray-500">
                  No messages yet. Start a conversation with our support team!
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>FAQs</CardTitle>
              <CardDescription>
                Commonly asked questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">How long does it take to complete a project?</h3>
                  <p className="text-sm text-gray-600 mt-1">Project timelines vary depending on complexity and requirements, typically ranging from 2-12 weeks.</p>
                </div>
                <div>
                  <h3 className="font-medium">Do you offer ongoing maintenance?</h3>
                  <p className="text-sm text-gray-600 mt-1">Yes, we offer monthly maintenance packages to keep your site secure and up-to-date.</p>
                </div>
                <div>
                  <h3 className="font-medium">What payment methods do you accept?</h3>
                  <p className="text-sm text-gray-600 mt-1">We accept credit/debit cards, bank transfers, and PayPal.</p>
                </div>
                <div>
                  <h3 className="font-medium">How do I request changes to my project?</h3>
                  <p className="text-sm text-gray-600 mt-1">You can request changes through the project chat or by contacting support directly.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><span className="font-medium">Phone:</span> +40 123 456 789</p>
                <p><span className="font-medium">Email:</span> support@website-builder.ro</p>
                <p><span className="font-medium">Hours:</span> Mon-Fri, 9:00 - 18:00</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;
