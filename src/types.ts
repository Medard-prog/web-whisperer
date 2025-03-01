
// Project management types
export type ProjectStatus = "pending" | "in_progress" | "completed" | "cancelled" | "new";

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
  // Adding missing properties that AdminDashboard.tsx is looking for
  websiteType?: string;
  pageCount?: number;
  designComplexity?: string;
  exampleUrls?: string[];
  additionalInfo?: string;
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
  isAdminOnly?: boolean;  // Added this field to support admin-only notes
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  isAdmin?: boolean;
}

export interface Message {
  id: string;
  projectId?: string;
  content: string;
  createdAt: string;
  isAdmin: boolean;
  userId: string;
  attachmentUrl?: string;
  attachmentType?: string;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  filename: string;
  filePath: string;
  fileType?: string;
  fileSize?: number;
  uploadedBy?: string;
  uploadedAt: string;
  isAdminOnly: boolean;
  url?: string; // Added URL field for direct access
}

export interface AdminNote {
  id: string;
  projectId: string;
  content: string;
  createdBy?: string;
  createdAt: string;
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
    // Adding mapping for the additional fields
    websiteType: data.website_type,
    pageCount: data.page_count,
    designComplexity: data.design_complexity,
    exampleUrls: data.example_urls,
    additionalInfo: data.additional_info
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
    isAdminOnly: data.is_admin_only,
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

export function mapMessage(data: any): Message {
  return {
    id: data.id,
    projectId: data.project_id,
    content: data.content,
    createdAt: data.created_at,
    isAdmin: data.is_admin || false,
    userId: data.user_id,
    attachmentUrl: data.attachment_url,
    attachmentType: data.attachment_type,
  };
}

export function mapProjectFile(data: any): ProjectFile {
  // Handle case where data might come from storage API or custom object
  return {
    id: data.id || '',
    projectId: data.projectId || data.project_id || '',
    filename: data.filename || data.name || '',
    filePath: data.filePath || data.file_path || '',
    fileType: data.fileType || data.file_type || '',
    fileSize: data.fileSize || data.file_size || 0,
    uploadedBy: data.uploadedBy || data.uploaded_by || '',
    uploadedAt: data.uploadedAt || data.uploaded_at || data.created_at || '',
    isAdminOnly: data.isAdminOnly || data.is_admin_only || false
  };
}

export function mapAdminNote(data: any): AdminNote {
  return {
    id: data.id,
    projectId: data.project_id,
    content: data.content,
    createdBy: data.created_by,
    createdAt: data.created_at,
  };
}
