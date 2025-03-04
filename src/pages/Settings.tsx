import React, { useState } from 'react';
import { Save } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Select from '../components/UI/Select';
import Alert from '../components/UI/Alert';
import Tabs from '../components/UI/Tabs';
import { useTheme } from '../context/ThemeContext';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // General Settings
  const [organizationName, setOrganizationName] = useState('SPORTi - Karnataka State Police');
  const [adminEmail, setAdminEmail] = useState('admin@sporti.ksp.gov.in');
  const [contactPhone, setContactPhone] = useState('+91 80 2294 3322');
  
  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [bookingNotifications, setBookingNotifications] = useState(true);
  const [paymentNotifications, setPaymentNotifications] = useState(true);
  const [membershipExpiryNotifications, setMembershipExpiryNotifications] = useState(true);
  
  // Membership Settings
  const [monthlyMembershipFee, setMonthlyMembershipFee] = useState('500');
  const [yearlyMembershipFee, setYearlyMembershipFee] = useState('5000');
  const [membershipGracePeriod, setMembershipGracePeriod] = useState('7');
  
  // Booking Settings
  const [maxBookingsPerDay, setMaxBookingsPerDay] = useState('10');
  const [advanceBookingDays, setAdvanceBookingDays] = useState('30');
  const [cancellationPeriodHours, setCancellationPeriodHours] = useState('24');
  
  const handleSaveSettings = (section: string) => {
    setAlertMessage({ 
      type: 'success', 
      message: `${section} settings saved successfully` 
    });
    
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Input
        label="Organization Name"
        value={organizationName}
        onChange={(e) => setOrganizationName(e.target.value)}
        fullWidth
      />
      
      <Input
        label="Admin Email"
        type="email"
        value={adminEmail}
        onChange={(e) => setAdminEmail(e.target.value)}
        fullWidth
      />
      
      <Input
        label="Contact Phone"
        value={contactPhone}
        onChange={(e) => setContactPhone(e.target.value)}
        fullWidth
      />
      
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 dark:text-gray-300">Theme:</span>
        <Select
          value={theme}
          onChange={(e) => toggleTheme()}
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' }
          ]}
          className="w-40"
        />
      </div>
      
      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={() => handleSaveSettings('General')}
        >
          <Save className="w-5 h-5 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-gray-700 dark:text-gray-300">SMS Notifications</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={smsNotifications}
            onChange={() => setSmsNotifications(!smsNotifications)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
        </label>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notification Events</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">New Bookings</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={bookingNotifications}
                onChange={() => setBookingNotifications(!bookingNotifications)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Payments</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={paymentNotifications}
                onChange={() => setPaymentNotifications(!paymentNotifications)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Membership Expiry</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={membershipExpiryNotifications}
                onChange={() => setMembershipExpiryNotifications(!membershipExpiryNotifications)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={() => handleSaveSettings('Notification')}
        >
          <Save className="w-5 h-5 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );

  const renderMembershipSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Monthly Membership Fee (₹)"
          type="number"
          value={monthlyMembershipFee}
          onChange={(e) => setMonthlyMembershipFee(e.target.value)}
        />
        
        <Input
          label="Yearly Membership Fee (₹)"
          type="number"
          value={yearlyMembershipFee}
          onChange={(e) => setYearlyMembershipFee(e.target.value)}
        />
      </div>
      
      <Input
        label="Grace Period After Expiry (Days)"
        type="number"
        value={membershipGracePeriod}
        onChange={(e) => setMembershipGracePeriod(e.target.value)}
        fullWidth
      />
      
      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={() => handleSaveSettings('Membership')}
        >
          <Save className="w-5 h-5 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );

  const renderBookingSettings = () => (
    <div className="space-y-6">
      <Input
        label="Maximum Bookings Per Day"
        type="number"
        value={maxBookingsPerDay}
        onChange={(e) => setMaxBookingsPerDay(e.target.value)}
        fullWidth
      />
      
      <Input
        label="Advance Booking Period (Days)"
        type="number"
        value={advanceBookingDays}
        onChange={(e) => setAdvanceBookingDays(e.target.value)}
        fullWidth
      />
      
      <Input
        label="Cancellation Period (Hours)"
        type="number"
        value={cancellationPeriodHours}
        onChange={(e) => setCancellationPeriodHours(e.target.value)}
        fullWidth
      />
      
      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={() => handleSaveSettings('Booking')}
        >
          <Save className="w-5 h-5 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );

  const tabContent = [
    {
      id: 'general',
      label: 'General',
      content: renderGeneralSettings(),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      content: renderNotificationSettings(),
    },
    {
      id: 'membership',
      label: 'Membership',
      content: renderMembershipSettings(),
    },
    {
      id: 'booking',
      label: 'Booking',
      content: renderBookingSettings(),
    },
  ];

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Configure system settings</p>
      </div>

      {alertMessage && (
        <Alert
          variant={alertMessage.type}
          className="mb-4"
        >
          {alertMessage.message}
        </Alert>
      )}

      <Card>
        <Tabs tabs={tabContent} />
      </Card>
    </MainLayout>
  );
};

export default Settings;