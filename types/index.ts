export interface RegisterDetail {
	fullName: string;
	password: string;
	phoneNo: string;
	occupation?: string;
	email: string;
}

export interface LoginDetail {
	password: string;
	email: string;
}
export interface ResetDetail {
	email: string;
}
export interface userDetails {
	id: string;
	full_name: string;
	occupation_name?: string;
	description?: string;
	avatar_url: string;
	profile_image: string | undefined;
	email?: string;
	location: string;
	phone: string;
	twitter: string;
	linkedIn: string;
	facebook: string;
	instagram: string;
}

export interface BookingDetails {
	client_id?: string;
	client_name?: string;
	contact_email?: string;
	client_image?: string;
	phone?: string;
	date?: string;
	completed_date?: string;
	status: "pending" | "approved" | "completed";
}

export interface BookingData {
	id: string;
	artisan_id: string;
	pending_contract: BookingDetails[];
	active_contract: BookingDetails[];
	completed_contract: BookingDetails[];
}

export interface TableContentProps {
	avatarUrl?: string;
	clientName?: string;
	clientEmail?: string;
	clientPhone?: string;
	bookingDate?: string;
	clientStatus: "pending" | "approved";
	index: number;
	clientId?: string;
	handleApprove?: (clientId: string) => void;
	handleDecline?: (clientId: string) => void;
	handleCompleted?: (clientId: string) => void;
}
