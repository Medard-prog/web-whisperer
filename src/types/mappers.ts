
import {
  Project,
  ProjectTask,
  ProjectNote,
  ProjectModificationRequest,
  ProjectFile
} from './projectTypes';
import { User } from './userTypes';
import { Message, AdminNote } from './index';

export function mapProject(data: any): Project {
  return {
    id: data.id,
    title: data.title || data.project_name || '',
    description: data.description || '',
    status: data.status || 'pending',
    createdAt: data.created_at,
    dueDate: data.due_date,
    price: data.price || 0,
    userId: data.user_id,
    type: data.type || 'project',
    hasEcommerce: data.has_ecommerce,
    hasCMS: data.has_cms,
    hasSEO: data.has_seo,
    hasMaintenance: data.has_maintenance,
    // Website details
    websiteType: data.website_type || data.project_type,
    pageCount: data.page_count,
    designComplexity: data.design_complexity,
    exampleUrls: data.example_urls || data.file_urls,
    additionalInfo: data.additional_info,
    // Payment details
    amountPaid: data.amount_paid || 0,
    paymentStatus: data.payment_status || 'pending',
    paymentHistory: data.payment_history || []
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
    fileName: data.file_name,
    fileUrl: data.file_url,
    filePath: data.file_path
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
    isAdminOnly: data.isAdminOnly || data.is_admin_only || false,
    url: data.url || ''
  };
}

export function mapProjectModificationRequest(data: any): ProjectModificationRequest {
  return {
    id: data.id,
    projectId: data.project_id,
    userId: data.user_id,
    description: data.description,
    budget: data.budget,
    timeline: data.timeline,
    priority: data.priority,
    status: data.status,
    createdAt: data.created_at
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
