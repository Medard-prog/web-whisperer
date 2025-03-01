
-- This file contains stored procedures for the Supabase database
-- They should be executed in the SQL Editor to be available for use

-- Get admin notes for a project
CREATE OR REPLACE FUNCTION get_admin_notes(project_id_param UUID)
RETURNS TABLE (
  id UUID,
  project_id UUID,
  content TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT n.id, n.project_id, n.content, n.created_by, n.created_at
  FROM project_notes n
  WHERE n.project_id = project_id_param
  ORDER BY n.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Add admin note to a project
CREATE OR REPLACE FUNCTION add_admin_note(
  project_id_param UUID,
  content_param TEXT,
  user_id_param UUID
) RETURNS UUID AS $$
DECLARE
  note_id UUID;
BEGIN
  INSERT INTO project_notes (project_id, content, created_by)
  VALUES (project_id_param, content_param, user_id_param)
  RETURNING id INTO note_id;
  
  RETURN note_id;
END;
$$ LANGUAGE plpgsql;

-- Get project files 
CREATE OR REPLACE FUNCTION get_project_files(
  project_id_param UUID,
  admin_only_param BOOLEAN DEFAULT FALSE
) RETURNS TABLE (
  id UUID,
  project_id UUID,
  filename TEXT,
  file_path TEXT,
  file_type TEXT,
  file_size INT,
  uploaded_by UUID,
  uploaded_at TIMESTAMPTZ,
  is_admin_only BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT pf.id, pf.project_id, pf.filename, pf.file_path, 
         pf.file_type, pf.file_size, pf.uploaded_by, pf.uploaded_at, 
         pf.is_admin_only
  FROM project_notes pf
  WHERE pf.project_id = project_id_param
  AND (NOT admin_only_param OR pf.is_admin_only = admin_only_param)
  ORDER BY pf.uploaded_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Add project file
CREATE OR REPLACE FUNCTION add_project_file(
  project_id_param UUID,
  filename_param TEXT,
  file_path_param TEXT,
  file_type_param TEXT,
  file_size_param INT,
  uploaded_by_param UUID,
  is_admin_only_param BOOLEAN DEFAULT FALSE
) RETURNS TABLE (
  id UUID,
  project_id UUID
) AS $$
DECLARE
  file_id UUID;
BEGIN
  INSERT INTO project_notes (
    project_id, 
    content,
    created_by
  )
  VALUES (
    project_id_param, 
    'File uploaded: ' || filename_param,
    uploaded_by_param
  )
  RETURNING id INTO file_id;
  
  RETURN QUERY
  SELECT file_id, project_id_param;
END;
$$ LANGUAGE plpgsql;
