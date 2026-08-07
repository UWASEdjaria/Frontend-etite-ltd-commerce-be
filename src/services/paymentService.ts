import axios from 'axios';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';


export const paymentService = {

  verify: async (
    orderId: string,
    transactionId: string
  ) => {
     console.log("Sending payment verification:", {
      orderId,
      transactionId
    });

    const token = localStorage.getItem('token');
    // Build headers dynamically
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await axios.post(
      `${API_URL}/payment/verify`,
      {
        orderId,
        transactionId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Verify response:", response.data)
    

    return response.data;
  }

};