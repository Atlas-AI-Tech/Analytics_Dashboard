import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ title = "Analytics Dashboard for Atlas AI 🚀" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isFieldwisePage = location.pathname === '/fieldwise-analytics';

  return (
    <div className="flex justify-between items-center h-[70px] px-20 bg-white shadow-[0_4px_16px_0_rgba(0,0,0,0.10)] z-30 relative">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <button 
        onClick={() => navigate(isFieldwisePage ? '/' : '/fieldwise-analytics')} 
        className="px-6 h-[40px] cursor-pointer py-2 bg-[#3a9391] text-white rounded-lg font-medium hover:bg-[#3a9391] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
      >
        {isFieldwisePage ? (
          <>
            <span>←</span>
            Back to Main Analytics
          </>
        ) : (
          'View Fieldwise Analytics'
        )}
      </button>
    </div>
  );
};

export default Navbar;
