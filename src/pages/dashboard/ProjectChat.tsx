
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProjectMessages, sendProjectMessage } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Message } from '@/types';

export default function ProjectChat() {
  const { id } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const loadMessages = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const projectMessages = await fetchProjectMessages(id);
        setMessages(projectMessages);
      } catch (error) {
        console.error('Failed to load messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    
    loadMessages();
  }, [id]);
  
  const handleSendMessage = async () => {
    if (!message.trim() || !id || !user) return;
    
    try {
      await sendProjectMessage(
        id,
        message,
        user.id,
        user.isAdmin || false
      );
      
      // Refresh messages
      const updatedMessages = await fetchProjectMessages(id);
      setMessages(updatedMessages);
      
      // Clear input
      setMessage('');
      toast.success('Message sent');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Project Chat</h1>
      <p className="mb-4 text-gray-600">Project ID: {id}</p>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto p-2">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`p-3 rounded-lg ${
                  msg.userId === user?.id 
                    ? 'bg-blue-100 ml-10 text-right' 
                    : 'bg-gray-100 mr-10'
                }`}
              >
                <p className="text-sm text-gray-600 mb-1">
                  {msg.isAdmin ? 'Admin' : 'Client'} - {new Date(msg.createdAt).toLocaleString()}
                </p>
                <p>{msg.content}</p>
                {msg.attachmentUrl && (
                  <div className="mt-2">
                    <a 
                      href={msg.attachmentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View Attachment
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4">
        <textarea 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Type your message here..."
          rows={4}
        />
        <div className="flex justify-end mt-3">
          <button 
            onClick={handleSendMessage}
            disabled={!message.trim() || !user}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
