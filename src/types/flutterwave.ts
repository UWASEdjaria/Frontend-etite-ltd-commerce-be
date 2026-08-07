export interface FlutterwaveResponse {
  transaction_id: number;
  tx_ref: string;
  status: string;
  amount?: number;
  currency?: string;
  flw_ref?: string;
  charged_amount?: number;
}

export interface CheckoutProps {
  totalAmount?: number;
  user?: {
    email?: string;
    name?: string;
  } | null;
}


