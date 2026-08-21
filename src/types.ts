export interface User {
  id: string;
  username: string;
  name: string;
  crm?: string;
  specialty?: string;
  avatarColor?: string;
  createdAt: string;
}

export interface NoteFolder {
  id: string;
  userId: string;
  name: string;
  icon?: string;
  color?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  userId: string;
  folderId: string; // 'root' or specific folder ID
  title: string;
  content: string; // Rich HTML/Text content supporting formatting and symbols like ≥, ≤, >, <, ±, °C
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomPreset {
  id: string;
  userId?: string; // If undefined, it's a global/default preset
  name: string;
  icon: string;
  category?: string;
  sectionIds: string[];
  isCustom?: boolean;
}

export interface SavedMedicalForm {
  id: string;
  userId: string;
  title: string;
  patientName?: string;
  formType: string;
  date: string;
  content: string;
  createdAt: string;
}
