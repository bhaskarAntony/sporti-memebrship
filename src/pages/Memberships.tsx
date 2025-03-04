import React, { useState, useEffect } from 'react';
import { Edit, Trash, Plus, Search, CreditCard, Wallet } from 'lucide-react';
import { format, addMonths, addYears } from 'date-fns';
import MainLayout from '../components/Layout/MainLayout';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Modal from '../components/UI/Modal';
import Select from '../components/UI/Select';
import Alert from '../components/UI/Alert';
import Badge from '../components/UI/Badge';
import MembershipCard from '../components/Membership/MembershipCard';
import { Membership, User } from '../types';
import { 
  getAllMemberships, 
  getAllUsers, 
  getUserById,
  addMembership, 
  updateMembership, 
  deleteMembership,
  addTransaction,
  initializeLocalStorage
} from '../data/mockData';

const Memberships: React.FC = () => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewCardModalOpen, setIsViewCardModalOpen] = useState(false);
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [currentMembership, setCurrentMembership] = useState<Membership | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<Membership>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [fundAmount, setFundAmount] = useState<number>(0);

  useEffect(() => {
    initializeLocalStorage();
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    try {
      const loadedMemberships = getAllMemberships();
      const loadedUsers = getAllUsers();
      setMemberships(loadedMemberships);
      setUsers(loadedUsers);
    } catch (error) {
      console.error('Error loading data:', error);
      setAlertMessage({ type: 'error', message: 'Failed to load data' });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMemberships = memberships.filter(
    (membership) =>
      membership.officerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membership.officerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membership.cardNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'userId') {
      const selectedUser = users.find(user => user.id === value);
      if (selectedUser) {
        setFormData(prev => ({
          ...prev,
          userId: value,
          officerName: selectedUser.name,
          officerEmail: selectedUser.email,
          officerDesignation: selectedUser.designation
        }));
      }
    } else if (name === 'membershipType') {
      const startDate = new Date();
      let endDate;
      
      if (value === 'monthly') {
        endDate = addMonths(startDate, 1);
      } else {
        endDate = addYears(startDate, 1);
      }
      
      setFormData(prev => ({
        ...prev,
        membershipType: value as 'monthly' | 'yearly',
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd')
      }));
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

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const requiredFields = ['userId', 'membershipType', 'balance'];
    
    requiredFields.forEach(field => {
      if (!formData[field as keyof Membership]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });
    
    if (formData.balance && isNaN(Number(formData.balance))) {
      errors.balance = 'Balance must be a number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddMembership = () => {
    if (!validateForm()) return;
    
    try {
      const newMembership = addMembership({
        ...formData as Omit<Membership, 'id' | 'cardNumber' | 'qrCode' | 'createdAt' | 'transactions' | 'bookings'>,
        status: 'active',
        balance: Number(formData.balance)
      });
      
      // Add initial transaction for the balance
      if (newMembership.balance > 0) {
        addTransaction({
          membershipId: newMembership.id,
          amount: newMembership.balance,
          type: 'credit',
          description: 'Initial membership deposit'
        });
      }
      
      setMemberships(prev => [...prev, newMembership]);
      setAlertMessage({ type: 'success', message: 'Membership added successfully' });
      setIsAddModalOpen(false);
      setFormData({});
    } catch (error) {
      console.error('Error adding membership:', error);
      setAlertMessage({ type: 'error', message: 'Failed to add membership' });
    }
  };

  const handleEditMembership = () => {
    if (!validateForm() || !currentMembership) return;
    
    try {
      const updatedMembership = updateMembership({
        ...currentMembership,
        ...formData,
        balance: Number(formData.balance)
      });
      
      setMemberships(prev => prev.map(membership => 
        membership.id === updatedMembership.id ? updatedMembership : membership
      ));
      
      setAlertMessage({ type: 'success', message: 'Membership updated successfully' });
      setIsEditModalOpen(false);
      setCurrentMembership(null);
      setFormData({});
    } catch (error) {
      console.error('Error updating membership:', error);
      setAlertMessage({ type: 'error', message: 'Failed to update membership' });
    }
  };

  const handleDeleteMembership = () => {
    if (!currentMembership) return;
    
    try {
      deleteMembership(currentMembership.id);
      setMemberships(prev => prev.filter(membership => membership.id !== currentMembership.id));
      setAlertMessage({ type: 'success', message: 'Membership deleted successfully' });
      setIsDeleteModalOpen(false);
      setCurrentMembership(null);
    } catch (error) {
      console.error('Error deleting membership:', error);
      setAlertMessage({ type: 'error', message: 'Failed to delete membership' });
    }
  };

  const handleAddFunds = () => {
    if (!currentMembership || fundAmount <= 0) return;
    
    try {
      // Add transaction
      addTransaction({
        membershipId: currentMembership.id,
        amount: fundAmount,
        type: 'credit',
        description: 'Card recharge'
      });
      
      // Refresh memberships
      const updatedMemberships = getAllMemberships();
      setMemberships(updatedMemberships);
      
      setAlertMessage({ type: 'success', message: `₹${fundAmount} added successfully` });
      setIsAddFundsModalOpen(false);
      setFundAmount(0);
    } catch (error) {
      console.error('Error adding funds:', error);
      setAlertMessage({ type: 'error', message: 'Failed to add funds' });
    }
  };

  const openEditModal = (membership: Membership) => {
    setCurrentMembership(membership);
    setFormData({ ...membership });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (membership: Membership) => {
    setCurrentMembership(membership);
    setIsDeleteModalOpen(true);
  };

  const openViewCardModal = (membership: Membership) => {
    setCurrentMembership(membership);
    const user = getUserById(membership.userId);
    setCurrentUser(user || null);
    setIsViewCardModalOpen(true);
  };

  const openAddFundsModal = (membership: Membership) => {
    setCurrentMembership(membership);
    setIsAddFundsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'expired':
        return <Badge variant="danger">Expired</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const columns = [
    { header: 'Card Number', accessor: 'cardNumber' },
    { header: 'Officer Name', accessor: 'officerName' },
    { header: 'Designation', accessor: 'officerDesignation' },
    { 
      header: 'Type', 
      accessor: (membership: Membership) => (
        <Badge variant="info" className="capitalize">{membership.membershipType}</Badge>
      )
    },
    { 
      header: 'Status', 
      accessor: (membership: Membership) => getStatusBadge(membership.status)
    },
    { 
      header: 'Balance', 
      accessor: (membership: Membership) => `₹${membership.balance.toFixed(2)}`
    },
    { 
      header: 'Valid Until', 
      accessor: (membership: Membership) => format(new Date(membership.endDate), 'dd MMM yyyy')
    },
    {
      header: 'Actions',
      accessor: (membership: Membership) => (
        <div className="flex space-x-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => openViewCardModal(membership)}
            title="View Card"
          >
            <CreditCard className="w-4 h-4" />
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={() => openAddFundsModal(membership)}
            title="Add Funds"
          >
            <Wallet className="w-4 h-4" />
          </Button>
          <Button
            variant="info"
            size="sm"
            onClick={() => openEditModal(membership)}
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => openDeleteModal(membership)}
            title="Delete"
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Memberships</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage officer memberships</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            variant="primary"
            onClick={() => {
              setFormData({});
              setFormErrors({});
              setIsAddModalOpen(true);
            }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Membership
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
              placeholder="Search memberships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredMemberships}
          keyExtractor={(membership) => membership.id}
          isLoading={isLoading}
          emptyMessage="No memberships found"
        />
      </div>

      {/* Add Membership Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Membership"
      >
        <div className="space-y-4">
          <Select
            label="Officer"
            name="userId"
            value={formData.userId || ''}
            onChange={handleInputChange}
            options={[
              { value: '', label: 'Select Officer' },
              ...users
                .filter(user => !memberships.some(m => m.userId === user.id))
                .map(user => ({
                  value: user.id,
                  label: `${user.name} (${user.designation})`
                }))
            ]}
            error={formErrors.userId}
            fullWidth
          />
          
          <Select
            label="Membership Type"
            name="membershipType"
            value={formData.membershipType || ''}
            onChange={handleInputChange}
            options={[
              { value: '', label: 'Select Type' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' }
            ]}
            error={formErrors.membershipType}
            fullWidth
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate || ''}
              onChange={handleInputChange}
              error={formErrors.startDate}
              disabled
            />
            <Input
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate || ''}
              onChange={handleInputChange}
              error={formErrors.endDate}
              disabled
            />
          </div>
          
          <Input
            label="Initial Balance (₹)"
            name="balance"
            type="number"
            value={formData.balance?.toString() || ''}
            onChange={handleInputChange}
            error={formErrors.balance}
            fullWidth
          />
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddMembership}
            >
              Create Membership
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Membership Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Membership"
      >
        <div className="space-y-4">
          <Input
            label="Officer Name"
            name="officerName"
            value={formData.officerName || ''}
            onChange={handleInputChange}
            disabled
            fullWidth
          />
          
          <Select
            label="Membership Type"
            name="membershipType"
            value={formData.membershipType || ''}
            onChange={handleInputChange}
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' }
            ]}
            error={formErrors.membershipType}
            fullWidth
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate || ''}
              onChange={handleInputChange}
              error={formErrors.startDate}
            />
            <Input
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate || ''}
              onChange={handleInputChange}
              error={formErrors.endDate}
            />
          </div>
          
          <Select
            label="Status"
            name="status"
            value={formData.status || ''}
            onChange={handleInputChange}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'expired', label: 'Expired' },
              { value: 'pending', label: 'Pending' }
            ]}
            error={formErrors.status}
            fullWidth
          />
          
          <Input
            label="Balance (₹)"
            name="balance"
            type="number"
            value={formData.balance?.toString() || ''}
            onChange={handleInputChange}
            error={formErrors.balance}
            fullWidth
          />
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleEditMembership}
            >
              Update Membership
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Membership Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Membership"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete the membership for <span className="font-semibold">{currentMembership?.officerName}</span>? This action cannot be undone.
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
              onClick={handleDeleteMembership}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Card Modal */}
      <Modal
        isOpen={isViewCardModalOpen}
        onClose={() => setIsViewCardModalOpen(false)}
        title="Membership Card"
        size="md"
      >
        <div className="space-y-4">
          {currentMembership && currentUser && (
            <MembershipCard membership={currentMembership} user={currentUser} />
          )}
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => setIsViewCardModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Funds Modal */}
      <Modal
        isOpen={isAddFundsModalOpen}
        onClose={() => setIsAddFundsModalOpen(false)}
        title="Add Funds"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Add funds to <span className="font-semibold">{currentMembership?.officerName}'s</span> membership card.
          </p>
          
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Balance</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{currentMembership?.balance.toFixed(2)}</p>
          </div>
          
          <Input
            label="Amount to Add (₹)"
            name="fundAmount"
            type="number"
            value={fundAmount.toString()}
            onChange={(e) => setFundAmount(Number(e.target.value))}
            fullWidth
          />
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => setIsAddFundsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={handleAddFunds}
              disabled={fundAmount <= 0}
            >
              Add Funds
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default Memberships;