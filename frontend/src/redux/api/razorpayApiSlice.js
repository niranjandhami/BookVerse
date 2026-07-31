import { apiSlice } from "./apiSlice";
import { RAZORPAY_URL } from "../constants";

export const razorpayApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRazorpayKey: builder.query({
      query: () => ({
        url: `${RAZORPAY_URL}/key`,
      }),
    }),

    createRazorpayOrder: builder.mutation({
      query: (data) => ({
        url: `${RAZORPAY_URL}/create-order`,
        method: "POST",
        body: data,
      }),
    }),

    verifyPayment: builder.mutation({
      query: (data) => ({
        url: `${RAZORPAY_URL}/verify-payment`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetRazorpayKeyQuery,
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation,
} = razorpayApiSlice;