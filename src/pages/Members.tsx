import React, { useState, useEffect } from 'react';
import { Edit, Trash, Plus, Search } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Modal from '../components/UI/Modal';
import Select from '../components/UI/Select';
import Alert from '../components/UI/Alert';
import { User } from '../types';
import { getAllUsers, addUser, updateUser, deleteUser, initializeLocalStorage } from '../data/mockData';

const Members: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    initializeLocalStorage();
    loadUsers();
  }, []);

  const loadUsers = () => {
    setIsLoading(true);
    try {
      const loadedUsers = getAllUsers();
      setUsers(loadedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setAlertMessage({ type: 'error', message: 'Failed to load users' });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const requiredFields = ['name', 'email', 'designation', 'idCardNo'];
    
    requiredFields.forEach(field => {
      if (!formData[field as keyof User]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddUser = () => {
    if (!validateForm()) return;
    
    try {
      const newUser = addUser(formData as User);
      setUsers((prev) => [...prev, newUser]);
      setAlertMessage({ type: 'success', message: 'User added successfully' });
      setIsAddModalOpen(false);
      setFormData({});
    } catch (error) {
      console.error('Error adding user:', error);
      setAlertMessage({ type: 'error', message: 'Failed to add user' });
    }
  };

  const handleEditUser = () => {
    if (!validateForm() || !currentUser) return;
    
    try {
      const updatedUser = updateUser({ ...currentUser, ...formData });
      setUsers((prev) => prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      setAlertMessage({ type: 'success', message: 'User updated successfully' });
      setIsEditModalOpen(false);
      setCurrentUser(null);
      setFormData({});
    } catch (error) {
      console.error('Error updating user:', error);
      setAlertMessage({ type: 'error', message: 'Failed to update user' });
    }
  };

  const handleDeleteUser = () => {
    if (!currentUser) return;
    
    try {
      deleteUser(currentUser.id);
      setUsers((prev) => prev.filter((user) => user.id !== currentUser.id));
      setAlertMessage({ type: 'success', message: 'User deleted successfully' });
      setIsDeleteModalOpen(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      setAlertMessage({ type: 'error', message: 'Failed to delete user' });
    }
  };

  const openEditModal = (user: User) => {
    setCurrentUser(user);
    setFormData({ ...user });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user: User) => {
    setCurrentUser(user);
    setIsDeleteModalOpen(true);
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Designation', accessor: 'designation' },
    { header: 'ID Card No.', accessor: 'idCardNo' },
    { header: 'Status', accessor: 'workingstatus' },
    {
      header: 'Actions',
      accessor: (user: User) => (
        <div className="flex space-x-2">
          <Button
            variant="info"
            size="sm"
            onClick={() => openEditModal(user)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => openDeleteModal(user)}
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Members</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage officer members</p>
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
            Add Member
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
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredUsers}
          keyExtractor={(user) => user.id}
          isLoading={isLoading}
          emptyMessage="No members found"
        />
      </div>

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Member"
      >
        <div className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            error={formErrors.name}
            fullWidth
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleInputChange}
            error={formErrors.email}
            fullWidth
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Mobile Number"
              name="mobilenumber"
              value={formData.mobilenumber || ''}
              onChange={handleInputChange}
              error={formErrors.mobilenumber}
            />
            <Input
              label="Personal Mobile Number"
              name="personalmobilenumber"
              value={formData.personalmobilenumber || ''}
              onChange={handleInputChange}
              error={formErrors.personalmobilenumber}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Designation"
              name="designation"
              value={formData.designation || ''}
              onChange={handleInputChange}
              error={formErrors.designation}
            />
            <Select
              label="Gender"
              name="gender"
              value={formData.gender || ''}
              onChange={handleInputChange}
              options={[
                { value: '', label: 'Select Gender' },
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
              ]}
              error={formErrors.gender}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="ID Card No."
              name="idCardNo"
              value={formData.idCardNo || ''}
              onChange={handleInputChange}
              error={formErrors.idCardNo}
            />
            <Select
              label="Working Status"
              name="workingstatus"
              value={formData.workingstatus || ''}
              onChange={handleInputChange}
              options={[
                { value: '', label: 'Select Status' },
                { value: 'Active', label: 'Active' },
                { value: 'Retired', label: 'Retired' },
                { value: 'On Leave', label: 'On Leave' },
              ]}
              error={formErrors.workingstatus}
            />
          </div>
          <Input
            label="Official Address"
            name="officialaddress"
            value={formData.officialaddress || ''}
            onChange={handleInputChange}
            error={formErrors.officialaddress}
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
              onClick={handleAddUser}
            >
              Add Member
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Member Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Member"
      >
        <div className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            error={formErrors.name}
            fullWidth
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleInputChange}
            error={formErrors.email}
            fullWidth
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Mobile Number"
              name="mobilenumber"
              value={formData.mobilenumber || ''}
              onChange={handleInputChange}
              error={formErrors.mobilenumber}
            />
            <Input
              label="Personal Mobile Number"
              name="personalmobilenumber"
              value={formData.personalmobilenumber || ''}
              onChange={handleInputChange}
              error={formErrors.personalmobilenumber}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Designation"
              name="designation"
              value={formData.designation || ''}
              onChange={handleInputChange}
              error={formErrors.designation}
            />
            <Select
              label="Gender"
              name="gender"
              value={formData.gender || ''}
              onChange={handleInputChange}
              options={[
                { value: '', label: 'Select Gender' },
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
              ]}
              error={formErrors.gender}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="ID Card No."
              name="idCardNo"
              value={formData.idCardNo || ''}
              onChange={handleInputChange}
              error={formErrors.idCardNo}
            />
            <Select
              label="Working Status"
              name="workingstatus"
              value={formData.workingstatus || ''}
              onChange={handleInputChange}
              options={[
                { value: '', label: 'Select Status' },
                { value: 'Active', label: 'Active' },
                { value: 'Retired', label: 'Retired' },
                { value: 'On Leave', label: 'On Leave' },
              ]}
              error={formErrors.workingstatus}
            />
          </div>
          <Input
            label="Official Address"
            name="officialaddress"
            value={formData.officialaddress || ''}
            onChange={handleInputChange}
            error={formErrors.officialaddress}
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
              onClick={handleEditUser}
            >
              Update Member
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Member Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Member"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete the member <span className="font-semibold">{currentUser?.name}</span>? This action cannot be undone.
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
              onClick={handleDeleteUser}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default Members;