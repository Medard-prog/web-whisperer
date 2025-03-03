
import { useState } from 'react';
import { Message } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FileIcon, ImageIcon, Paperclip } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
  userName?: string;
}

const ChatMessage = ({ message, isCurrentUser, userName = 'User' }: ChatMessageProps) => {
  const [imageError, setImageError] = useState(false);
  const formattedTime = message.createdAt ? format(new Date(message.createdAt), 'HH:mm • dd MMM') : '';
  
  const hasAttachment = !!message.attachmentUrl;
  const isImage = message.attachmentType?.startsWith('image/') && !imageError;
  
  return (
    <div className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      {!isCurrentUser && (
        <div className="flex flex-col items-center mr-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src={message.isAdmin ? "/lovable-uploads/2f905194-2593-457d-8702-354488b73410.png" : "/placeholder.svg"} />
            <AvatarFallback className={message.isAdmin ? "bg-purple-600 text-white" : "bg-blue-600 text-white"}>
              {message.isAdmin ? 'A' : userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      
      <div className={`max-w-[75%] flex flex-col`}>
        <span className={`text-xs text-gray-500 mb-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
          {isCurrentUser ? 'You' : (message.isAdmin ? 'Admin' : userName)}
        </span>
        
        <div className={`rounded-lg p-3 ${
          isCurrentUser 
            ? 'bg-green-500 text-white rounded-tr-none' 
            : 'bg-gray-100 text-gray-800 rounded-tl-none'
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
          <span className="text-xs opacity-70 block text-right mt-1">
            {formattedTime}
          </span>
        </div>
      </div>
      
      {isCurrentUser && (
        <div className="flex flex-col items-center ml-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-blue-600 text-white">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
