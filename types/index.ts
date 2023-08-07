export interface RegisterDetail {
  fullName: string;
  password: string;
  phoneNo: string;
  occupation: string;
  email: string;
}

export interface RegisterClientDetail {
  fullName: string;
  password: string;
  phoneNo: string;
  email: string;
}

export interface LoginDetail {
  password: string;
  email: string;
}

export interface Artisan {
  id: string;
  full_name: string;
  occupation_name: string;
  avatar_url: string;
  profile_image: string | undefined;
  email?: string;
  loaction: string;
}

export interface userDetails {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  occupation_name: string;
  profile_image: string;
  description: string;
  phone: string;
  loaction: string;
  twitter: string;
  linkedIn: string;
  facebook: string;
  instagram: string;
}

export interface Booking {
  active_contract: ClientDetails[];
  id: string;
  artisan_id: string;
  pending_contract: BookingDetails[];
}

export interface ClientDetails {
  client_id?: string;
  client_name?: string;
  contact_email?: string;
  phone?: string;
  date?: string;
  status: "pending" | "approved" | "declined";
}
export interface BookingDetails {
  client_id: string;
  client_name?: string;
  contact_email?: string;
  phone?: string;
  date?: string;
  status: "pending" | "approved" | "declined";
}
export interface BookingData {
  id: string;
  artisan_id: string;
  pending_contract: BookingDetails[];
  active_contract: ClientDetails[];
}
