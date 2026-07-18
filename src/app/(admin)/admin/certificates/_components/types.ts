export type Certificate = {
  id: string;
  name: string;
  image: string;
  description?: string;
  order: number;
  isActive: boolean;
  isVerifiedBy: boolean;
};

export type CertificateFormData = {
  name: string;
  image: string;
  description: string;
  order: number;
  isActive: boolean;
  isVerifiedBy: boolean;
};
