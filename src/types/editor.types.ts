// Feature and Entity types for the Web Editor

export type FileFormat = 'json' | 'yaml';
export type FileType = 'feature' | 'entity';

export interface FieldDefinition {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  format: FileFormat;
  content: string;
  description?: string;
  // For features
  entities?: string[];
  // For entities
  fields?: FieldDefinition[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EditorState {
  files: FileItem[];
  searchQuery: string;
  selectedFile: FileItem | null;
  isEditorOpen: boolean;
}