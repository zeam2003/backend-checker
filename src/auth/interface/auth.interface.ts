export interface AuthPayload {
    userId: string;
    email: string;
    roles?: string[];
    accessToken?: string;
  }
  