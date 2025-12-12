import React, { useState } from 'react';
import LentraV2Dashboard from './components/LentraV2Dashboard';
import LentraPFLCDLDashboard from './components/LentraPFLCDLDashboard';

const PRODUCTS = {
  LENTRA_V2: 'lentra_v2',
  LENTRA_LOS: 'lentra_los',
};

const AnalyticsDashboard = () => {
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS.LENTRA_V2);

  const handleProductChange = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Product Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Type</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleProductChange(PRODUCTS.LENTRA_V2)}
              className={`px-6 py-2 rounded-full font-medium transition-all cursor-pointer ${
                selectedProduct === PRODUCTS.LENTRA_V2
                  ? 'bg-[#3a9391] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Lentra V2
            </button>
            <button
              onClick={() => handleProductChange(PRODUCTS.LENTRA_LOS)}
              className={`px-6 py-2 rounded-full font-medium transition-all cursor-pointer ${
                selectedProduct === PRODUCTS.LENTRA_LOS
                  ? 'bg-[#3a9391] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Lentra PFL CDL
            </button>
          </div>
        </div>

        {/* Render Selected Product Dashboard */}
        {selectedProduct === PRODUCTS.LENTRA_V2 && <LentraV2Dashboard />}
        {selectedProduct === PRODUCTS.LENTRA_LOS && <LentraPFLCDLDashboard />}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;