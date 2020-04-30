export interface MessageType {
  date?: string;
  contentType?: string;
  alias?: string;
  message?: string;
  id?: string;
  sender?: string;
  isSent?: boolean;
  feePaid?: number;
  verified?: boolean;
  tokens?: number;
}
