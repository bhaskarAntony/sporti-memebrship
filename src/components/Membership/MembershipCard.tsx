import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Membership, User } from '../../types';
import { format } from 'date-fns';

interface MembershipCardProps {
  membership: Membership;
  user: User;
}

const MembershipCard: React.FC<MembershipCardProps> = ({ membership, user }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl overflow-hidden shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <img 
                src="https://www.sporti.ksp.gov.in/static/media/main_logo.512f9c8f27562f3e330c.jpg" 
                alt="SPORTi Logo" 
                className="h-10 bg-white rounded-md p-1"
              />
              <div className="ml-2">
                <h2 className="text-xl font-bold text-white">SPORTi</h2>
                <p className="text-xs text-white opacity-80">Karnataka State Police</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-white opacity-80">Membership ID</p>
              <p className="text-lg font-semibold text-white">{membership.cardNumber}</p>
            </div>
          </div>
          <div className="bg-white p-2 rounded-lg">
            <QRCodeSVG value={membership.qrCode} size={80} />
          </div>
        </div>
        
        <div className="mt-6">
          <p className="text-sm text-white opacity-80">Member Name</p>
          <p className="text-lg font-semibold text-white">{user.name}</p>
        </div>
        
        <div className="mt-4 flex justify-between">
          <div>
            <p className="text-sm text-white opacity-80">Designation</p>
            <p className="text-md font-medium text-white">{user.designation}</p>
          </div>
          <div>
            <p className="text-sm text-white opacity-80">ID Card No.</p>
            <p className="text-md font-medium text-white">{user.idCardNo}</p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between">
          <div>
            <p className="text-sm text-white opacity-80">Valid From</p>
            <p className="text-md font-medium text-white">{format(new Date(membership.startDate), 'dd MMM yyyy')}</p>
          </div>
          <div>
            <p className="text-sm text-white opacity-80">Valid Until</p>
            <p className="text-md font-medium text-white">{format(new Date(membership.endDate), 'dd MMM yyyy')}</p>
          </div>
        </div>
        
        <div className="mt-6 bg-white bg-opacity-20 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-white opacity-80">Current Balance</p>
              <p className="text-xl font-bold text-white">₹{membership.balance.toFixed(2)}</p>
            </div>
            <div className="bg-white px-3 py-1 rounded-full">
              <p className="text-sm font-medium text-primary-700 uppercase">{membership.membershipType}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipCard;