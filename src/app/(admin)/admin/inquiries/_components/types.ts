export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  type: string;
  status: string;
  adminNote?: string | null;
  createdAt: string;
};
