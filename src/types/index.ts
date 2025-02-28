
export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  phone?: string;
  company?: string;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  websiteType: string;
  pageCount: number;
  designComplexity: string;
  hasCMS: boolean;
  hasEcommerce: boolean;
  hasSEO: boolean;
  hasMaintenance: boolean;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  price: number;
  createdAt: string;
  dueDate?: string;
  exampleUrls?: string[];
  additionalInfo?: string;
}

export interface Message {
  id: string;
  projectId: string;
  userId: string;
  content: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string;
  createdAt: string;
  createdBy: string;
}

export interface ProjectNote {
  id: string;
  projectId: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

// Mapper functions to convert from Supabase snake_case to our camelCase types
export function mapUser(user: any): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.is_admin || false,
    phone: user.phone,
    company: user.company
  };
}

export function mapProject(project: any): Project {
  return {
    id: project.id,
    userId: project.user_id,
    title: project.title,
    description: project.description || '',
    websiteType: project.website_type || '',
    pageCount: project.page_count || 1,
    designComplexity: project.design_complexity || 'standard',
    hasCMS: project.has_cms || false,
    hasEcommerce: project.has_ecommerce || false,
    hasSEO: project.has_seo || false,
    hasMaintenance: project.has_maintenance || false,
    status: project.status || 'pending',
    price: project.price || 0,
    createdAt: project.created_at,
    dueDate: project.due_date,
    exampleUrls: project.example_urls,
    additionalInfo: project.additional_info
  };
}

export function mapProjectTask(task: any): ProjectTask {
  return {
    id: task.id,
    projectId: task.project_id,
    title: task.title,
    description: task.description,
    isCompleted: task.is_completed || false,
    dueDate: task.due_date,
    createdAt: task.created_at,
    createdBy: task.created_by
  };
}

export function mapProjectNote(note: any): ProjectNote {
  return {
    id: note.id,
    projectId: note.project_id,
    content: note.content,
    createdAt: note.created_at,
    createdBy: note.created_by
  };
}
