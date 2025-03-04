import React, { useState, useEffect } from 'react';
import { Search, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { format } from 'date-fns';
import MainLayout from '../components/Layout/MainLayout';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Modal from '../components/UI/Modal';
import Select from '../components/UI/Select';
import Alert from '../components/UI/Alert';
import Badge from '../components/UI/Badge';
import { Transaction, Membership } from '../types';
import { 
  getAllTransactions, 
  getAllMemberships,
  addTransaction,
  initializeLocalStorage
} from '../data/mockData';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Transaction>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    initializeLocalStorage();
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    try {
      const loadedTransactions = getAllTransactions();
      const loadedMemberships = getAllMemberships();
      setTransactions(loadedTransactions);
      setMemberships(loadedMemberships);
    } catch (error) {
      console.error('Error loading data:', error);
      setAlertMessage({ type: 'error', message: 'Failed to load data' });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(
    (transaction) => {
      const membership = memberships.find(m => m.id === transaction.membershipId);
      const memberName = membership?.officerName || '';
      
      return (
        memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
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
    
    if (!formData.membershipId) {
      errors.membershipId = 'Member is required';
    }
    
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      errors.amount = 'Amount must be a positive number';
    }
    
    if (!formData.type) {
      errors.type = 'Transaction type is required';
    }
    
    if (!formData.description) {
      errors.description = 'Description is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddTransaction = () => {
    if (!validateForm()) return;
    
    try {
      const membership = memberships.find(m => m.id === formData.membershipId);
      
      if (!membership) {
        setAlertMessage({ type: 'error', message: 'Membership not found' });
        return;
      }
      
      // Check if member has enough balance for debit
      if (formData.type === 'debit' && membership.balance < Number(formData.amount)) {
        setAlertMessage({ type: 'error', message: 'Insufficient balance in membership card' });
        return;
      }
      
      const newTransaction = addTransaction({
        membershipId: formData.membershipId as string,
        amount: Number(formData.amount),
        type: formData.type as 'credit' | 'debit',
        description: formData.description as string
      });
      
      setTransactions(prev => [...prev, newTransaction]);
      setAlertMessage({ type: 'success', message: 'Transaction added successfully' });
      setIsAddModalOpen(false);
      setFormData({});
    } catch (error) {
      console.error('Error adding transaction:', error);
      setAlertMessage({ type: 'error', message: 'Failed to add transaction' });
    }
  };

  const getMemberName = (membershipId: string): string => {
    const membership = memberships.find(m => m.id === membershipId);
    return membership?.officerName || 'Unknown';
  };

  const columns = [
    { 
      header: 'Date', 
      accessor: (transaction: Transaction) => format(new Date(transaction.date), 'dd MMM yyyy, HH:mm')
    },
    { 
      header: 'Member', 
      accessor: (transaction: Transaction) => getMemberName(transaction.membershipId)
    },
    { 
      header: 'Type', 
      accessor: (transaction: Transaction) => (
        <div className="flex items-center">
          {transaction.type === 'credit' ? (
            <>
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <Badge variant="success">Credit</Badge>
            </>
          ) : (
            <>
              <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
              <Badge variant="danger">Debit</Badge>
            </>
          )}
        </div>
      )
    },
    { header: 'Description', accessor: 'description' },
    { 
      header: 'Amount', 
      accessor: (transaction: Transaction) => (
        <span className={transaction.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
          {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
        </span>
      )
    },
  ];

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage membership transactions</p>
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
            New Transaction
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
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredTransactions}
          keyExtractor={(transaction) => transaction.id}
          isLoading={isLoading}
          emptyMessage="No transactions found"
        />
      </div>

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Transaction"
      >
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
            label="Transaction Type"
            name="type"
            value={formData.type || ''}
            onChange={handleInputChange}
            options={[
              { value: '', label: 'Select Type' },
              { value: 'credit', label: 'Credit (Add Funds)' },
              { value: 'debit', label: 'Debit (Charge)' }
            ]}
            error={formErrors.type}
            fullWidth
          />
          
          <Input
            label="Amount (₹)"
            name="amount"
            type="number"
            value={formData.amount?.toString() || ''}
            onChange={handleInputChange}
            error={formErrors.amount}
            fullWidth
          />
          
          <Input
            label="Description"
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            error={formErrors.description}
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
              onClick={handleAddTransaction}
            >
              Add Transaction
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default Transactions;