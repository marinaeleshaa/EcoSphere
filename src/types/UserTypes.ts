export interface User {
  name: string;
  location: string;
  workingHours: string;
  description: string;
  id: any;
  points: number;
  paymentHistory: Object[];
  subscriptionPeriod: string;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  birthDate: string;
  gender: string;
  avatar?: {
    key: string;
    url?: string;
  };
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shop {
  name: string;
  location: string;
  workingHours: string;
  description: string;
  id: any;
  points: number;
  paymentHistory: Object[];
  subscriptionPeriod: string;
  _id: string;
  email: string;
  phoneNumber: string;
  avatar?: {
    key: string;
    url?: string;
  };
  createdAt: string;
  updatedAt: string;
}
