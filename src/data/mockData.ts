import { User, Membership, Service, Booking, Transaction, DashboardStats, RoomData } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock Users
export const users: User[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@ksp.gov.in',
    gender: 'Male',
    mobilenumber: '9876543210',
    designation: 'Inspector',
    workingstatus: 'Active',
    officialaddress: 'Police Station, MG Road, Bangalore',
    personalmobilenumber: '9876543210',
    idCardNo: 'KSP10001'
  },
  {
    id: '2',
    name: 'Priya Singh',
    email: 'priya.singh@ksp.gov.in',
    gender: 'Female',
    mobilenumber: '9876543211',
    designation: 'Sub-Inspector',
    workingstatus: 'Active',
    officialaddress: 'Police Station, JP Nagar, Bangalore',
    personalmobilenumber: '9876543211',
    idCardNo: 'KSP10002'
  },
  {
    id: '3',
    name: 'Suresh Reddy',
    email: 'suresh.reddy@ksp.gov.in',
    gender: 'Male',
    mobilenumber: '9876543212',
    designation: 'Constable',
    workingstatus: 'Active',
    officialaddress: 'Police Station, Whitefield, Bangalore',
    personalmobilenumber: '9876543212',
    idCardNo: 'KSP10003'
  },
  {
    id: '4',
    name: 'Lakshmi Devi',
    email: 'lakshmi.devi@ksp.gov.in',
    gender: 'Female',
    mobilenumber: '9876543213',
    designation: 'Assistant Commissioner',
    workingstatus: 'Active',
    officialaddress: 'Commissioner Office, Infantry Road, Bangalore',
    personalmobilenumber: '9876543213',
    idCardNo: 'KSP10004'
  },
  {
    id: '5',
    name: 'Venkat Rao',
    email: 'venkat.rao@ksp.gov.in',
    gender: 'Male',
    mobilenumber: '9876543214',
    designation: 'Deputy Superintendent',
    workingstatus: 'Active',
    officialaddress: 'District Office, Mysore',
    personalmobilenumber: '9876543214',
    idCardNo: 'KSP10005'
  }
];

// Mock Memberships
export const memberships: Membership[] = [
  {
    id: '1',
    userId: '1',
    officerName: 'Rajesh Kumar',
    officerEmail: 'rajesh.kumar@ksp.gov.in',
    officerDesignation: 'Inspector',
    membershipType: 'yearly',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    balance: 5000,
    cardNumber: 'SPT-2024-0001',
    qrCode: 'SPT-2024-0001',
    createdAt: '2024-01-01',
    transactions: [],
    bookings: []
  },
  {
    id: '2',
    userId: '2',
    officerName: 'Priya Singh',
    officerEmail: 'priya.singh@ksp.gov.in',
    officerDesignation: 'Sub-Inspector',
    membershipType: 'monthly',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    status: 'active',
    balance: 2000,
    cardNumber: 'SPT-2024-0002',
    qrCode: 'SPT-2024-0002',
    createdAt: '2024-03-01',
    transactions: [],
    bookings: []
  },
  {
    id: '3',
    userId: '3',
    officerName: 'Suresh Reddy',
    officerEmail: 'suresh.reddy@ksp.gov.in',
    officerDesignation: 'Constable',
    membershipType: 'yearly',
    startDate: '2024-02-01',
    endDate: '2025-01-31',
    status: 'active',
    balance: 3500,
    cardNumber: 'SPT-2024-0003',
    qrCode: 'SPT-2024-0003',
    createdAt: '2024-02-01',
    transactions: [],
    bookings: []
  }
];

// Mock Transactions
export const transactions: Transaction[] = [
  {
    id: '1',
    membershipId: '1',
    amount: 5000,
    type: 'credit',
    description: 'Initial membership deposit',
    date: '2024-01-01'
  },
  {
    id: '2',
    membershipId: '1',
    amount: 500,
    type: 'debit',
    description: 'Gym service booking',
    date: '2024-01-15'
  },
  {
    id: '3',
    membershipId: '1',
    amount: 1000,
    type: 'credit',
    description: 'Card recharge',
    date: '2024-02-01'
  },
  {
    id: '4',
    membershipId: '2',
    amount: 2000,
    type: 'credit',
    description: 'Initial membership deposit',
    date: '2024-03-01'
  },
  {
    id: '5',
    membershipId: '2',
    amount: 300,
    type: 'debit',
    description: 'Table Tennis booking',
    date: '2024-03-10'
  },
  {
    id: '6',
    membershipId: '3',
    amount: 3500,
    type: 'credit',
    description: 'Initial membership deposit',
    date: '2024-02-01'
  },
  {
    id: '7',
    membershipId: '3',
    amount: 1500,
    type: 'debit',
    description: 'Accommodation booking',
    date: '2024-02-20'
  }
];

// Add transactions to memberships
memberships.forEach(membership => {
  membership.transactions = transactions.filter(t => t.membershipId === membership.id);
});

// Mock Services
export const services: Service[] = [
  {
    id: '1',
    name: 'Accommodation',
    type: 'stay',
    description: 'Comfortable rooms for officers and their families',
    cost: 1000,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
  },
  {
    id: '2',
    name: 'Conference Hall',
    type: 'venue',
    description: 'Fully equipped conference hall for meetings and events',
    cost: 2000,
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80'
  },
  {
    id: '3',
    name: 'Main Event Hall',
    type: 'venue',
    description: 'Spacious hall for large gatherings and functions',
    cost: 3000,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1198&q=80'
  },
  {
    id: '4',
    name: 'Barbeque Dining',
    type: 'dining',
    description: 'Outdoor barbeque dining experience',
    cost: 800,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
  },
  {
    id: '5',
    name: 'Badminton',
    type: 'sports',
    description: 'Indoor badminton courts',
    cost: 300,
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: '6',
    name: 'Table Tennis',
    type: 'sports',
    description: 'Table tennis facilities',
    cost: 200,
    image: 'https://images.unsplash.com/photo-1611251135345-18c56206b863?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: '7',
    name: 'GYM',
    type: 'fitness',
    description: 'Fully equipped gym with trainers',
    cost: 500,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: '8',
    name: 'Mini Theatre',
    type: 'entertainment',
    description: 'Private movie screening facility',
    cost: 1000,
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: '9',
    name: 'Billiards',
    type: 'sports',
    description: 'Professional billiards tables',
    cost: 400,
    image: 'https://images.unsplash.com/photo-1611704396822-1590c9ce6775?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80'
  },
  {
    id: '10',
    name: 'Parking',
    type: 'facility',
    description: 'Secure parking for vehicles',
    cost: 100,
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  }
];

// Mock Bookings
export const bookings: Booking[] = [
  {
    id: '1',
    username: 'Rajesh Kumar',
    email: 'rajesh.kumar@ksp.gov.in',
    officerDesignation: 'Inspector',
    officerCadre: 'Gazetted',
    phoneNumber: '9876543210',
    applicationNo: 'APP-2024-001',
    sporti: 'SPORTI-1',
    checkIn: '2024-01-15',
    checkOut: '2024-01-16',
    serviceName: 'Accommodation',
    eventdate: '2024-01-15',
    serviceType: 'stay',
    roomType: 'Standard',
    noRooms: '1',
    guestType: 'Self',
    paymentStatus: 'Paid',
    totalCost: '1000',
    status: 'confirmed',
    rejectionReason: '',
    numberOfDays: 1,
    selectedRoomNumber: '102',
    roomId: 'SPORTI-1-GROUND-102',
    lastCheckOut: '',
    isCheckout: false,
    membershipId: '1'
  },
  {
    id: '2',
    username: 'Rajesh Kumar',
    email: 'rajesh.kumar@ksp.gov.in',
    officerDesignation: 'Inspector',
    officerCadre: 'Gazetted',
    phoneNumber: '9876543210',
    applicationNo: 'APP-2024-002',
    sporti: 'SPORTI-1',
    checkIn: '2024-02-10',
    checkOut: '2024-02-10',
    serviceName: 'GYM',
    eventdate: '2024-02-10',
    serviceType: 'fitness',
    roomType: '',
    noRooms: '',
    guestType: 'Self',
    paymentStatus: 'Paid',
    totalCost: '500',
    status: 'confirmed',
    rejectionReason: '',
    numberOfDays: 1,
    selectedRoomNumber: '',
    roomId: '',
    lastCheckOut: '',
    isCheckout: false,
    membershipId: '1'
  },
  {
    id: '3',
    username: 'Priya Singh',
    email: 'priya.singh@ksp.gov.in',
    officerDesignation: 'Sub-Inspector',
    officerCadre: 'Non-Gazetted',
    phoneNumber: '9876543211',
    applicationNo: 'APP-2024-003',
    sporti: 'SPORTI-2',
    checkIn: '2024-03-10',
    checkOut: '2024-03-10',
    serviceName: 'Table Tennis',
    eventdate: '2024-03-10',
    serviceType: 'sports',
    roomType: '',
    noRooms: '',
    guestType: 'Self',
    paymentStatus: 'Paid',
    totalCost: '300',
    status: 'confirmed',
    rejectionReason: '',
    numberOfDays: 1,
    selectedRoomNumber: '',
    roomId: '',
    lastCheckOut: '',
    isCheckout: false,
    membershipId: '2'
  },
  {
    id: '4',
    username: 'Suresh Reddy',
    email: 'suresh.reddy@ksp.gov.in',
    officerDesignation: 'Constable',
    officerCadre: 'Non-Gazetted',
    phoneNumber: '9876543212',
    applicationNo: 'APP-2024-004',
    sporti: 'SPORTI-1',
    checkIn: '2024-02-20',
    checkOut: '2024-02-21',
    serviceName: 'Accommodation',
    eventdate: '2024-02-20',
    serviceType: 'stay',
    roomType: 'Standard',
    noRooms: '1',
    guestType: 'Family',
    paymentStatus: 'Paid',
    totalCost: '1500',
    status: 'confirmed',
    rejectionReason: '',
    numberOfDays: 1,
    selectedRoomNumber: '204',
    roomId: 'SPORTI-1-FIRST-204',
    lastCheckOut: '',
    isCheckout: false,
    membershipId: '3'
  },
  {
    id: '5',
    username: 'Suresh Reddy',
    email: 'suresh.reddy@ksp.gov.in',
    officerDesignation: 'Constable',
    officerCadre: 'Non-Gazetted',
    phoneNumber: '9876543212',
    applicationNo: 'APP-2024-005',
    sporti: 'SPORTI-1',
    checkIn: '2024-04-15',
    checkOut: '2024-04-15',
    serviceName: 'Conference Hall',
    eventdate: '2024-04-15',
    serviceType: 'venue',
    roomType: '',
    noRooms: '',
    guestType: 'Official',
    paymentStatus: 'Pending',
    totalCost: '2000',
    status: 'pending',
    rejectionReason: '',
    numberOfDays: 1,
    selectedRoomNumber: '',
    roomId: '',
    lastCheckOut: '',
    isCheckout: false,
    membershipId: '3'
  }
];

// Add bookings to memberships
memberships.forEach(membership => {
  membership.bookings = bookings.filter(b => b.membershipId === membership.id);
});

// Room data
export const roomData: RoomData = {
  "SPORTI-1": {
    "GROUND FLOOR": {
      Standard: ["102", "103", "104", "105", "106"],
    },
    "FIRST FLOOR": {
      Standard: ["204", "205", "206", "207", "208", "209", "210", "211"],
      VIP: ["201", "202"],
      Family: ["203"],
    },
  },
  "SPORTI-2": {
    "GROUND FLOOR": {
      VIP: ["01", "02", "03"],
    },
    "FIRST FLOOR": {
      Standard: ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114"],
    },
  },
};

// Dashboard stats
export const dashboardStats: DashboardStats = {
  totalMembers: 5,
  activeMembers: 3,
  totalBookings: 5,
  pendingBookings: 1,
  totalRevenue: 10300,
  monthlyRevenue: [3000, 5000, 2300, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  serviceDistribution: [
    { name: 'Accommodation', value: 2 },
    { name: 'GYM', value: 1 },
    { name: 'Table Tennis', value: 1 },
    { name: 'Conference Hall', value: 1 }
  ],
  membershipTypes: [
    { name: 'Monthly', value: 1 },
    { name: 'Yearly', value: 2 }
  ],
  bookingStatus: [
    { name: 'Confirmed', value: 4 },
    { name: 'Pending', value: 1 },
    { name: 'Rejected', value: 0 }
  ],
  revenueByService: [
    { name: 'Accommodation', value: 2500 },
    { name: 'GYM', value: 500 },
    { name: 'Table Tennis', value: 300 },
    { name: 'Conference Hall', value: 2000 }
  ]
};

// Helper functions for data management
export const generateMembershipId = (): string => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `SPT-${year}-${randomNum}`;
};

export const generateApplicationNo = (): string => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `APP-${year}-${randomNum}`;
};

// Local Storage Management
export const saveToLocalStorage = (key: string, data: any): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorage = (key: string): any => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const initializeLocalStorage = (): void => {
  if (!getFromLocalStorage('users')) {
    saveToLocalStorage('users', users);
  }
  
  if (!getFromLocalStorage('memberships')) {
    saveToLocalStorage('memberships', memberships);
  }
  
  if (!getFromLocalStorage('transactions')) {
    saveToLocalStorage('transactions', transactions);
  }
  
  if (!getFromLocalStorage('bookings')) {
    saveToLocalStorage('bookings', bookings);
  }
  
  if (!getFromLocalStorage('services')) {
    saveToLocalStorage('services', services);
  }
  
  if (!getFromLocalStorage('roomData')) {
    saveToLocalStorage('roomData', roomData);
  }
  
  if (!getFromLocalStorage('dashboardStats')) {
    saveToLocalStorage('dashboardStats', dashboardStats);
  }
};

// Data Access Functions
export const getAllUsers = (): User[] => {
  return getFromLocalStorage('users') || users;
};

export const getUserById = (id: string): User | undefined => {
  const allUsers = getAllUsers();
  return allUsers.find(user => user.id === id);
};

export const getAllMemberships = (): Membership[] => {
  return getFromLocalStorage('memberships') || memberships;
};

export const getMembershipById = (id: string): Membership | undefined => {
  const allMemberships = getAllMemberships();
  return allMemberships.find(membership => membership.id === id);
};

export const getMembershipByUserId = (userId: string): Membership | undefined => {
  const allMemberships = getAllMemberships();
  return allMemberships.find(membership => membership.userId === userId);
};

export const getAllTransactions = (): Transaction[] => {
  return getFromLocalStorage('transactions') || transactions;
};

export const getTransactionsByMembershipId = (membershipId: string): Transaction[] => {
  const allTransactions = getAllTransactions();
  return allTransactions.filter(transaction => transaction.membershipId === membershipId);
};

export const getAllBookings = (): Booking[] => {
  return getFromLocalStorage('bookings') || bookings;
};

export const getBookingsByMembershipId = (membershipId: string): Booking[] => {
  const allBookings = getAllBookings();
  return allBookings.filter(booking => booking.membershipId === membershipId);
};

export const getAllServices = (): Service[] => {
  return getFromLocalStorage('services') || services;
};

export const getServiceById = (id: string): Service | undefined => {
  const allServices = getAllServices();
  return allServices.find(service => service.id === id);
};

export const getRoomData = (): RoomData => {
  return getFromLocalStorage('roomData') || roomData;
};

export const getDashboardStats = (): DashboardStats => {
  return getFromLocalStorage('dashboardStats') || dashboardStats;
};

// Data Mutation Functions
export const addUser = (user: User): User => {
  const allUsers = getAllUsers();
  const newUser = { ...user, id: uuidv4() };
  saveToLocalStorage('users', [...allUsers, newUser]);
  return newUser;
};

export const updateUser = (user: User): User => {
  const allUsers = getAllUsers();
  const updatedUsers = allUsers.map(u => u.id === user.id ? user : u);
  saveToLocalStorage('users', updatedUsers);
  return user;
};

export const deleteUser = (id: string): void => {
  const allUsers = getAllUsers();
  const filteredUsers = allUsers.filter(user => user.id !== id);
  saveToLocalStorage('users', filteredUsers);
};

export const addMembership = (membership: Omit<Membership, 'id' | 'cardNumber' | 'qrCode' | 'createdAt' | 'transactions' | 'bookings'>): Membership => {
  const allMemberships = getAllMemberships();
  const cardNumber = generateMembershipId();
  const newMembership: Membership = {
    ...membership,
    id: uuidv4(),
    cardNumber,
    qrCode: cardNumber,
    createdAt: new Date().toISOString(),
    transactions: [],
    bookings: []
  };
  saveToLocalStorage('memberships', [...allMemberships, newMembership]);
  return newMembership;
};

export const updateMembership = (membership: Membership): Membership => {
  const allMemberships = getAllMemberships();
  const updatedMemberships = allMemberships.map(m => m.id === membership.id ? membership : m);
  saveToLocalStorage('memberships', updatedMemberships);
  return membership;
};

export const deleteMembership = (id: string): void => {
  const allMemberships = getAllMemberships();
  const filteredMemberships = allMemberships.filter(membership => membership.id !== id);
  saveToLocalStorage('memberships', filteredMemberships);
};

export const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>): Transaction => {
  const allTransactions = getAllTransactions();
  const newTransaction: Transaction = {
    ...transaction,
    id: uuidv4(),
    date: new Date().toISOString()
  };
  saveToLocalStorage('transactions', [...allTransactions, newTransaction]);
  
  // Update membership balance
  const membership = getMembershipById(transaction.membershipId);
  if (membership) {
    const newBalance = transaction.type === 'credit' 
      ? membership.balance + transaction.amount 
      : membership.balance - transaction.amount;
    
    const updatedMembership = {
      ...membership,
      balance: newBalance,
      transactions: [...membership.transactions, newTransaction]
    };
    
    updateMembership(updatedMembership);
  }
  
  return newTransaction;
};

export const addBooking = (booking: Omit<Booking, 'id' | 'applicationNo'>): Booking => {
  const allBookings = getAllBookings();
  const applicationNo = generateApplicationNo();
  const newBooking: Booking = {
    ...booking,
    id: uuidv4(),
    applicationNo
  };
  saveToLocalStorage('bookings', [...allBookings, newBooking]);
  
  // Update membership bookings
  const membership = getMembershipById(booking.membershipId);
  if (membership) {
    const updatedMembership = {
      ...membership,
      bookings: [...membership.bookings, newBooking]
    };
    
    updateMembership(updatedMembership);
  }
  
  return newBooking;
};

export const updateBooking = (booking: Booking): Booking => {
  const allBookings = getAllBookings();
  const updatedBookings = allBookings.map(b => b.id === booking.id ? booking : b);
  saveToLocalStorage('bookings', updatedBookings);
  
  // Update membership bookings
  const membership = getMembershipById(booking.membershipId);
  if (membership) {
    const updatedMembership = {
      ...membership,
      bookings: membership.bookings.map(b => b.id === booking.id ? booking : b)
    };
    
    updateMembership(updatedMembership);
  }
  
  return booking;
};

export const deleteBooking = (id: string): void => {
  const allBookings = getAllBookings();
  const bookingToDelete = allBookings.find(booking => booking.id === id);
  
  if (bookingToDelete) {
    // Update membership bookings
    const membership = getMembershipById(bookingToDelete.membershipId);
    if (membership) {
      const updatedMembership = {
        ...membership,
        bookings: membership.bookings.filter(b => b.id !== id)
      };
      
      updateMembership(updatedMembership);
    }
  }
  
  const filteredBookings = allBookings.filter(booking => booking.id !== id);
  saveToLocalStorage('bookings', filteredBookings);
};