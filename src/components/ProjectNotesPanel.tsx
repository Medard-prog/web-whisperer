
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertTriangle,
  ChevronDown, 
  Clock, 
  Download,
  FilePlus, 
  FileText, 
  Loader2, 
  LockIcon, 
  PaperclipIcon,
  PlusCircle, 
  Trash2,
  Upload,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ProjectNote } from '@/types';
import { toast } from 'sonner';
import { fetchProjectNotes, addProjectNote, deleteProjectNote } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from './ui/badge';
import { Input } from './ui/input';

interface ProjectNotesPanelProps {
  projectId: string;
  userId?: string;
  onNoteAdded?: (note: ProjectNote) => void;
  notes?: ProjectNote[];
  loading?: boolean;
  onNotesUpdate?: (updatedNotes: ProjectNote[]) => void;
  isAdmin?: boolean;
}

const ProjectNotesPanel = ({ 
  projectId, 
  userId, 
  onNoteAdded,
  notes: initialNotes,
  loading: isLoading = false,
  onNotesUpdate,
  isAdmin = false
}: ProjectNotesPanelProps) => {
  const { user } = useAuth();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [isPrivate] = useState(true); // Always private, only admins can see
  const [loading, setLoading] = useState(isLoading);
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState<ProjectNote[]>(initialNotes || []);
  const [file, setFile] = useState<File | null>(null);
  
  useEffect(() => {
    if (initialNotes) {
      setNotes(initialNotes);
    } else if (projectId) {
      fetchNotes();
    }
  }, [projectId, initialNotes]);
  
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const fetchedNotes = await fetchProjectNotes(projectId);
      setNotes(fetchedNotes);
    } catch (error: any) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load project notes');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const addNote = async () => {
    if (!noteContent.trim() || !userId) {
      toast.error('Please add some content to your note');
      return;
    }
    
    try {
      setIsSaving(true);
      
      const newNote = await addProjectNote(
        projectId,
        noteContent,
        true, // Always private
        userId,
        file || undefined
      );
      
      if (newNote) {
        const updatedNotes = [newNote, ...notes];
        setNotes(updatedNotes);
        setNoteContent('');
        setFile(null);
        toast.success('Note added successfully');
        
        if (onNoteAdded) {
          onNoteAdded(newNote);
        }
        
        if (onNotesUpdate) {
          onNotesUpdate(updatedNotes);
        }
      }
    } catch (error: any) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note. Please try again.');
    } finally {
      setIsSaving(false);
      setIsAddingNote(false);
    }
  };
  
  const handleDeleteNote = async (noteId: string) => {
    if (!isAdmin) return;
    
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        const success = await deleteProjectNote(noteId);
        if (success) {
          const updatedNotes = notes.filter(note => note.id !== noteId);
          setNotes(updatedNotes);
          
          if (onNotesUpdate) {
            onNotesUpdate(updatedNotes);
          }
          
          toast.success('Note deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting note:', error);
        toast.error('Failed to delete note');
      }
    }
  };
  
  // Only show notes panel to admins
  if (!isAdmin) {
    return null;
  }
  
  return (
    <Card className="h-full shadow-md border">
      <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" /> 
            Admin Notes
            <Badge className="ml-2 bg-amber-100 text-amber-800 border-amber-300">
              <LockIcon size={12} className="mr-1" /> 
              Private
            </Badge>
          </span>
          <Button 
            size="sm" 
            onClick={() => setIsAddingNote(!isAddingNote)}
            variant="outline"
            className="h-8"
          >
            {isAddingNote ? (
              <>Cancel</>
            ) : (
              <>
                <PlusCircle className="mr-1 h-4 w-4" />
                Add Note
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isAddingNote && (
          <div className="mb-6 space-y-3 bg-muted/50 p-3 rounded-md">
            <Textarea
              placeholder="Add your note here..."
              className="min-h-[120px]"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
            
            <div className="bg-gray-50 p-2 rounded border border-dashed">
              <div className="flex items-center">
                <label 
                  htmlFor="file-upload" 
                  className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900"
                >
                  <PaperclipIcon size={16} />
                  {file ? file.name : 'Attach a file (optional)'}
                </label>
                <Input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                
                {file && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 ml-2"
                    onClick={() => setFile(null)}
                  >
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
              
              {file && (
                <div className="mt-2 text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-end">
              <Button 
                size="sm" 
                onClick={addNote} 
                disabled={!noteContent.trim() || isSaving || !userId}
                className="bg-primary gap-1"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FilePlus className="h-4 w-4" />
                    Save Note
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Loading notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto opacity-20" />
              <p className="mt-2">No admin notes yet</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => setIsAddingNote(true)}
              >
                <PlusCircle className="mr-1 h-4 w-4" />
                Add Your First Note
              </Button>
            </div>
          ) : (
            notes.map((note) => (
              <NoteItem 
                key={note.id} 
                note={note} 
                isAdmin={isAdmin}
                onDelete={() => handleDeleteNote(note.id)}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface NoteItemProps {
  note: ProjectNote;
  isAdmin: boolean;
  onDelete: () => void;
}

const NoteItem = ({ note, isAdmin, onDelete }: NoteItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const createdDate = new Date(note.createdAt);
  
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border rounded-md hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start p-3">
        <div className="grow">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              Admin Note
            </span>
            <Badge className="bg-amber-100 text-amber-800 border-amber-300">
              <LockIcon size={10} className="mr-1" /> Private
            </Badge>
          </div>
          
          <div className="text-sm text-muted-foreground flex items-center mb-2">
            <Clock className="h-3 w-3 mr-1" />
            <span>{format(createdDate, 'MMM d, yyyy HH:mm')}</span>
          </div>
          
          <div className="text-sm line-clamp-2 font-medium mb-1">
            {note.content}
          </div>
          
          {note.fileUrl && (
            <div className="mt-2 flex items-center">
              <PaperclipIcon size={14} className="text-blue-500 mr-1" />
              <span className="text-xs text-blue-500 truncate">{note.fileName || 'Attached file'}</span>
            </div>
          )}
        </div>
        
        <div className="flex">
          {isAdmin && (
            <Button variant="ghost" size="sm" onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }} className="h-7 w-7 p-0 ml-1 text-red-500 hover:text-red-700 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          )}
          
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 ml-1">
              <ChevronDown className={`h-4 w-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              <span className="sr-only">{isOpen ? 'Collapse' : 'Expand'}</span>
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      
      <CollapsibleContent>
        <div className="px-3 pb-3 pt-0 whitespace-pre-line text-sm">
          {note.content}
          
          {note.fileUrl && (
            <div className="mt-4 p-2 bg-blue-50 rounded border border-blue-100 flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-sm text-blue-700 truncate max-w-[200px]">
                  {note.fileName || 'Attached file'}
                </span>
              </div>
              <a 
                href={note.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                download
                className="inline-flex items-center px-2 py-1 bg-white rounded border border-blue-200 text-blue-700 text-xs hover:bg-blue-700 hover:text-white transition-colors"
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </a>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ProjectNotesPanel;
