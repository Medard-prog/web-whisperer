
import { useState, useRef, KeyboardEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface ChatInputProps {
  onSendMessage: (content: string, file?: File) => Promise<void>;
  isLoading: boolean;
  placeholder?: string;
}

const ChatInput = ({ onSendMessage, isLoading, placeholder = "Type your message..." }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if ((!message.trim() && !selectedFile) || isLoading) return;
    
    try {
      await onSendMessage(message, selectedFile || undefined);
      setMessage('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File is too large. Maximum size is 5MB.");
        return;
      }
      setSelectedFile(file);
    }
  };

  return (
    <div className="border-t p-3 bg-card">
      {selectedFile && (
        <div className="mb-2 p-2 bg-muted rounded flex items-center justify-between">
          <span className="text-sm truncate">
            {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSelectedFile(null)}
            className="h-6 w-6"
          >
            <X size={16} />
          </Button>
        </div>
      )}
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          <Paperclip size={18} />
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
          />
        </Button>
        
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1"
        />
        
        <Button 
          onClick={handleSend} 
          disabled={(!message.trim() && !selectedFile) || isLoading}
          className="bg-primary hover:bg-primary/90"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
