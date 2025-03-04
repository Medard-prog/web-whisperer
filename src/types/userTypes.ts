
// User-related types
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

export interface AdminNote {
  id: string;
  projectId: string;
  content: string;
  createdBy?: string;
  createdAt: string;
}
