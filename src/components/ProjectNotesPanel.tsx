
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronDown, 
  Clock, 
  FilePlus, 
  FileText, 
  Loader2, 
  LockIcon, 
  PlusCircle, 
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ProjectNote } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ProjectNotesPanelProps {
  projectId: string;
}

const ProjectNotesPanel = ({ projectId }: ProjectNotesPanelProps) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<ProjectNote[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuth();
  
  useEffect(() => {
    if (projectId) {
      fetchNotes();
    }
  }, [projectId]);
  
  const fetchNotes = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('project_notes')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const formattedNotes = data.map(note => ({
        id: note.id,
        content: note.content,
        isAdminOnly: note.is_admin_only,
        createdAt: note.created_at,
        projectId: note.project_id,
        createdBy: note.created_by
      })) as ProjectNote[];
      
      setNotes(formattedNotes);
    } catch (error: any) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const addNote = async () => {
    if (!noteContent.trim()) return;
    
    try {
      setIsAddingNote(true);
      
      const { data, error } = await supabase
        .from('project_notes')
        .insert([{
          project_id: projectId,
          content: noteContent,
          is_admin_only: isPrivate,
          created_by: user?.id
        }])
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      const newNote: ProjectNote = {
        id: data.id,
        content: data.content,
        isAdminOnly: data.is_admin_only,
        createdAt: data.created_at,
        projectId: data.project_id,
        createdBy: data.created_by
      };
      
      setNotes([newNote, ...notes]);
      setNoteContent('');
      setIsPrivate(false);
      toast.success('Note added successfully');
    } catch (error: any) {
      console.error('Error adding note:', error);
      toast.error(isPrivate ? 'Nu s-a putut adăuga notița privată. Încercați din nou.' : 'Failed to add note. Please try again.');
    } finally {
      setIsAddingNote(false);
    }
  };
  
  const filteredNotes = activeTab === 'all' 
    ? notes 
    : activeTab === 'public' 
      ? notes.filter(note => !note.isAdminOnly)
      : notes.filter(note => note.isAdminOnly);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" /> 
            Project Notes
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
      <CardContent>
        {isAddingNote && (
          <div className="mb-6 space-y-3 bg-muted/50 p-3 rounded-md">
            <Textarea
              placeholder="Add your note here..."
              className="min-h-[120px]"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                className={`gap-1 ${isPrivate ? 'bg-amber-100 border-amber-300 text-amber-800' : ''}`}
                onClick={() => setIsPrivate(!isPrivate)}
              >
                <LockIcon size={14} /> {isPrivate ? 'Private Note' : 'Make Private'}
              </Button>
              <Button 
                size="sm" 
                onClick={addNote} 
                disabled={!noteContent.trim() || isAddingNote}
              >
                {isAddingNote ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FilePlus className="mr-1 h-4 w-4" />
                    Save Note
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">All Notes</TabsTrigger>
            <TabsTrigger value="public">Public</TabsTrigger>
            <TabsTrigger value="private">Private</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Loading notes...</p>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto opacity-20" />
                <p className="mt-2">No notes yet</p>
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
              filteredNotes.map((note) => (
                <NoteItem key={note.id} note={note} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="public" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Loading notes...</p>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto opacity-20" />
                <p className="mt-2">No public notes yet</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => {
                    setIsPrivate(false);
                    setIsAddingNote(true);
                  }}
                >
                  <PlusCircle className="mr-1 h-4 w-4" />
                  Add Public Note
                </Button>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <NoteItem key={note.id} note={note} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="private" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Loading notes...</p>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto opacity-20" />
                <p className="mt-2">No private notes yet</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => {
                    setIsPrivate(true);
                    setIsAddingNote(true);
                  }}
                >
                  <PlusCircle className="mr-1 h-4 w-4" />
                  Add Private Note
                </Button>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <NoteItem key={note.id} note={note} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface NoteItemProps {
  note: ProjectNote;
}

const NoteItem = ({ note }: NoteItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const createdDate = new Date(note.createdAt);
  
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border rounded-md"
    >
      <div className="flex items-start p-3">
        <div className="grow">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              Admin
            </span>
            {note.isAdminOnly && (
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded flex items-center">
                <LockIcon size={10} className="mr-1" /> Private
              </span>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground flex items-center mb-2">
            <Clock className="h-3 w-3 mr-1" />
            <span>{format(createdDate, 'MMM d, yyyy HH:mm')}</span>
          </div>
          
          <div className="text-sm line-clamp-2 font-medium mb-1">
            {note.content}
          </div>
        </div>
        
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="ml-2">
            <ChevronDown className={`h-4 w-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            <span className="sr-only">{isOpen ? 'Collapse' : 'Expand'}</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent>
        <div className="px-3 pb-3 pt-0 whitespace-pre-line text-sm">
          {note.content}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ProjectNotesPanel;
