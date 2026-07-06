export interface MessageRow {
  id: string;
  senderName: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface PaginatedMessagesResponse {
  messages: MessageRow[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}