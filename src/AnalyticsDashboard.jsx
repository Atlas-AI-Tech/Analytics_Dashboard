import React, { useCallback, useMemo, useState } from 'react';
import LentraV2Dashboard from './components/LentraV2Dashboard';
import LentraPFLCDLDashboard from './components/LentraPFLCDLDashboard';
import BulkServiceDashboard from './components/BulkServiceDashboard';
import { SANDBOXES, PRODUCT_TYPES } from './constant';

const AWS_ENVIRONMENT_KEYS = {
  LENTRA_PRODUCTION: 'lentra_production',
  LENTRA_UAT: 'lentra_uat',
  ATLAS: 'atlas',
};

const AWS_ENVIRONMENTS_IN_ORDER = [
  {
    key: AWS_ENVIRONMENT_KEYS.LENTRA_PRODUCTION,
    label: 'Lentra Production',
    sandbox: SANDBOXES.LENTRA_PRODUCTION,
    allowedProductTypes: [PRODUCT_TYPES.PFL_CDL],
    disabledProductTypes: [],
  },
  {
    key: AWS_ENVIRONMENT_KEYS.LENTRA_UAT,
    label: 'Lentra UAT',
    // Keep existing Lentra sandbox logic intact
    sandbox: SANDBOXES.LENTRA,
    allowedProductTypes: [
      PRODUCT_TYPES.PFL_CDL,
      PRODUCT_TYPES.LENTRA_V2,
      PRODUCT_TYPES.BULK_SERVICE,
    ],
    // Preserve existing behavior: Lentra V2 is not selectable on Lentra (UAT)
    disabledProductTypes: [PRODUCT_TYPES.LENTRA_V2],
  },
  {
    key: AWS_ENVIRONMENT_KEYS.ATLAS,
    label: 'Atlas',
    sandbox: SANDBOXES.ATLAS,
    allowedProductTypes: [
      PRODUCT_TYPES.PFL_CDL,
      PRODUCT_TYPES.LENTRA_V2,
      PRODUCT_TYPES.BULK_SERVICE,
    ],
    disabledProductTypes: [],
  },
];

const AWS_ENV_CONFIG = AWS_ENVIRONMENTS_IN_ORDER.reduce((acc, env) => {
  acc[env.key] = env;
  return acc;
}, {});

const PRODUCT_CONFIG = {
  [PRODUCT_TYPES.PFL_CDL]: {
    label: 'Lentra PFL CDL',
    Dashboard: LentraPFLCDLDashboard,
  },
  [PRODUCT_TYPES.LENTRA_V2]: {
    label: 'Lentra V2',
    Dashboard: LentraV2Dashboard,
  },
  [PRODUCT_TYPES.BULK_SERVICE]: {
    label: 'Bulk Service',
    Dashboard: BulkServiceDashboard,
  },
};

const AnalyticsDashboard = () => {
  const [selectedEnvironmentKey, setSelectedEnvironmentKey] = useState(
    AWS_ENVIRONMENT_KEYS.LENTRA_PRODUCTION
  );
  const [selectedProduct, setSelectedProduct] = useState(PRODUCT_TYPES.PFL_CDL);

  const selectedEnvironment = useMemo(() => {
    return (
      AWS_ENV_CONFIG[selectedEnvironmentKey] ??
      AWS_ENV_CONFIG[AWS_ENVIRONMENT_KEYS.LENTRA_PRODUCTION]
    );
  }, [selectedEnvironmentKey]);

  const isProductDisabled = useCallback(
    (productType) => {
      return selectedEnvironment.disabledProductTypes.includes(productType);
    },
    [selectedEnvironment.disabledProductTypes]
  );

  const handleEnvironmentChange = useCallback((environmentKey) => {
    setSelectedEnvironmentKey(environmentKey);
    setSelectedProduct((prevSelectedProduct) => {
      const env = AWS_ENV_CONFIG[environmentKey];
      if (!env) return prevSelectedProduct;
      return env.allowedProductTypes.includes(prevSelectedProduct)
        ? prevSelectedProduct
        : env.allowedProductTypes[0];
    });
  }, []);

  const handleProductChange = useCallback(
    (productType) => {
      if (isProductDisabled(productType)) return;
      setSelectedProduct(productType);
    },
    [isProductDisabled]
  );

  const selectedSandbox = selectedEnvironment.sandbox;
  const visibleProducts = selectedEnvironment.allowedProductTypes.map((productType) => {
    return { productType, ...PRODUCT_CONFIG[productType] };
  });

  const SelectedDashboard = PRODUCT_CONFIG[selectedProduct]?.Dashboard ?? null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Sandbox Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">AWS Environment</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            {AWS_ENVIRONMENTS_IN_ORDER.map((env) => (
              <button
                key={env.key}
                onClick={() => handleEnvironmentChange(env.key)}
                className={`px-6 py-2 rounded-full font-medium transition-all cursor-pointer ${
                  selectedEnvironmentKey === env.key
                    ? 'bg-[#3a9391] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {env.label}
              </button>
            ))}
          </div>

          {/* Product Selector */}
          <h2 className="text-lg font-semibold text-gray-800 mb-4 mt-8">Product Type</h2>
          <div className="flex flex-wrap gap-3">
            {visibleProducts.map(({ productType, label }) => {
              const disabled = isProductDisabled(productType);
              const isSelected = selectedProduct === productType;

              return (
                <button
                  key={productType}
                  onClick={() => handleProductChange(productType)}
                  disabled={disabled}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    disabled
                      ? 'cursor-not-allowed bg-gray-100 text-gray-400 opacity-60'
                      : isSelected
                        ? 'cursor-pointer bg-[#3a9391] text-white shadow-md'
                        : 'cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Render Selected Product Dashboard */}
        {SelectedDashboard && <SelectedDashboard sandbox={selectedSandbox} />}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;