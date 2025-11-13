import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ title = "Analytics Dashboard for Atlas AI 🚀" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isFieldwisePage = location.pathname === '/fieldwise-analytics';
  const isLatencyTrackerPage = location.pathname === '/api-latency-tracker';
  const showBackButton = isFieldwisePage || isLatencyTrackerPage;

  return (
    <div className="flex justify-between items-center h-[70px] px-20 bg-white shadow-[0_4px_16px_0_rgba(0,0,0,0.10)] z-30 relative">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <div className="flex items-center gap-3">
        {showBackButton ? (
          <button 
            onClick={() => navigate('/')} 
            className="px-6 h-[40px] cursor-pointer py-2 bg-[#3a9391] text-white rounded-lg font-medium hover:bg-[#3a9391] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <span>←</span>
            Back to Main Analytics
          </button>
        ) : (
          <>
            <button 
              onClick={() => navigate('/api-latency-tracker')} 
              className="px-6 h-[40px] cursor-pointer py-2 bg-[#3a9391] text-white rounded-lg font-medium hover:bg-[#3a9391] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              Api Latency Tracker
            </button>
            <button 
              onClick={() => navigate('/fieldwise-analytics')} 
              className="px-6 h-[40px] cursor-pointer py-2 bg-[#3a9391] text-white rounded-lg font-medium hover:bg-[#3a9391] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              View Fieldwise Analytics
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
