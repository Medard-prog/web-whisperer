import { ProjectTask, Message, User, ProjectNote, ProjectFile } from '@/types';

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
  type?: string; // Add this field to distinguish between project types
}

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
