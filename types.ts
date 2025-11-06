
export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export enum AppMode {
  CHAT = 'Chat',
  IMAGE = 'Image',
}

export interface MessagePart {
  text?: string;
  imageUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: Role;
  parts: MessagePart[];
  isLoading?: boolean;
}

export interface ImageFile {
  base64: string;
  mimeType: string;
}
