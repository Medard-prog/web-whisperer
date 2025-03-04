
// Project-related types
export type ProjectStatus = "pending" | "in_progress" | "completed" | "cancelled" | "new";
export type PaymentStatus = "pending" | "partial" | "paid" | "overdue";
export type ProjectType = "project" | "request";

export interface PaymentRecord {
  date: string;
  amount: number;
  method: string;
  reference?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  dueDate?: string;
  price: number;
  userId?: string;
  type: ProjectType; 
  hasEcommerce?: boolean;
  hasCMS?: boolean;
  hasSEO?: boolean;
  hasMaintenance?: boolean;
  // Website details
  websiteType?: string;
  pageCount?: number;
  designComplexity?: string;
  exampleUrls?: string[];
  additionalInfo?: string;
  // Payment details
  amountPaid?: number;
  paymentStatus?: PaymentStatus;
  paymentHistory?: PaymentRecord[];
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
  isAdminOnly?: boolean;
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
  url?: string;
}

export interface ProjectModificationRequest {
  id: string;
  projectId: string;
  userId: string;
  description: string;
  budget: string;
  timeline: string;
  priority: string;
  status: string;
  createdAt: string;
}
