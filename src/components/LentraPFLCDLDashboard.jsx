import React, { useState, useEffect } from 'react';
import { Calendar, Info, ChevronDown, ChevronRight } from 'lucide-react';

const PFL_CDL_LOCAL_API_ENDPOINT = "http://localhost:5000"
const PFL_CDL_PROD_API_ENDPOINT = "https://uat-lentra-los.kreditmind.com"
const PFL_CDL_API_ENDPOINT =
  `${PFL_CDL_LOCAL_API_ENDPOINT}/v3/verification/analytics/documents/summary`;

// Status descriptions mapping
const STATUS_DESCRIPTIONS = {
  upload: {
    success: "Document successfully received and uploaded into Atlas's server",
    failed: "Document successfully received but failed to upload into Atlas's server (reason example: received expired s3 link)",
    inprogress: "Document upload is in progress into Atlas's server"
  },
  sage_processing: {
    success: "Atlas was successfully able to parse the given document",
    inprogress: "Given document is in parsing processing",
    failed: "Failed due to server error",
    unrecognised: "Failed due to Unrecognised document"
  },
  callbacks: {
    initiated: "Callback is initiated",
    delivered: "Callback sent successfully",
    inprogress: "Callback in progress",
    auth_failed: "Auth Failed before sending the callback"
  }
};

// Info Tooltip Component
const InfoTooltip = ({ description }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
        onMouseLeave={() => setIsOpen(false)}
      >
        <Info size={16} className="text-gray-500" />
      </button>
      {isOpen && (
        <div
          className="absolute z-50 w-64 p-3 bg-white border-2 border-gray-300 rounded-lg shadow-sm"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <p className="text-sm text-gray-700">{description}</p>
        </div>
      )}
    </div>
  );
};

// Status Node Component (Leaf nodes)
const StatusNode = ({ label, data, description, showPageCount = true, color = '#d1d5db' }) => {
  const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1).replace(/_/g, ' ');

  return (
    <div
      className="bg-white rounded-lg p-3 shadow-sm border-l-4 transition-all hover:shadow cursor-default"
      style={{ borderColor: color }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <h4 className="text-sm font-semibold text-gray-800">
          {formattedLabel}
        </h4>
        {description && <InfoTooltip description={description} />}
      </div>
      <div className="space-y-0.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Count:</span>
          <span className="text-sm font-bold text-gray-800">{data?.count || data?.document_count || 0}</span>
        </div>
        {showPageCount && data?.page_count !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Pages:</span>
            <span className="text-sm font-bold text-gray-800">{data.page_count}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Section Node Component (Main sections with expand/collapse)
// All accordions and nested expands will be open by default
const SectionNode = ({
  title,
  totalData,
  summaryData,
  statusDescriptions,
  showPageCount = true,
  color = '#d1d5db'
}) => {
  // both starts opened by default
  const [isExpanded, setIsExpanded] = useState(true);
  const [isTotalExpanded, setIsTotalExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    // Nested total should only expand if parent is being opened, otherwise don't auto-reopen
    if (!isExpanded && !isTotalExpanded) {
      setIsTotalExpanded(true);
    }
  };

  const toggleTotalExpand = () => {
    setIsTotalExpanded(!isTotalExpanded);
  };

  // For Callback section, instead of "Documents", call it "Callback Entries"
  const isCallbackSection = title === "Callbacks";
  const documentsLabel = isCallbackSection ? "Callback Entries" : "Documents";
  const countLabel = isCallbackSection ? "Entries" : "Count";

  return (
    <div className="w-full">
      {/* Main Section Box */}
      <div
        onClick={toggleExpand}
        className="bg-white rounded-lg p-4 shadow-sm border-l-4 transition-all hover:shadow cursor-pointer mb-4"
        style={{ borderColor: color }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown size={20} className="text-gray-600" />
            ) : (
              <ChevronRight size={20} className="text-gray-600" />
            )}
            <h2 className="text-xl font-bold text-gray-800">
              {title}
            </h2>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-4">
              <div>
                <div className="text-xs text-gray-600 mb-0.5">{documentsLabel}</div>
                <div className="text-2xl font-bold text-gray-800">
                  {totalData?.count || totalData?.document_count || 0}
                </div>
              </div>
              {showPageCount && totalData?.page_count !== undefined && (
                <div>
                  <div className="text-xs text-gray-600 mb-0.5">Pages</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {totalData.page_count}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="ml-6 mb-4 space-y-4">
          {/* Documents or Callback Entries Node */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleTotalExpand();
            }}
            className="bg-gray-50 rounded-lg p-3 shadow-sm border-l-4 transition-all hover:shadow cursor-pointer"
            style={{ borderColor: color }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isTotalExpanded ? (
                  <ChevronDown size={18} className="text-gray-600" />
                ) : (
                  <ChevronRight size={18} className="text-gray-600" />
                )}
                <h3 className="text-base font-semibold text-gray-800">
                  {documentsLabel}
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-gray-600 mb-0.5">{countLabel}</div>
                  <div className="text-xl font-bold text-gray-800">
                    {totalData?.count || totalData?.document_count || 0}
                  </div>
                </div>
                {showPageCount && totalData?.page_count !== undefined && (
                  <div className="text-right">
                    <div className="text-xs text-gray-600 mb-0.5">Pages</div>
                    <div className="text-xl font-bold text-gray-800">
                      {totalData.page_count}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Nodes */}
          {isTotalExpanded && summaryData && (
            <div className="ml-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(summaryData).map(([status, data]) => (
                <StatusNode
                  key={status}
                  label={status}
                  data={data}
                  description={statusDescriptions?.[status]}
                  showPageCount={showPageCount}
                  color={color}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Master Summary Component
const MasterSummary = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border-2 border-gray-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Master Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Documents</div>
          <div className="text-3xl font-bold text-gray-800">
            {data.document_count || 0}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Pages</div>
          <div className="text-3xl font-bold text-gray-800">
            {data.page_count || 0}
          </div>
        </div>
      </div>
    </div>
  );
};

// Funnel View Component
const FunnelView = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* Master Summary */}
      {data.master_summary && (
        <>
          <MasterSummary data={data.master_summary} />
          {/* Divider after Master Summary */}
          {(data.upload || data.sage_processing || data.callbacks) && (
            <div className="border-t-2 border-gray-300"></div>
          )}
        </>
      )}

      {/* Upload Section */}
      {data.upload && (
        <>
          <SectionNode
            title="Upload"
            totalData={data.upload.total}
            summaryData={data.upload.summary}
            statusDescriptions={STATUS_DESCRIPTIONS.upload}
            showPageCount={true}
            color="#f97316"
          />
          {/* Divider - only show if there are more sections */}
          {(data.sage_processing || data.callbacks) && (
            <div className="border-t-2 border-gray-300"></div>
          )}
        </>
      )}

      {/* Sage Processing Section */}
      {data.sage_processing && (
        <>
          <SectionNode
            title="Sage Processing"
            totalData={data.sage_processing.total}
            summaryData={data.sage_processing.summary}
            statusDescriptions={STATUS_DESCRIPTIONS.sage_processing}
            showPageCount={true}
            color="#3b82f6"
          />
          {/* Divider - only show if Callbacks section exists */}
          {data.callbacks && (
            <div className="border-t-2 border-gray-300"></div>
          )}
        </>
      )}

      {/* Callbacks Section */}
      {data.callbacks && (
        <SectionNode
          title="Callbacks"
          totalData={data.callbacks.total}
          summaryData={data.callbacks.summary}
          statusDescriptions={STATUS_DESCRIPTIONS.callbacks}
          showPageCount={false}
          color="#10b981"
        />
      )}
    </div>
  );
};

const LentraPFLCDLDashboard = () => {
  const [dateFilter, setDateFilter] = useState('lifetime');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPFLCDLData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${PFL_CDL_API_ENDPOINT}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const responseData = await response.json();
      setData(responseData);
    } catch (err) {
      setError(err.message || 'Error fetching data');
      console.error('Error fetching PFL CDL data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPFLCDLData();
  }, [dateFilter]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Date Filter Pills */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => setDateFilter('lifetime')}
              className={`px-6 py-2 rounded-full font-medium transition-all cursor-pointer ${
                dateFilter === 'lifetime'
                  ? 'bg-[#3a9391] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Lifetime Data
            </button>
            <button
              disabled
              className="px-6 py-2 rounded-full font-medium transition-all cursor-not-allowed bg-gray-100 text-gray-400 opacity-60"
            >
              Today's Data
            </button>
            <button
              disabled
              className="px-6 py-2 rounded-full font-medium transition-all cursor-not-allowed bg-gray-100 text-gray-400 opacity-60 flex items-center gap-2"
            >
              <Calendar size={18} />
              Specific Date Range
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a9391]"></div>
            <p className="text-gray-600 mt-4">Loading analytics...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Funnel View */}
        {!loading && !error && data && <FunnelView data={data} />}
      </div>
    </div>
  );
};

export default LentraPFLCDLDashboard;
