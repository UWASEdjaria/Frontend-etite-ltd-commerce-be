export interface PaypackPaymentRequest {
  phone: string;
  amount: number;
  orderId: string;
}

export interface PaypackTransactionData {
  ref?: string;
  status?: string;
  amount?: number;
  client?: string;
  kind?: string;
  created_at?: string;
  key?: string;
}

export interface PaypackApiResponse {
  data?: PaypackTransactionData;
  error?: string;
}

export interface CheckoutProps {
  totalAmount?: number;
  user?: {
    email?: string;
    name?: string;
  } | null;
}