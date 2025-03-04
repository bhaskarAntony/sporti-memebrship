import React, { useState, useEffect } from 'react';
import { Edit, Trash, Plus, Search, CheckCircle, XCircle, Eye } from 'lucide-react';
import { format } from 'date-fns';
import MainLayout from '../components/Layout/MainLayout';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Modal from '../components/UI/Modal';
import Select from '../components/UI/Select';
import Alert from '../components/UI/Alert';
import Badge from '../components/UI/Badge';
import Tabs from '../components/UI/Tabs';
import { Booking, Membership, Service } from '../types';
import { 
  getAllBookings, 
  getAllMemberships,
  getAllServices,
  getRoomData,
  addBooking,
  updateBooking,
  deleteBooking,
  addTransaction,
  initializeLocalStorage
} from '../data/mockData';

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState<Partial<Booking>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [roomData, setRoomData] = useState<any>(null);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    initializeLocalStorage();
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    try {
      const loadedBookings = getAllBookings();
      const loadedMemberships = getAllMemberships();
      const loadedServices = getAllServices();
      const loadedRoomData = getRoomData();
      
      setBookings(loadedBookings);
      setMemberships(loadedMemberships);
      setServices(loadedServices);
      setRoomData(loadedRoomData);
    } catch (error) {
      console.error('Error loading data:', error);
      setAlertMessage({ type: 'error', message: 'Failed to load data' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedService && selectedService.name === 'Accommodation') {
      const baseCost = selectedService.cost;
      setTotalCost(baseCost * numberOfDays);
    } else if (selectedService) {
      setTotalCost(selectedService.cost);
    } else {
      setTotalCost(0);
    }
  }, [selectedService, numberOfDays]);

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.applicationNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'membershipId') {
      const membership = memberships.find(m => m.id === value);
      if (membership) {
        setSelectedMembership(membership);
        setFormData(prev => ({
          ...prev,
          membershipId: value,
          username: membership.officerName,
          email: membership.officerEmail,
          officerDesignation: membership.officerDesignation,
          phoneNumber: ''
        }));
      }
    } else if (name === 'serviceName') {
      const service = services.find(s => s.name === value);
      if (service) {
        setSelectedService(service);
        setFormData(prev => ({
          ...prev,
          serviceName: value,
          serviceType: service.type
        }));
        
        // Reset room selection if not accommodation
        if (service.name !== 'Accommodation') {
          setSelectedBuilding('');
          setSelectedFloor('');
          setSelectedRoomType('');
          setSelectedRoomNumber('');
          setNumberOfDays(1);
        }
      }
    } else if (name === 'checkIn' || name === 'checkOut') {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      if (name === 'checkIn' && formData.checkOut) {
        const checkIn = new Date(value);
        const checkOut = new Date(formData.checkOut);
        
        if (checkIn && checkOut && checkIn <= checkOut) {
          const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setNumberOfDays(diffDays || 1);
        }
      } else if (name === 'checkOut' && formData.checkIn) {
        const checkIn = new Date(formData.checkIn);
        const checkOut = new Date(value);
        
        if (checkIn && checkOut && checkIn <= checkOut) {
          const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setNumberOfDays(diffDays || 1);
        }
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const building = e.target.value;
    setSelectedBuilding(building);
    setSelectedFloor('');
    setSelectedRoomType('');
    setSelectedRoomNumber('');
    setFormData(prev => ({ ...prev, sporti: building }));
  };

  const handleFloorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const floor = e.target.value;
    setSelectedFloor(floor);
    setSelectedRoomType('');
    setSelectedRoomNumber('');
  };

  const handleRoomTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roomType = e.target.value;
    setSelectedRoomType(roomType);
    setSelectedRoomNumber('');
    setFormData(prev => ({ ...prev, roomType }));
  };

  const handleRoomNumberChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roomNumber = e.target.value;
    setSelectedRoomNumber(roomNumber);
    setFormData(prev => ({ 
      ...prev, 
      selectedRoomNumber: roomNumber,
      roomId: `${selectedBuilding}-${selectedFloor.replace(' ', '-')}-${roomNumber}`
    }));
  };

  const validateForm = (step: number): boolean => {
    const errors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.membershipId) {
        errors.membershipId = 'Member is required';
      }
      
      if (!formData.serviceName) {
        errors.serviceName = 'Service is required';
      }
      
      if (selectedService?.name === 'Accommodation') {
        if (!formData.checkIn) {
          errors.checkIn = 'Check-in date is required';
        }
        
        if (!formData.checkOut) {
          errors.checkOut = 'Check-out date is required';
        }
        
        if (!selectedBuilding) {
          errors.sporti = 'Building is required';
        }
        
        if (!selectedFloor) {
          errors.floor = 'Floor is required';
        }
        
        if (!selectedRoomType) {
          errors.roomType = 'Room type is required';
        }
        
        if (!selectedRoomNumber) {
          errors.roomNumber = 'Room number is required';
        }
      } else {
        if (!formData.eventdate) {
          errors.eventdate = 'Event date is required';
        }
      }
      
      if (!formData.guestType) {
        errors.guestType = 'Guest type is required';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateForm(currentStep)) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleAddBooking = () => {
    if (!validateForm(currentStep) || !selectedMembership) return;
    
    try {
      // Check if member has enough balance
      if (selectedMembership.balance < totalCost) {
        setAlertMessage({ type: 'error', message: 'Insufficient balance in membership card' });
        return;
      }
      
      const newBooking = addBooking({
        ...formData as Omit<Booking, 'id' | 'applicationNo'>,
        paymentStatus: 'Paid',
        totalCost: totalCost.toString(),
        status: 'confirmed',
        rejectionReason: '',
        numberOfDays,
        isCheckout: false
      });
      
      // Add transaction for the booking
      addTransaction({
        membershipId: selectedMembership.id,
        amount: totalCost,
        type: 'debit',
        description: `${formData.serviceName} booking`
      });
      
      setBookings(prev => [...prev, newBooking]);
      setAlertMessage({ type: 'success', message: 'Booking added successfully' });
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error adding booking:', error);
      setAlertMessage({ type: 'error', message: 'Failed to add booking' });
    }
  };

  const handleEditBooking = () => {
    if (!currentBooking) return;
    
    try {
      const updatedBooking = updateBooking({
        ...currentBooking,
        ...formData
      });
      
      setBookings(prev => prev.map(booking => 
        booking.id === updatedBooking.id ? updatedBooking : booking
      ));
      
      setAlertMessage({ type: 'success', message: 'Booking updated successfully' });
      setIsEditModalOpen(false);
      setCurrentBooking(null);
      resetForm();
    } catch (error) {
      console.error('Error updating booking:', error);
      setAlertMessage({ type: 'error', message: 'Failed to update booking' });
    }
  };

  const handleDeleteBooking = () => {
    if (!currentBooking) return;
    
    try {
      deleteBooking(currentBooking.id);
      setBookings(prev => prev.filter(booking => booking.id !== currentBooking.id));
      setAlertMessage({ type: 'success', message: 'Booking deleted successfully' });
      setIsDeleteModalOpen(false);
      setCurrentBooking(null);
    } catch (error) {
      console.error('Error deleting booking:', error);
      setAlertMessage({ type: 'error', message: 'Failed to delete booking' });
    }
  };

  const handleConfirmBooking = () => {
    if (!currentBooking) return;
    
    try {
      const membership = memberships.find(m => m.id === currentBooking.membershipId);
      
      if (!membership) {
        setAlertMessage({ type: 'error', message: 'Membership not found' });
        return;
      }
      
      // Check if member has enough balance
      const cost = Number(currentBooking.totalCost);
      if (membership.balance < cost) {
        setAlertMessage({ type: 'error', message: 'Insufficient balance in membership card' });
        return;
      }
      
      // Update booking status
      const updatedBooking = updateBooking({
        ...currentBooking,
        status: 'confirmed',
        paymentStatus: 'Paid'
      });
      
      // Add transaction for the booking
      addTransaction({
        membershipId: membership.id,
        amount: cost,
        type: 'debit',
        description: `${currentBooking.serviceName} booking`
      });
      
      setBookings(prev => prev.map(booking => 
        booking.id === updatedBooking.id ? updatedBooking : booking
      ));
      
      setAlertMessage({ type: 'success', message: 'Booking confirmed successfully' });
      setIsConfirmModalOpen(false);
      setCurrentBooking(null);
    } catch (error) {
      console.error('Error confirming booking:', error);
      setAlertMessage({ type: 'error', message: 'Failed to confirm booking' });
    }
  };

  const handleRejectBooking = () => {
    if (!currentBooking || !rejectionReason) return;
    
    try {
      const updatedBooking = updateBooking({
        ...currentBooking,
        status: 'rejected',
        rejectionReason
      });
      
      setBookings(prev => prev.map(booking => 
        booking.id === updatedBooking.id ? updatedBooking : booking
      ));
      
      setAlertMessage({ type: 'success', message: 'Booking rejected successfully' });
      setIsRejectModalOpen(false);
      setCurrentBooking(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting booking:', error);
      setAlertMessage({ type: 'error', message: 'Failed to reject booking' });
    }
  };

  const resetForm = () => {
    setFormData({});
    setFormErrors({});
    setCurrentStep(1);
    setSelectedService(null);
    setSelectedMembership(null);
    setSelectedBuilding('');
    setSelectedFloor('');
    setSelectedRoomType('');
    setSelectedRoomNumber('');
    setNumberOfDays(1);
    setTotalCost(0);
  };

  const openEditModal = (booking: Booking) => {
    setCurrentBooking(booking);
    setFormData({ ...booking });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (booking: Booking) => {
    setCurrentBooking(booking);
    setIsDeleteModalOpen(true);
  };

  const openViewModal = (booking: Booking) => {
    setCurrentBooking(booking);
    setIsViewModalOpen(true);
  };

  const openConfirmModal = (booking: Booking) => {
    setCurrentBooking(booking);
    setIsConfirmModalOpen(true);
  };

  const openRejectModal = (booking: Booking) => {
    setCurrentBooking(booking);
    setIsRejectModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const columns = [
    { header: 'Application No.', accessor: 'applicationNo' },
    { header: 'Officer Name', accessor: 'username' },
    { header: 'Service', accessor: 'serviceName' },
    { 
      header: 'Date', 
      accessor: (booking: Booking) => {
        if (booking.serviceType === 'stay') {
          return `${format(new Date(booking.checkIn), 'dd MMM yyyy')} - ${format(new Date(booking.checkOut), 'dd MMM yyyy')}`;
        }
        return format(new Date(booking.eventdate), 'dd MMM yyyy');
      }
    },
    { 
      header: 'Status', 
      accessor: (booking: Booking) => getStatusBadge(booking.status)
    },
    { 
      header: 'Amount', 
      accessor: (booking: Booking) => `₹${booking.totalCost}`
    },
    {
      header: 'Actions',
      accessor: (booking: Booking) => (
        <div className="flex space-x-2">
          <Button
            variant="info"
            size="sm"
            onClick={() => openViewModal(booking)}
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Button>
          
          {booking.status === 'pending' && (
            <>
              <Button
                variant="success"
                size="sm"
                onClick={() => openConfirmModal(booking)}
                title="Confirm"
              >
                <CheckCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => openRejectModal(booking)}
                title="Reject"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </>
          )}
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => openEditModal(booking)}
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => openDeleteModal(booking)}
            title="Delete"
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const renderBookingForm = () => (
    <div className="space-y-4">
      <Select
        label="Member"
        name="membershipId"
        value={formData.membershipId || ''}
        onChange={handleInputChange}
        options={[
          { value: '', label: 'Select Member' },
          ...memberships.map(membership => ({
            value: membership.id,
            label: `${membership.officerName} (${membership.officerDesignation}) - Balance: ₹${membership.balance}`
          }))
        ]}
        error={formErrors.membershipId}
        fullWidth
      />
      
      <Select
        label="Service"
        name="serviceName"
        value={formData.serviceName || ''}
        onChange={handleInputChange}
        options={[
          { value: '', label: 'Select Service' },
          ...services.map(service => ({
            value: service.name,
            label: `${service.name} - ₹${service.cost}`
          }))
        ]}
        error={formErrors.serviceName}
        fullWidth
      />
      
      {selectedService?.name === 'Accommodation' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Check-in Date"
              name="checkIn"
              type="date"
              value={formData.checkIn || ''}
              onChange={handleInputChange}
              error={formErrors.checkIn}
            />
            <Input
              label="Check-out Date"
              name="checkOut"
              type="date"
              value={formData.checkOut || ''}
              onChange={handleInputChange}
              error={formErrors.checkOut}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Building"
              name="sporti"
              value={selectedBuilding}
              onChange={handleBuildingChange}
              options={[
                { value: '', label: 'Select Building' },
                ...Object.keys(roomData || {}).map(building => ({
                  value: building,
                  label: building
                }))
              ]}
              error={formErrors.sporti}
            />
            
            <Select
              label="Floor"
              name="floor"
              value={selectedFloor}
              onChange={handleFloorChange}
              options={[
                { value: '', label: 'Select Floor' },
                ...(selectedBuilding && roomData[selectedBuilding] 
                  ? Object.keys(roomData[selectedBuilding]).map(floor => ({
                      value: floor,
                      label: floor
                    }))
                  : [])
              ]}
              error={formErrors.floor}
              disabled={!selectedBuilding}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Room Type"
              name="roomType"
              value={selectedRoomType}
              onChange={handleRoomTypeChange}
              options={[
                { value: '', label: 'Select Room Type' },
                ...(selectedBuilding && selectedFloor && roomData[selectedBuilding][selectedFloor]
                  ? Object.keys(roomData[selectedBuilding][selectedFloor]).map(type => ({
                      value: type,
                      label: type
                    }))
                  : [])
              ]}
              error={formErrors.roomType}
              disabled={!selectedFloor}
            />
            
            <Select
              label="Room Number"
              name="roomNumber"
              value={selectedRoomNumber}
              onChange={handleRoomNumberChange}
              options={[
                { value: '', label: 'Select Room Number' },
                ...(selectedBuilding && selectedFloor && selectedRoomType && 
                  roomData[selectedBuilding][selectedFloor][selectedRoomType]
                  ? roomData[selectedBuilding][selectedFloor][selectedRoomType].map((room: string) => ({
                      value: room,
                      label: room
                    }))
                  : [])
              ]}
              error={formErrors.roomNumber}
              disabled={!selectedRoomType}
            />
          </div>
          
          <Input
            label="Number of Rooms"
            name="noRooms"
            type="number"
            value={formData.noRooms || '1'}
            onChange={handleInputChange}
            error={formErrors.noRooms}
            fullWidth
          />
        </>
      ) : (
        <Input
          label="Event Date"
          name="eventdate"
          type="date"
          value={formData.eventdate || ''}
          onChange={handleInputChange}
          error={formErrors.eventdate}
          fullWidth
        />
      )}
      
      <Select
        label="Guest Type"
        name="guestType"
        value={formData.guestType || ''}
        onChange={handleInputChange}
        options={[
          { value: '', label: 'Select Guest Type' },
          { value: 'Self', label: 'Self' },
          { value: 'Family', label: 'Family' },
          { value: 'Official', label: 'Official' },
          { value: 'Other', label: 'Other' }
        ]}
        error={formErrors.guestType}
        fullWidth
      />
    </div>
  );

  const renderBookingSummary = () => (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Booking Summary</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Member:</span>
            <span className="font-medium text-gray-900 dark:text-white">{formData.username}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Service:</span>
            <span className="font-medium text-gray-900 dark:text-white">{formData.serviceName}</span>
          </div>
          
          {selectedService?.name === 'Accommodation' ? (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Check-in:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formData.checkIn ? format(new Date(formData.checkIn), 'dd MMM yyyy') : ''}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Check-out:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formData.checkOut ? format(new Date(formData.checkOut), 'dd MMM yyyy') : ''}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                <span className="font-medium text-gray-900 dark:text-white">{numberOfDays} day(s)</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Room:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {`${selectedBuilding}, ${selectedFloor}, ${selectedRoomType} - ${selectedRoomNumber}`}
                </span>
              </div>
            </>
          ) : (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Date:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formData.eventdate ? format(new Date(formData.eventdate), 'dd MMM yyyy') : ''}
              </span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Guest Type:</span>
            <span className="font-medium text-gray-900 dark:text-white">{formData.guestType}</span>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-900 dark:text-white">Total Cost:</span>
              <span className="text-primary-600 dark:text-primary-400">₹{totalCost.toFixed(2)}</span>
            </div>
            
            {selectedMembership && (
              <div className="flex justify-between mt-2">
                <span className="text-gray-600 dark:text-gray-400">Available Balance:</span>
                <span className={`font-medium ${selectedMembership.balance >= totalCost ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  ₹{selectedMembership.balance.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {selectedMembership && selectedMembership.balance < totalCost && (
        <Alert variant="error" title="Insufficient Balance">
          The member does not have enough balance to complete this booking. Please add funds to the membership card before proceeding.
        </Alert>
      )}
    </div>
  );

  const renderBookingDetails = (booking: Booking) => (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Booking Details</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Application No:</span>
            <span className="font-medium text-gray-900 dark:text-white">{booking.applicationNo}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Member:</span>
            <span className="font-medium text-gray-900 dark:text-white">{booking.username}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Designation:</span>
            <span className="font-medium text-gray-900 dark:text-white">{booking.officerDesignation}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Service:</span>
            <span className="font-medium text-gray-900 dark:text-white">{booking.serviceName}</span>
          </div>
          
          {booking.serviceType === 'stay' ? (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Check-in:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {format(new Date(booking.checkIn), 'dd MMM yyyy')}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Check-out:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {format(new Date(booking.checkOut), 'dd MMM yyyy')}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                <span className="font-medium text-gray-900 dark:text-white">{booking.numberOfDays} day(s)</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Room:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {`${booking.sporti}, ${booking.roomType} - ${booking.selectedRoomNumber}`}
                </span>
              </div>
            </>
          ) : (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Date:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {format(new Date(booking.eventdate), 'dd MMM yyyy')}
              </span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Guest Type:</span>
            <span className="font-medium text-gray-900 dark:text-white">{booking.guestType}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Status:</span>
            <span>{getStatusBadge(booking.status)}</span>
          </div>
          
          {booking.status === 'rejected' && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Rejection Reason:</span>
              <span className="font-medium text-red-600 dark:text-red-400">{booking.rejectionReason}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Payment Status:</span>
            <span className="font-medium text-gray-900 dark:text-white">{booking.paymentStatus}</span>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-900 dark:text-white">Total Cost:</span>
              <span className="text-primary-600 dark:text-primary-400">₹{booking.totalCost}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const pendingBookings = filteredBookings.filter(booking => booking.status === 'pending');
  const confirmedBookings = filteredBookings.filter(booking => booking.status === 'confirmed');
  const rejectedBookings = filteredBookings.filter(booking => booking.status === 'rejected');

  const tabContent = [
    {
      id: 'all',
      label: `All (${filteredBookings.length})`,
      content: (
        <Table
          columns={columns}
          data={filteredBookings}
          keyExtractor={(booking) => booking.id}
          isLoading={isLoading}
          emptyMessage="No bookings found"
        />
      ),
    },
    {
      id: 'pending',
      label: `Pending (${pendingBookings.length})`,
      content: (
        <Table
          columns={columns}
          data={pendingBookings}
          keyExtractor={(booking) => booking.id}
          isLoading={isLoading}
          emptyMessage="No pending bookings found"
        />
      ),
    },
    {
      id: 'confirmed',
      label: `Confirmed (${confirmedBookings.length})`,
      content: (
        <Table
          columns={columns}
          data={confirmedBookings}
          keyExtractor={(booking) => booking.id}
          isLoading={isLoading}
          emptyMessage="No confirmed bookings found"
        />
      ),
    },
    {
      id: 'rejected',
      label: `Rejected (${rejectedBookings.length})`,
      content: (
        <Table
          columns={columns}
          data={rejectedBookings}
          keyExtractor={(booking) => booking.id}
          isLoading={isLoading}
          emptyMessage="No rejected bookings found"
        />
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage service bookings</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            variant="primary"
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
          >
            <Plus className="w-5 h-5 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      {alertMessage && (
        <Alert
          variant={alertMessage.type}
          className="mb-4"
        >
          {alertMessage.message}
        </Alert>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs tabs={tabContent} />
      </div>

      {/* Add Booking Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="New Booking"
        size="lg"
      >
        <div className="space-y-4">
          {currentStep === 1 ? (
            renderBookingForm()
          ) : (
            renderBookingSummary()
          )}
          
          <div className="flex justify-between mt-6">
            {currentStep === 2 && (
              <Button
                variant="secondary"
                onClick={handlePrevStep}
              >
                Back
              </Button>
            )}
            
            <div className="ml-auto">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetForm();
                }}
                className="mr-2"
              >
                Cancel
              </Button>
              
              {currentStep === 1 ? (
                <Button
                  variant="primary"
                  onClick={handleNextStep}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleAddBooking}
                  disabled={selectedMembership && selectedMembership.balance < totalCost}
                >
                  Confirm Booking
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Booking Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Booking"
      >
        <div className="space-y-4">
          <Input
            label="Officer Name"
            name="username"
            value={formData.username || ''}
            onChange={handleInputChange}
            disabled
            fullWidth
          />
          
          <Input
            label="Service"
            name="serviceName"
            value={formData.serviceName || ''}
            onChange={handleInputChange}
            disabled
            fullWidth
          />
          
          {formData.serviceType === 'stay' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Check-in Date"
                name="checkIn"
                type="date"
                value={formData.checkIn || ''}
                onChange={handleInputChange}
              />
              <Input
                label="Check-out Date"
                name="checkOut"
                type="date"
                value={formData.checkOut || ''}
                onChange={handleInputChange}
              />
            </div>
          ) : (
            <Input
              label="Event Date"
              name="eventdate"
              type="date"
              value={formData.eventdate || ''}
              onChange={handleInputChange}
              fullWidth
            />
          )}
          
          <Select
            label="Guest Type"
            name="guestType"
            value={formData.guestType || ''}
            onChange={handleInputChange}
            options={[
              { value: 'Self', label: 'Self' },
              { value: 'Family', label: 'Family' },
              { value: 'Official', label: 'Official' },
              { value: 'Other', label: 'Other' }
            ]}
            fullWidth
          />
          
          <Select
            label="Status"
            name="status"
            value={formData.status || ''}
            onChange={handleInputChange}
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'rejected', label: 'Rejected' }
            ]}
            fullWidth
          />
          
          {formData.status === 'rejected' && (
            <Input
              label="Rejection Reason"
              name="rejectionReason"
              value={formData.rejectionReason || ''}
              onChange={handleInputChange}
              fullWidth
            />
          )}
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleEditBooking}
            >
              Update Booking
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Booking Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Booking"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete the booking <span className="font-semibold">#{currentBooking?.applicationNo}</span> for <span className="font-semibold">{currentBooking?.username}</span>? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteBooking}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Booking Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Booking Details"
      >
        <div className="space-y-4">
          {currentBooking && renderBookingDetails(currentBooking)}
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => setIsViewModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Booking Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Booking"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to confirm the booking <span className="font-semibold">#{currentBooking?.applicationNo}</span> for <span className="font-semibold">{currentBooking?.username}</span>?
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            This will deduct <span className="font-semibold">₹{currentBooking?.totalCost}</span> from the member's card balance.
          </p>
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={handleConfirmBooking}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Booking Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject Booking"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to reject the booking <span className="font-semibold">#{currentBooking?.applicationNo}</span> for <span className="font-semibold">{currentBooking?.username}</span>?
          </p>
          <Input
            label="Rejection Reason"
            name="rejectionReason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            fullWidth
          />
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => setIsRejectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleRejectBooking}
              disabled={!rejectionReason}
            >
              Reject
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default Bookings;