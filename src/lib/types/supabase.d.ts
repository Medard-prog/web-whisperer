
/**
 * Type definitions for Supabase database tables and relations
 * These types are used to provide better type safety when working with Supabase
 */

declare interface ProjectsRequest {
  id: string;
  project_name: string;
  description: string;
  status: string;
  price: number;
  created_at: string;
  has_ecommerce: boolean;
  has_cms: boolean;
  has_seo: boolean;
  has_maintenance: boolean;
  user_id?: string;
  project_type?: string;
  design_complexity?: string;
  page_count?: number;
  business_goal?: string;
}

declare type SelectQueryError<T extends string> = {
  error: true;
} & String;
