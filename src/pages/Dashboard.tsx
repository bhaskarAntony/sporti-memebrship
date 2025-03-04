import React, { useEffect } from 'react';
import { 
  BarChart as BarChartIcon, 
  Users, 
  CreditCard, 
  Calendar, 
  TrendingUp,
  DollarSign
} from 'lucide-react';
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
  Cell,
  LineChart,
  Line
} from 'recharts';
import MainLayout from '../components/Layout/MainLayout';
import StatCard from '../components/Dashboard/StatCard';
import ChartCard from '../components/Dashboard/ChartCard';
import { getDashboardStats, initializeLocalStorage } from '../data/mockData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard: React.FC = () => {
  useEffect(() => {
    initializeLocalStorage();
  }, []);

  const stats = getDashboardStats();
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const revenueData = months.map((month, index) => ({
    name: month,
    revenue: stats.monthlyRevenue[index] || 0
  }));

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome to the SPORTi Admin Panel</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Members"
          value={stats.totalMembers}
          icon={<Users className="h-6 w-6 text-primary-600 dark:text-primary-500" />}
          change={{ value: 12, isPositive: true }}
        />
        
        <StatCard
          title="Active Memberships"
          value={stats.activeMembers}
          icon={<CreditCard className="h-6 w-6 text-primary-600 dark:text-primary-500" />}
          change={{ value: 8, isPositive: true }}
        />
        
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={<Calendar className="h-6 w-6 text-primary-600 dark:text-primary-500" />}
          change={{ value: 5, isPositive: true }}
        />
        
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6 text-primary-600 dark:text-primary-500" />}
          change={{ value: 15, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Monthly Revenue">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#0088FE" 
                activeDot={{ r: 8 }} 
                name="Revenue" 
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard title="Revenue by Service">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.revenueByService}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
              <Legend />
              <Bar dataKey="value" fill="#0088FE" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChartCard title="Service Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.serviceDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {stats.serviceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [value, props.payload.name]} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard title="Membership Types">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.membershipTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {stats.membershipTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [value, props.payload.name]} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard title="Booking Status">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.bookingStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {stats.bookingStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [value, props.payload.name]} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </MainLayout>
  );
};

export default Dashboard;