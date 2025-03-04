import React, { useState, useEffect } from 'react';
import { Search, Download, Eye, Printer } from 'lucide-react';
import { format } from 'date-fns';
import MainLayout from '../components/Layout/MainLayout';
import Table from '../components/UI/Table';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import Badge from '../components/UI/Badge';
import { Booking, Membership } from '../types';
import { 
  getAllBookings, 
  getAllMemberships,
  initializeLocalStorage
} from '../data/mockData';

const Invoices: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [currentMembership, setCurrentMembership] = useState<Membership | null>(null);

  useEffect(() => {
    initializeLocalStorage();
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    try {
      const loadedBookings = getAllBookings();
      const loadedMemberships = getAllMemberships();
      
      // Only include confirmed bookings with paid status
      const confirmedBookings = loadedBookings.filter(
        booking => booking.status === 'confirmed' && booking.paymentStatus === 'Paid'
      );
      
      setBookings(confirmedBookings);
      setMemberships(loadedMemberships);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.applicationNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openViewModal = (booking: Booking) => {
    setCurrentBooking(booking);
    const membership = memberships.find(m => m.id === booking.membershipId);
    setCurrentMembership(membership || null);
    setIsViewModalOpen(true);
  };

  const handlePrintInvoice = () => {
    const invoiceContent = document.getElementById('invoice-content');
    if (invoiceContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice #${currentBooking?.applicationNo}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .invoice-container { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #eee; }
                .invoice-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
                .invoice-title { font-size: 24px; font-weight: bold; color: #333; }
                .invoice-details { margin-bottom: 20px; }
                .invoice-details-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
                .invoice-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .invoice-table th, .invoice-table td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; }
                .invoice-total { text-align: right; margin-top: 20px; }
                .invoice-total-row { margin-bottom: 5px; }
                .invoice-total-amount { font-size: 18px; font-weight: bold; }
                .invoice-footer { margin-top: 30px; text-align: center; font-size: 12px; color: #777; }
                @media print {
                  body { -webkit-print-color-adjust: exact; }
                }
              </style>
            </head>
            <body>
              ${invoiceContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
  };

  const columns = [
    { header: 'Invoice No.', accessor: 'applicationNo' },
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
      header: 'Payment Status', 
      accessor: (booking: Booking) => (
        <Badge variant="success">Paid</Badge>
      )
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
            title="View Invoice"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h1>
          <p className="text-gray-600 dark:text-gray-400">View and print invoices for confirmed bookings</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredBookings}
          keyExtractor={(booking) => booking.id}
          isLoading={isLoading}
          emptyMessage="No invoices found"
        />
      </div>

      {/* View Invoice Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Invoice Details"
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button
              variant="primary"
              onClick={handlePrintInvoice}
            >
              <Printer className="w-5 h-5 mr-2" />
              Print Invoice
            </Button>
          </div>
          
          <div id="invoice-content" className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center">
                  <img 
                    src="https://www.sporti.ksp.gov.in/static/media/main_logo.512f9c8f27562f3e330c.jpg" 
                    alt="SPORTi Logo" 
                    className="h-12"
                  />
                  <div className="ml-2">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">SPORTi</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Karnataka State Police</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Karnataka State Police Headquarters<br />
                  Nrupathunga Road, Bangalore - 560001<br />
                  Karnataka, India
                </p>
              </div>
              
              <div className="text-right">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">INVOICE</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Invoice #: {currentBooking?.applicationNo}<br />
                  Date: {currentBooking ? format(new Date(), 'dd MMM yyyy') : ''}<br />
                  Payment Status: <span className="text-green-600 dark:text-green-400 font-medium">Paid</span>
                </p>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Bill To:</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {currentBooking?.username}<br />
                {currentBooking?.officerDesignation}<br />
                ID Card: {currentMembership?.cardNumber}<br />
                Email: {currentBooking?.email}
              </p>
            </div>
            
            <table className="w-full mb-8">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 text-gray-900 dark:text-white">Description</th>
                  <th className="text-left py-3 px-2 text-gray-900 dark:text-white">Date</th>
                  <th className="text-right py-3 px-2 text-gray-900 dark:text-white">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-2 text-gray-600 dark:text-gray-400">
                    {currentBooking?.serviceName}
                    {currentBooking?.serviceType === 'stay' && (
                      <div className="text-sm mt-1">
                        {currentBooking.sporti}, {currentBooking.roomType} - Room {currentBooking.selectedRoomNumber}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-2 text-gray-600 dark:text-gray-400">
                    {currentBooking?.serviceType === 'stay' 
                      ? `${currentBooking.checkIn} to ${currentBooking.checkOut}`
                      : currentBooking?.eventdate
                    }
                  </td>
                  <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">
                    ₹{currentBooking?.totalCost}
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="text-gray-900 dark:text-white">₹{currentBooking?.totalCost}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                  <span className="text-gray-900 dark:text-white">₹0.00</span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Total:</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">₹{currentBooking?.totalCost}</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
              <p>Payment processed from SPORTi Membership Card #{currentMembership?.cardNumber}</p>
              <p className="mt-2">Thank you for using SPORTi services!</p>
            </div>
          </div>
          
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
    </MainLayout>
  );
};

export default Invoices;