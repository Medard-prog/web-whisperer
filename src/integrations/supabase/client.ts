
// Re-export all services for backward compatibility
import { supabase, checkSupabaseConnection } from './core/client';

export { supabase, checkSupabaseConnection };

// User services
export * from './services/userService';

// Project services
export * from './services/projectService';
export * from './services/projectTaskService';
export * from './services/projectNoteService';
export * from './services/messageService';
export * from './services/fileService';
export * from './services/analyticsService';
export * from './services/modificationService';
