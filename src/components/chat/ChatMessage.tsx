
import { useState } from 'react';
import { Message } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FileIcon, ImageIcon, Paperclip } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
  userName?: string;
}

const ChatMessage = ({ message, isCurrentUser, userName = 'User' }: ChatMessageProps) => {
  const [imageError, setImageError] = useState(false);
  const formattedTime = message.createdAt ? formatDistanceToNow(new Date(message.createdAt), { addSuffix: true }) : '';
  
  const hasAttachment = !!message.attachmentUrl;
  const isImage = message.attachmentType?.startsWith('image/') && !imageError;
  
  return (
    <div className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      {!isCurrentUser && (
        <Avatar className="h-9 w-9 mr-2">
          <AvatarImage src={message.isAdmin ? "/lovable-uploads/2f905194-2593-457d-8702-354488b73410.png" : "/placeholder.svg"} />
          <AvatarFallback>
            {message.isAdmin ? 'A' : userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[80%] ${isCurrentUser ? 'order-1' : 'order-2'}`}>
        <div className="flex items-center mb-1">
          <span className={`text-xs text-gray-500 ${isCurrentUser ? 'ml-auto' : ''}`}>
            {message.isAdmin ? 'Admin' : userName} • {formattedTime}
          </span>
        </div>
        
        <Card className={`p-3 shadow-sm ${
          isCurrentUser 
            ? 'bg-primary text-primary-foreground rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
            : 'bg-muted rounded-tl-lg rounded-tr-lg rounded-br-lg'
        }`}>
          <div className="space-y-2">
            <p className="text-sm whitespace-pre-line">{message.content}</p>
            
            {hasAttachment && (
              <div className="mt-2 rounded overflow-hidden border">
                {isImage ? (
                  <img 
                    src={message.attachmentUrl} 
                    alt="Attached image" 
                    className="max-w-full h-auto max-h-64 object-contain bg-white"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="bg-gray-100 p-3 flex items-center">
                    {message.attachmentType?.includes('pdf') ? (
                      <FileIcon size={24} className="text-red-500 mr-2" />
                    ) : message.attachmentType?.includes('image') ? (
                      <ImageIcon size={24} className="text-blue-500 mr-2" />
                    ) : (
                      <Paperclip size={24} className="text-gray-500 mr-2" />
                    )}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a 
                            href={message.attachmentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm font-medium truncate hover:underline"
                          >
                            {message.attachmentUrl.split('/').pop() || 'Attachment'}
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to open</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
      
      {isCurrentUser && (
        <Avatar className="h-9 w-9 ml-2">
          <AvatarFallback>
            {userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
