import React, { useState, useEffect } from 'react';
import { Edit, Trash, Plus, Search } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Modal from '../components/UI/Modal';
import Select from '../components/UI/Select';
import Alert from '../components/UI/Alert';
import Badge from '../components/UI/Badge';
import { Service } from '../types';
import { getAllServices, initializeLocalStorage } from '../data/mockData';

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    initializeLocalStorage();
    loadServices();
  }, []);

  const loadServices = () => {
    setIsLoading(true);
    try {
      const loadedServices = getAllServices();
      setServices(loadedServices);
    } catch (error) {
      console.error('Error loading services:', error);
      setAlertMessage({ type: 'error', message: 'Failed to load services' });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openViewModal = (service: Service) => {
    setCurrentService(service);
    setIsViewModalOpen(true);
  };

  const getServiceTypeBadge = (type: string) => {
    switch (type) {
      case 'stay':
        return <Badge variant="primary">Stay</Badge>;
      case 'venue':
        return <Badge variant="info">Venue</Badge>;
      case 'dining':
        return <Badge variant="warning">Dining</Badge>;
      case 'sports':
        return <Badge variant="success">Sports</Badge>;
      case 'fitness':
        return <Badge variant="danger">Fitness</Badge>;
      case 'entertainment':
        return <Badge variant="secondary">Entertainment</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Services</h1>
          <p className="text-gray-600 dark:text-gray-400">Browse available SPORTi services</p>
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
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card key={service.id} className="overflow-hidden flex flex-col h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-2 right-2">
                    {getServiceTypeBadge(service.type)}
                  </div>
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{service.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{service.description}</p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">₹{service.cost}</span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => openViewModal(service)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredServices.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No services found matching your search.</p>
          </div>
        )}
      </div>

      {/* View Service Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={currentService?.name || 'Service Details'}
      >
        <div className="space-y-4">
          {currentService && (
            <>
              <div className="relative h-64 overflow-hidden rounded-lg">
                <img
                  src={currentService.image}
                  alt={currentService.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  {getServiceTypeBadge(currentService.type)}
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{currentService.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{currentService.description}</p>
                
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">₹{currentService.cost}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Booking Information</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  To book this service, please use the Bookings section in the admin panel. Members can also book through their SPORTi mobile application.
                </p>
              </div>
            </>
          )}
          
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

export default Services;