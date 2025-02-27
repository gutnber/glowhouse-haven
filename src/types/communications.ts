
export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export type Subscriber = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}
