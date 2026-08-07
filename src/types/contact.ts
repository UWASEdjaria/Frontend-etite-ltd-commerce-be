export interface IContactRequest {
  name: string;
  email: string;
  message: string;
}

export interface IContactResponse {
  success: boolean;
  message: string;
}