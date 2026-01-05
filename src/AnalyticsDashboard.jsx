import React, { useState } from 'react';
import LentraV2Dashboard from './components/LentraV2Dashboard';
import LentraPFLCDLDashboard from './components/LentraPFLCDLDashboard';
import BulkServiceDashboard from './components/BulkServiceDashboard';
import { SANDBOXES, PRODUCT_TYPES } from './constant';

const AnalyticsDashboard = () => {
  const [selectedSandbox, setSelectedSandbox] = useState(SANDBOXES.LENTRA);
  const [selectedProduct, setSelectedProduct] = useState(PRODUCT_TYPES.PFL_CDL);

  const handleSandboxChange = (sandbox) => {
    setSelectedSandbox(sandbox);

    // When switching to Lentra sandbox, Lentra V2 product should not be selectable
    if (sandbox === SANDBOXES.LENTRA && selectedProduct === PRODUCT_TYPES.LENTRA_V2) {
      setSelectedProduct(PRODUCT_TYPES.PFL_CDL);
    }
  };

  const handleProductChange = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Sandbox Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sandbox Environment</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => handleSandboxChange(SANDBOXES.LENTRA)}
              className={`px-6 py-2 rounded-full font-medium transition-all cursor-pointer ${
                selectedSandbox === SANDBOXES.LENTRA
                  ? 'bg-[#3a9391] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Lentra
            </button>
            <button
              onClick={() => handleSandboxChange(SANDBOXES.ATLAS)}
              className={`px-6 py-2 rounded-full font-medium transition-all cursor-pointer ${
                selectedSandbox === SANDBOXES.ATLAS
                  ? 'bg-[#3a9391] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Atlas
            </button>
          </div>

          {/* Product Selector */}
          <h2 className="text-lg font-semibold text-gray-800 mb-4 mt-8">Product Type</h2>
          <div className="flex flex-wrap gap-3">
          <button
              onClick={() => handleProductChange(PRODUCT_TYPES.PFL_CDL)}
              className={`px-6 py-2 rounded-full font-medium transition-all cursor-pointer ${
                selectedProduct === PRODUCT_TYPES.PFL_CDL
                  ? 'bg-[#3a9391] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Lentra PFL CDL
            </button>
            <button
              onClick={() => handleProductChange(PRODUCT_TYPES.LENTRA_V2)}
              disabled={selectedSandbox === SANDBOXES.LENTRA}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedSandbox === SANDBOXES.LENTRA
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400 opacity-60'
                  : selectedProduct === PRODUCT_TYPES.LENTRA_V2
                    ? 'cursor-pointer bg-[#3a9391] text-white shadow-md'
                    : 'cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Lentra V2
            </button>
            <button
              onClick={() => handleProductChange(PRODUCT_TYPES.BULK_SERVICE)}
              className={`px-6 py-2 rounded-full font-medium transition-all cursor-pointer ${
                selectedProduct === PRODUCT_TYPES.BULK_SERVICE
                  ? 'bg-[#3a9391] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Bulk Service
            </button>
           
          </div>
        </div>

        {/* Render Selected Product Dashboard */}
        {selectedProduct === PRODUCT_TYPES.LENTRA_V2 && (
          <LentraV2Dashboard sandbox={selectedSandbox} />
        )}
        {selectedProduct === PRODUCT_TYPES.PFL_CDL && (
          <LentraPFLCDLDashboard sandbox={selectedSandbox} />
        )}
        {selectedProduct === PRODUCT_TYPES.BULK_SERVICE && (
          <BulkServiceDashboard sandbox={selectedSandbox} />
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;