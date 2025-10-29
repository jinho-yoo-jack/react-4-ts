import { create } from 'zustand';
import type {FileItem} from "../types/editor.types.ts";

interface EditorStore {
  files: FileItem[];
  searchQuery: string;
  selectedFile: FileItem | null;
  isEditorOpen: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  addFile: (file: Omit<FileItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFile: (id: string, updates: Partial<FileItem>) => void;
  deleteFile: (id: string) => void;
  selectFile: (file: FileItem | null) => void;
  openEditor: () => void;
  closeEditor: () => void;
  getFilteredFiles: () => FileItem[];
}

// Mock data for initial state
const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'user_profile',
    type: 'entity',
    description: '사용자 프로필 엔티티',
    format: 'json',
    createdAt: new Date('2025-10-25'),
    updatedAt: new Date('2025-10-25'),
    content: `{
  "name": "user_profile",
  "type": "entity",
  "fields": [
    {
      "name": "user_id",
      "type": "string",
      "primary_key": true
    },
    {
      "name": "email",
      "type": "string",
      "required": true
    },
    {
      "name": "created_at",
      "type": "timestamp"
    }
  ]
}`,
    fields: [
      { name: 'user_id', type: 'string', required: true },
      { name: 'email', type: 'string', required: true },
      { name: 'created_at', type: 'timestamp' }
    ]
  },
  {
    id: '2',
    name: 'purchase_amount',
    type: 'feature',
    description: '구매 금액 피처',
    format: 'yaml',
    createdAt: new Date('2025-10-26'),
    updatedAt: new Date('2025-10-26'),
    content: `name: purchase_amount
type: feature
entity: user_profile
value_type: float
description: "사용자의 총 구매 금액"
aggregation:
  function: sum
  window: 30d
source:
  table: transactions
  column: amount`,
    entities: ['user_profile']
  },
  {
    id: '3',
    name: 'order_history',
    type: 'entity',
    description: '주문 이력 엔티티',
    format: 'json',
    createdAt: new Date('2025-10-24'),
    updatedAt: new Date('2025-10-24'),
    content: `{
  "name": "order_history",
  "type": "entity",
  "fields": [
    {
      "name": "order_id",
      "type": "string",
      "primary_key": true
    },
    {
      "name": "user_id",
      "type": "string",
      "foreign_key": "user_profile.user_id"
    },
    {
      "name": "total_amount",
      "type": "float"
    }
  ]
}`,
    fields: [
      { name: 'order_id', type: 'string', required: true },
      { name: 'user_id', type: 'string' },
      { name: 'total_amount', type: 'float' }
    ]
  },
  {
    id: '4',
    name: 'user_activity_score',
    type: 'feature',
    description: '사용자 활동 점수',
    format: 'yaml',
    createdAt: new Date('2025-10-27'),
    updatedAt: new Date('2025-10-27'),
    content: `name: user_activity_score
type: feature
entity: user_profile
value_type: integer
description: "사용자의 활동 점수"`,
    entities: ['user_profile']
  }
];

export const useEditorStore = create<EditorStore>((set, get) => ({
  files: mockFiles,
  searchQuery: '',
  selectedFile: null,
  isEditorOpen: false,

  setSearchQuery: (query) => set({ searchQuery: query }),

  addFile: (fileData) => {
    const newFile: FileItem = {
      ...fileData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({ files: [...state.files, newFile] }));
  },

  updateFile: (id, updates) => {
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, ...updates, updatedAt: new Date() } : file
      ),
    }));
  },

  deleteFile: (id) => {
    set((state) => ({
      files: state.files.filter((file) => file.id !== id),
      selectedFile: state.selectedFile?.id === id ? null : state.selectedFile,
    }));
  },

  selectFile: (file) => set({ selectedFile: file }),

  openEditor: () => set({ isEditorOpen: true }),

  closeEditor: () => set({ isEditorOpen: false, selectedFile: null }),

  getFilteredFiles: () => {
    const { files, searchQuery } = get();
    if (!searchQuery) return files;

    const query = searchQuery.toLowerCase();
    return files.filter(
      (file) =>
        file.name.toLowerCase().includes(query) ||
        file.description?.toLowerCase().includes(query) ||
        file.type.toLowerCase().includes(query)
    );
  },
}));
