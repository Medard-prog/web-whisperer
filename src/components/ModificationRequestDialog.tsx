
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, FileText, FolderPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ModificationRequestDialogProps {
  projectId: string;
  userId: string;
  children: React.ReactNode;
}

const ModificationRequestDialog = ({ projectId, userId, children }: ModificationRequestDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('small');
  const [customBudget, setCustomBudget] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error('Please describe the modifications you need');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create a message with the modification request details
      const messageContent = `MODIFICATION REQUEST\n\nDescription: ${description}\n\nBudget: ${budget === 'custom' ? customBudget : budget}`;
      
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          project_id: projectId,
          user_id: userId,
          content: messageContent,
          is_admin: false
        }])
        .select('*')
        .single();
        
      if (error) throw error;
      
      toast.success('Modification request sent successfully!');
      
      // Close dialog and reset form
      setIsOpen(false);
      setDescription('');
      setBudget('small');
      setCustomBudget('');
    } catch (error: any) {
      console.error('Error sending modification request:', error);
      toast.error(`Failed to send request: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FolderPlus className="mr-2 h-5 w-5 text-primary" />
            Request Project Modifications
          </DialogTitle>
          <DialogDescription>
            Describe the changes you would like to make to your project.
            Our team will review your request and get back to you.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description" className="font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Please describe in detail the modifications you need..."
              className="min-h-[120px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="budget" className="font-medium">
              Budget
            </Label>
            <Select
              value={budget}
              onValueChange={setBudget}
            >
              <SelectTrigger id="budget">
                <SelectValue placeholder="Select your budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small (under €500)</SelectItem>
                <SelectItem value="medium">Medium (€500 - €1,000)</SelectItem>
                <SelectItem value="large">Large (€1,000 - €2,000)</SelectItem>
                <SelectItem value="enterprise">Enterprise (€2,000+)</SelectItem>
                <SelectItem value="custom">Custom (Specify)</SelectItem>
              </SelectContent>
            </Select>
            
            {budget === 'custom' && (
              <Input
                className="mt-2"
                placeholder="Enter your custom budget"
                value={customBudget}
                onChange={(e) => setCustomBudget(e.target.value)}
              />
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !description.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Submit Request
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModificationRequestDialog;
