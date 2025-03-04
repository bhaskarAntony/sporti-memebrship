export interface User {
  id: string;
  name: string;
  email: string;
  gender: string;
  mobilenumber: string;
  designation: string;
  workingstatus: string;
  officialaddress: string;
  personalmobilenumber: string;
  idCardNo: string;
  membershipId?: string;
}

export interface Membership {
  id: string;
  userId: string;
  officerName: string;
  officerEmail: string;
  officerDesignation: string;
  membershipType: 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'pending';
  balance: number;
  cardNumber: string;
  qrCode: string;
  createdAt: string;
  transactions: Transaction[];
  bookings: Booking[];
}

export interface Transaction {
  id: string;
  membershipId: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: string;
}

export interface Booking {
  id: string;
  username: string;
  email: string;
  officerDesignation: string;
  officerCadre: string;
  phoneNumber: string;
  applicationNo: string;
  sporti: string;
  checkIn: string;
  checkOut: string;
  serviceName: string;
  eventdate: string;
  serviceType: string;
  roomType: string;
  noRooms: string;
  guestType: string;
  paymentStatus: string;
  totalCost: string;
  status: 'pending' | 'confirmed' | 'rejected';
  rejectionReason: string;
  numberOfDays: number;
  selectedRoomNumber: string;
  roomId: string;
  lastCheckOut: string;
  isCheckout: boolean;
  membershipId: string;
}

export interface Service {
  id: string;
  name: string;
  type: string;
  description: string;
  cost: number;
  image: string;
}

export interface Room {
  id: string;
  number: string;
  type: string;
  building: string;
  floor: string;
  status: 'available' | 'occupied' | 'maintenance';
  cost: number;
}

export interface RoomData {
  [building: string]: {
    [floor: string]: {
      [type: string]: string[];
    };
  };
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  monthlyRevenue: number[];
  serviceDistribution: {name: string, value: number}[];
  membershipTypes: {name: string, value: number}[];
  bookingStatus: {name: string, value: number}[];
  revenueByService: {name: string, value: number}[];
}