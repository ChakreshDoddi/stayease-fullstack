import { api, unwrap } from './client';
import type { InquiryRequest } from '@/types/api';

export const createInquiry = async (payload: InquiryRequest) => {
  const res = await api.post('/inquiries', payload);
  return unwrap<unknown>(res);
};
