
export interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
  websiteType?: string;
  pageCount?: number;
  price: number;
  createdAt: string;
  userId?: string;
  hasEcommerce?: boolean;
  hasCMS?: boolean;
  hasSEO?: boolean;
  hasMaintenance?: boolean;
  designComplexity?: string;
  paymentStatus?: string;
  amountPaid?: number;
  dueDate?: string;
  type?: string;
  exampleUrls?: string[];
  additionalInfo?: string;
}

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue';

export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string;
  createdAt: string;
  projectId: string;
  createdBy: string;
}

export interface Message {
  id: string;
  projectId: string;
  content: string;
  createdAt: string;
  isAdmin: boolean;
  userId: string;
  attachmentUrl?: string;
  attachmentType?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  phone?: string;
  company?: string;
}

export interface ProjectNote {
  id: string;
  content: string;
  isAdminOnly: boolean;
  createdAt: string;
  projectId: string;
  createdBy: string;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  filename: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  isAdminOnly: boolean;
  url: string;
}

// Helper functions for mapping database objects to frontend types
export const mapProject = (project: any): Project => {
  return {
    id: project.id,
    title: project.title || project.project_name || '',
    description: project.description || '',
    status: project.status || 'pending',
    websiteType: project.website_type || project.project_type || '',
    pageCount: project.page_count || 0,
    price: project.price || 0,
    createdAt: project.created_at,
    userId: project.user_id,
    hasEcommerce: project.has_ecommerce || false,
    hasCMS: project.has_cms || false,
    hasSEO: project.has_seo || false,
    hasMaintenance: project.has_maintenance || false,
    designComplexity: project.design_complexity || 'standard',
    paymentStatus: project.payment_status || 'pending',
    amountPaid: project.amount_paid || 0,
    dueDate: project.due_date,
    type: project.type || 'project',
    exampleUrls: project.example_urls || [],
    additionalInfo: project.additional_info || ''
  };
};

export const mapProjectFile = (file: any): ProjectFile => {
  return {
    id: file.id,
    projectId: file.project_id,
    filename: file.filename,
    filePath: file.file_path,
    fileType: file.file_type,
    fileSize: file.file_size,
    uploadedBy: file.uploaded_by,
    uploadedAt: file.uploaded_at,
    isAdminOnly: file.is_admin_only,
    url: file.url
  };
};
