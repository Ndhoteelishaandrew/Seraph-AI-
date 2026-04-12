import Dexie, { type Table } from 'dexie';

export interface ChatMessage {
  id?: number;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
  agent?: string;
}

export interface ChatSession {
  id?: number;
  title: string;
  createdAt: number;
  updatedAt: number;
}

export interface UserSettings {
  id?: number;
  username: string;
  theme: 'light' | 'dark' | 'seraph-fire' | 'celestial-blue' | 'earth-tone';
  isGuest: boolean;
  onboardingComplete: boolean;
}

export class SeraphDB extends Dexie {
  messages!: Table<ChatMessage>;
  sessions!: Table<ChatSession>;
  settings!: Table<UserSettings>;

  constructor() {
    super('SeraphAIDB');
    this.version(1).stores({
      messages: '++id, role, timestamp, agent',
      sessions: '++id, title, updatedAt',
      settings: '++id, username'
    });
  }
}

export const db = new SeraphDB();
