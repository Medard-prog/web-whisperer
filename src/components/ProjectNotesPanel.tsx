
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase, fetchProjectNotes } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProjectNote, mapProjectNote } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { FileText, Plus, Trash2, Edit2 } from "lucide-react";

interface ProjectNotesPanelProps {
  projectId: string;
}

const ProjectNotesPanel = ({ projectId }: ProjectNotesPanelProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<ProjectNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [editNote, setEditNote] = useState<{ id: string, content: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    fetchNotes();
  }, [projectId]);
  
  const fetchNotes = async () => {
    try {
      setLoading(true);
      
      const notes = await fetchProjectNotes(projectId);
      setNotes(notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Nu s-au putut încărca notițele. Încearcă din nou.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const addNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      const newNoteObj = {
        project_id: projectId,
        content: newNote,
        created_by: user?.id || '',
      };
      
      const { data, error } = await supabase
        .from('project_notes')
        .insert(newNoteObj)
        .select('*')
        .single();
        
      if (error) throw error;
      
      // Use the mapper function to convert the snake_case response to camelCase
      const mappedNote = mapProjectNote(data);
      setNotes(prev => [mappedNote, ...prev]);
      setNewNote("");
      
      toast({
        title: "Notiță adăugată",
        description: "Notița a fost adăugată cu succes.",
      });
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Nu s-a putut adăuga notița. Încearcă din nou.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const updateNote = async () => {
    if (!editNote || !editNote.content.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('project_notes')
        .update({ content: editNote.content })
        .eq('id', editNote.id);
        
      if (error) throw error;
      
      setNotes(prev => 
        prev.map(note => 
          note.id === editNote.id ? { ...note, content: editNote.content } : note
        )
      );
      
      setEditNote(null);
      
      toast({
        title: "Notiță actualizată",
        description: "Notița a fost actualizată cu succes.",
      });
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Nu s-a putut actualiza notița. Încearcă din nou.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const deleteNote = async (id: string) => {
    try {
      // Optimistically update the UI
      setNotes(prev => prev.filter(note => note.id !== id));
      
      const { error } = await supabase
        .from('project_notes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Notiță ștearsă",
        description: "Notița a fost ștearsă cu succes.",
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      
      // Refetch notes if there was an error
      fetchNotes();
      
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "Nu s-a putut șterge notița. Încearcă din nou.",
      });
    }
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-40 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2 text-indigo-500" />
            Notițe private
          </CardTitle>
          <CardDescription>
            Adaugă notițe vizibile doar pentru administratori
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Adaugă o notiță nouă..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button 
                onClick={addNote} 
                disabled={isSubmitting || !newNote.trim()}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Adaugă
              </Button>
            </div>
          </div>
          
          {notes.length > 0 ? (
            <div className="space-y-3">
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-3 border rounded-md bg-gray-50"
                >
                  {editNote?.id === note.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editNote.content}
                        onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
                        rows={3}
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditNote(null)}
                        >
                          Anulează
                        </Button>
                        <Button 
                          onClick={updateNote} 
                          disabled={isSubmitting || !editNote.content.trim()}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                          size="sm"
                        >
                          Salvează
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          {formatDate(note.createdAt)}
                        </span>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setEditNote({ id: note.id, content: note.content })}
                            className="h-7 w-7 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteNote(note.id)}
                            className="h-7 w-7 text-gray-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 border rounded-md bg-gray-50">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Nu există notițe pentru acest proiect</p>
              <p className="text-sm text-gray-400">Adaugă o notiță pentru a începe</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProjectNotesPanel;
