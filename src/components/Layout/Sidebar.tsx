import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Calendar, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Wallet,
  Receipt,
  Building,
  BarChart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-primary-600 text-white p-2 rounded-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="flex items-center justify-center mb-5 p-2">
            <img 
              src="https://www.sporti.ksp.gov.in/static/media/main_logo.512f9c8f27562f3e330c.jpg" 
              alt="SPORTi Logo" 
              className="h-20"
            />
          </div>
          <ul className="space-y-2 font-medium">
            <li>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-lg ${
                    isActive 
                      ? 'bg-primary-100 dark:bg-primary-700 text-primary-600 dark:text-white' 
                      : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
                onClick={closeSidebar}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="ml-3">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/members" 
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-lg ${
                    isActive 
                      ? 'bg-primary-100 dark:bg-primary-700 text-primary-600 dark:text-white' 
                      : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
                onClick={closeSidebar}
              >
                <Users className="w-5 h-5" />
                <span className="ml-3">Members</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/memberships" 
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-lg ${
                    isActive 
                      ? 'bg-primary-100 dark:bg-primary-700 text-primary-600 dark:text-white' 
                      : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
                onClick={closeSidebar}
              >
                <CreditCard className="w-5 h-5" />
                <span className="ml-3">Memberships</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/bookings" 
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-lg ${
                    isActive 
                      ? 'bg-primary-100 dark:bg-primary-700 text-primary-600 dark:text-white' 
                      : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
                onClick={closeSidebar}
              >
                <Calendar className="w-5 h-5" />
                <span className="ml-3">Bookings</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/services" 
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-lg ${
                    isActive 
                      ? 'bg-primary-100 dark:bg-primary-700 text-primary-600 dark:text-white' 
                      : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
                onClick={closeSidebar}
              >
                <Building className="w-5 h-5" />
                <span className="ml-3">Services</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/transactions" 
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-lg ${
                    isActive 
                      ? 'bg-primary-100 dark:bg-primary-700 text-primary-600 dark:text-white' 
                      : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
                onClick={closeSidebar}
              >
                <Wallet className="w-5 h-5" />
                <span className="ml-3">Transactions</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/reports" 
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-lg ${
                    isActive 
                      ? 'bg-primary-100 dark:bg-primary-700 text-primary-600 dark:text-white' 
                      : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
                onClick={closeSidebar}
              >
                <BarChart className="w-5 h-5" />
                <span className="ml-3">Reports</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/invoices" 
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-lg ${
                    isActive 
                      ? 'bg-primary-100 dark:bg-primary-700 text-primary-600 dark:text-white' 
                      : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
                onClick={closeSidebar}
              >
                <Receipt className="w-5 h-5" />
                <span className="ml-3">Invoices</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/settings" 
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-lg ${
                    isActive 
                      ? 'bg-primary-100 dark:bg-primary-700 text-primary-600 dark:text-white' 
                      : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
                onClick={closeSidebar}
              >
                <Settings className="w-5 h-5" />
                <span className="ml-3">Settings</span>
              </NavLink>
            </li>
            <li>
              <button 
                onClick={logout}
                className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-3">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;