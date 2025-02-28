
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
