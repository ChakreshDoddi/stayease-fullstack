import axios from 'axios';

export const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const apiMessage = error.response?.data?.message as string | undefined;
    if (apiMessage) return apiMessage;
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
};
