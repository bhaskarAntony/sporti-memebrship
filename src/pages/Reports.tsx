import React, { useState, useEffect } from 'react';
import { Download, Filter } from 'lucide-react';
import { format } from 'date-fns';
import MainLayout from '../components/Layout/MainLayout';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Select from '../components/UI/Select';
import Table from '../components/UI/Table';
import Tabs from '../components/UI/Tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  getAllMemberships, 
  getAllBookings, 
  getAllTransactions,
  initializeLocalStorage
} from '../data/mockData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Reports: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState('all');
  const [reportType, setReportType] = useState('memberships');

  useEffect(() => {
    initializeLocalStorage();
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    try {
      const loadedMemberships = getAllMemberships();
      const loadedBookings = getAllBookings();
      const loadedTransactions = getAllTransactions();
      
      setMemberships(loadedMemberships);
      setBookings(loadedBookings);
      setTransactions(loadedTransactions);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterDataByTime = (data: any[]) => {
    if (timeFilter === 'all') return data;
    
    const now = new Date();
    let startDate: Date;
    
    switch (timeFilter) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        return data;
    }
    
    return data.filter(item => {
      const itemDate = new Date(item.createdAt || item.date || item.checkIn);
      return itemDate >= startDate;
    });
  };

  // Membership Reports
  const filteredMemberships = filterDataByTime(memberships);
  
  const membershipTypeData = [
    { name: 'Monthly', value: filteredMemberships.filter(m => m.membershipType === 'monthly').length },
    { name: 'Yearly', value: filteredMemberships.filter(m => m.membershipType === 'yearly').length }
  ];
  
  const membershipStatusData = [
    { name: 'Active', value: filteredMemberships.filter(m => m.status === 'active').length },
    { name: 'Expired', value: filteredMemberships.filter(m => m.status === 'expired').length },
    { name: 'Pending', value: filteredMemberships.filter(m => m.status === 'pending').length }
  ];

  // Booking Reports
  const filteredBookings = filterDataByTime(bookings);
  
  const bookingStatusData = [
    { name: 'Confirmed', value: filteredBookings.filter(b => b.status === 'confirmed').length },
    { name: 'Pending', value: filteredBookings.filter(b => b.status === 'pending').length },
    { name: 'Rejected', value: filteredBookings.filter(b => b.status === 'rejected').length }
  ];
  
  const bookingsByService = filteredBookings.reduce((acc: any, booking) => {
    const { serviceName } = booking;
    if (!acc[serviceName]) {
      acc[serviceName] = 0;
    }
    acc[serviceName]++;
    return acc;
  }, {});
  
  const bookingsByServiceData = Object.keys(bookingsByService).map(service => ({
    name: service,
    value: bookingsByService[service]
  }));
  
  const revenueByService = filteredBookings.reduce((acc: any, booking) => {
    const { serviceName, totalCost } = booking;
    if (!acc[serviceName]) {
      acc[serviceName] = 0;
    }
    acc[serviceName] += Number(totalCost);
    return acc;
  }, {});
  
  const revenueByServiceData = Object.keys(revenueByService).map(service => ({
    name: service,
    value: revenueByService[service]
  }));

  // Transaction Reports
  const filteredTransactions = filterDataByTime(transactions);
  
  const totalCredits = filteredTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalDebits = filteredTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const transactionTypeData = [
    { name: 'Credits', value: totalCredits },
    { name: 'Debits', value: totalDebits }
  ];
  
  // Group transactions by date for timeline chart
  const transactionsByDate = filteredTransactions.reduce((acc: any, transaction) => {
    const date = format(new Date(transaction.date), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = { date, credits: 0, debits: 0 };
    }
    
    if (transaction.type === 'credit') {
      acc[date].credits += transaction.amount;
    } else {
      acc[date].debits += transaction.amount;
    }
    
    return acc;
  }, {});
  
  const transactionTimelineData = Object.values(transactionsByDate).sort((a: any, b: any) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Membership Report Table
  const membershipColumns = [
    { header: 'Card Number', accessor: 'cardNumber' },
    { header: 'Officer Name', accessor: 'officerName' },
    { header: 'Type', accessor: 'membershipType' },
    { header: 'Status', accessor: 'status' },
    { header: 'Balance', accessor: (m: any) => `₹${m.balance.toFixed(2)}` },
    { 
      header: 'Valid Until', 
      accessor: (m: any) => format(new Date(m.endDate), 'dd MMM yyyy')
    },
  ];

  // Booking Report Table
  const bookingColumns = [
    { header: 'Application No.', accessor: 'applicationNo' },
    { header: 'Officer Name', accessor: 'username' },
    { header: 'Service', accessor: 'serviceName' },
    { 
      header: 'Date', 
      accessor: (b: any) => {
        if (b.serviceType === 'stay') {
          return `${format(new Date(b.checkIn), 'dd MMM yyyy')} - ${format(new Date(b.checkOut), 'dd MMM yyyy')}`;
        }
        return format(new Date(b.eventdate), 'dd MMM yyyy');
      }
    },
    { header: 'Status', accessor: 'status' },
    { header: 'Amount', accessor: (b: any) => `₹${b.totalCost}` },
  ];

  // Transaction Report Table
  const transactionColumns = [
    { 
      header: 'Date', 
      accessor: (t: any) => format(new Date(t.date), 'dd MMM yyyy, HH:mm')
    },
    { 
      header: 'Member', 
      accessor: (t: any) => {
        const membership = memberships.find(m => m.id === t.membershipId);
        return membership?.officerName || 'Unknown';
      }
    },
    { header: 'Type', accessor: 'type' },
    { header: 'Description', accessor: 'description' },
    { 
      header: 'Amount', 
      accessor: (t: any) => `₹${t.amount.toFixed(2)}`
    },
  ];

  const handleExportCSV = () => {
    let data: any[] = [];
    let headers: string[] = [];
    let filename = '';
    
    switch (reportType) {
      case 'memberships':
        data = filteredMemberships;
        headers = ['Card Number', 'Officer Name', 'Type', 'Status', 'Balance', 'Valid Until'];
        filename = 'membership-report.csv';
        break;
      case 'bookings':
        data = filteredBookings;
        headers = ['Application No.', 'Officer Name', 'Service', 'Date', 'Status', 'Amount'];
        filename = 'booking-report.csv';
        break;
      case 'transactions':
        data = filteredTransactions;
        headers = ['Date', 'Member', 'Type', 'Description', 'Amount'];
        filename = 'transaction-report.csv';
        break;
    }
    
    // Simple CSV export (in a real app, this would be more sophisticated)
    const csvContent = [
      headers.join(','),
      ...data.map(item => {
        switch (reportType) {
          case 'memberships':
            return [
              item.cardNumber,
              item.officerName,
              item.membershipType,
              item.status,
              `₹${item.balance.toFixed(2)}`,
              format(new Date(item.endDate), 'dd MMM yyyy')
            ].join(',');
          case 'bookings':
            return [
              item.applicationNo,
              item.username,
              item.serviceName,
              item.serviceType === 'stay' 
                ? `${format(new Date(item.checkIn), 'dd MMM yyyy')} - ${format(new Date(item.checkOut), 'dd MMM yyyy')}`
                : format(new Date(item.eventdate), 'dd MMM yyyy'),
              item.status,
              `₹${item.totalCost}`
            ].join(',');
          case 'transactions':
            const membership = memberships.find(m => m.id === item.membershipId);
            return [
              format(new Date(item.date), 'dd MMM yyyy, HH:mm'),
              membership?.officerName || 'Unknown',
              item.type,
              item.description,
              `₹${item.amount.toFixed(2)}`
            ].join(',');
          default:
            return '';
        }
      })
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderMembershipReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Membership Types">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={membershipTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {membershipTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [value, props.payload.name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card title="Membership Status">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={membershipStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {membershipStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [value, props.payload.name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      <Card title="Membership Details">
        <Table
          columns={membershipColumns}
          data={filteredMemberships}
          keyExtractor={(m) => m.id}
          isLoading={isLoading}
          emptyMessage="No membership data available"
        />
      </Card>
    </div>
  );

  const renderBookingReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Booking Status">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [value, props.payload.name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card title="Bookings by Service">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingsByServiceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {bookingsByServiceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [value, props.payload.name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      <Card title="Revenue by Service">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueByServiceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
              <Legend />
              <Bar dataKey="value" fill="#0088FE" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <Card title="Booking Details">
        <Table
          columns={bookingColumns}
          data={filteredBookings}
          keyExtractor={(b) => b.id}
          isLoading={isLoading}
          emptyMessage="No booking data available"
        />
      </Card>
    </div>
  );

  const renderTransactionReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Transaction Summary">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={transactionTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#00C49F" /> {/* Credits */}
                  <Cell fill="#FF8042" /> {/* Debits */}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card title="Transaction Timeline">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transactionTimelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, '']} />
                <Legend />
                <Bar dataKey="credits" fill="#00C49F" name="Credits" />
                <Bar dataKey="debits" fill="#FF8042" name="Debits" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      <Card title="Transaction Details">
        <Table
          columns={transactionColumns}
          data={filteredTransactions}
          keyExtractor={(t) => t.id}
          isLoading={isLoading}
          emptyMessage="No transaction data available"
        />
      </Card>
    </div>
  );

  const tabContent = [
    {
      id: 'memberships',
      label: 'Membership Report',
      content: renderMembershipReport(),
    },
    {
      id: 'bookings',
      label: 'Booking Report',
      content: renderBookingReport(),
    },
    {
      id: 'transactions',
      label: 'Transaction Report',
      content: renderTransactionReport(),
    },
  ];

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">View and export detailed reports</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <Select
            name="timeFilter"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Time' },
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'Last 7 Days' },
              { value: 'month', label: 'Last 30 Days' },
              { value: 'year', label: 'Last Year' }
            ]}
            className="w-full sm:w-40"
          />
          
          <Button
            variant="primary"
            onClick={handleExportCSV}
          >
            <Download className="w-5 h-5 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <Tabs 
          tabs={tabContent} 
          defaultTab="memberships"
        />
      </div>
    </MainLayout>
  );
};

export default Reports;