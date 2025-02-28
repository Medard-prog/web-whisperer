
// Project management types
export type ProjectStatus = "pending" | "in_progress" | "completed" | "cancelled";

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  dueDate?: string;
  price: number;
  userId?: string;
  hasEcommerce?: boolean;
  hasCMS?: boolean;
  hasSEO?: boolean;
  hasMaintenance?: boolean;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: string;
  dueDate?: string;
  createdBy?: string;
}

export interface ProjectNote {
  id: string;
  projectId: string;
  content: string;
  createdAt: string;
  createdBy?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  isAdmin?: boolean;
}

// Mapper functions to convert snake_case from database to camelCase
export function mapProject(data: any): Project {
  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    status: data.status || 'pending',
    createdAt: data.created_at,
    dueDate: data.due_date,
    price: data.price || 0,
    userId: data.user_id,
    hasEcommerce: data.has_ecommerce,
    hasCMS: data.has_cms,
    hasSEO: data.has_seo,
    hasMaintenance: data.has_maintenance,
  };
}

export function mapProjectTask(data: any): ProjectTask {
  return {
    id: data.id,
    projectId: data.project_id,
    title: data.title,
    description: data.description,
    isCompleted: data.is_completed,
    createdAt: data.created_at,
    dueDate: data.due_date,
    createdBy: data.created_by,
  };
}

export function mapProjectNote(data: any): ProjectNote {
  return {
    id: data.id,
    projectId: data.project_id,
    content: data.content,
    createdAt: data.created_at,
    createdBy: data.created_by,
  };
}

export function mapUser(data: any): User {
  return {
    id: data.id,
    name: data.name || '',
    email: data.email || '',
    phone: data.phone,
    company: data.company,
    isAdmin: data.is_admin,
  };
}
