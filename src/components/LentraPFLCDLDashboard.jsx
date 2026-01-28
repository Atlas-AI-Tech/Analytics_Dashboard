import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Info, ChevronDown, ChevronRight } from 'lucide-react';
import {
  SANDBOXES,
  DEFAULT_ENVIRONMENT,
  getPflCdlSummaryUrl,
  getPflCdlClientsUrl,
  getV3AnalyticsBackendStatus,
} from '../constant';

// Status descriptions mapping
const STATUS_DESCRIPTIONS = {
  upload: {
    success: "Document successfully received and uploaded into Atlas's server",
    failed: "Document successfully received but failed to upload into Atlas's server (reason example: received expired s3 link)",
    inprogress: "Document upload is in progress into Atlas's server"
  },
  sage_processing: {
    success: "Processing was successfully completed",
    inprogress: "Processing is in progress",
    failed: "Processing failed due to internal server error",
    unrecognised: "Processing was successfully completed but the document was unrecognised"
  },
  callbacks: {
    initiated: "Callback is initiated",
    delivered: "Callback was sent successfully",
    inprogress: "Callback is in progress",
    auth_failed: "Authentication failed before sending the callback",
    callback_failed: "Callback was not sent due to internal server error"
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
const StatusNode = ({ sandbox, title, label, data, description, showPageCount = true, color = '#d1d5db', countLabel = 'Count:' }) => {
  const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1).replace(/_/g, ' ');
  const backendStatus = getV3AnalyticsBackendStatus(title, label);
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-lg p-3 shadow-sm border-l-4 transition-all hover:shadow cursor-default"
      style={{ borderColor: color }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <h4 className="text-sm font-semibold text-gray-800">
          {formattedLabel}
        </h4>
        <div className='flex items-center gap-2'>
        <button
          onClick={() => {
            if (!backendStatus) return;
            const sandboxParam = sandbox ? `?sandbox=${encodeURIComponent(sandbox)}` : "";
            navigate(`/v3-detail/${title}/${backendStatus}${sandboxParam}`);
          }}
          style={{ backgroundColor: color }}
          className={`cursor-pointer ml-10 text-xs font-semibold text-gray-50 rounded-full px-2 py-1 ${
            !backendStatus ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          View Details
        </button>
        {/* {description && <InfoTooltip description={description} />} */}
        </div>
      </div>
      <div className="space-y-0.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">{countLabel}</span>
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
  sandbox,
  title,
  totalData,
  summaryData,
  statusDescriptions,
  showPageCount = true,
  color = '#d1d5db'
}) => {
  // starts opened by default
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // For Callback section, instead of "Documents", call it "Callback Entries"
  const isCallbackSection = title === "callbacks";
  const documentsLabel = isCallbackSection ? "Callback Entries" : "Documents";
  // For cards: "Document:" for Upload and Sage Processing, "Count:" for Callbacks
  const cardCountLabel = isCallbackSection ? "Count:" : "Documents:";

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
              {title
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase())
              }
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

      {/* Expanded Content - Status Cards */}
      {isExpanded && summaryData && (
        <div className="ml-6 mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(summaryData).map(([status, data]) => (
            <StatusNode
              key={status}
              sandbox={sandbox}
              title={title}
              label={status}
              data={data}
              description={statusDescriptions?.[status]}
              showPageCount={showPageCount}
              color={color}
              countLabel={cardCountLabel}
            />
          ))}
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
const FunnelView = ({ data, sandbox }) => {
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
            sandbox={sandbox}
            title="upload"
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
            sandbox={sandbox}
            title="sage-processing"
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
          sandbox={sandbox}
          title="callbacks"
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

const LentraPFLCDLDashboard = ({ sandbox = SANDBOXES.LENTRA }) => {
  const [dateFilter, setDateFilter] = useState('lifetime');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [selectedClient, setSelectedClient] = useState('all');
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPFLCDLData = async () => {
    setLoading(true);
    setError(null);
    setDateError('');

    const baseUrl = getPflCdlSummaryUrl(sandbox, DEFAULT_ENVIRONMENT);

    let url = `${baseUrl}?date_filter_type=${dateFilter}`;

    if (dateFilter === 'date_range') {
      if (!startDate || !endDate) {
        setDateError('Please select both start and end dates');
        setLoading(false);
        return;
      }

      if (new Date(startDate) > new Date(endDate)) {
        setDateError('Start date cannot be greater than end date');
        setLoading(false);
        return;
      }

      url += `&start_date=${startDate}&end_date=${endDate}`;
    }

    // Add client_uuid parameter if a specific client is selected
    // Note: 'all' is not sent to API, only specific client UUIDs
    if (selectedClient && selectedClient !== 'all') {
      url += `&client_uuid=${selectedClient}`;
    }

    try {
      const response = await fetch(url);
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

  // Fetch clients on mount and when sandbox changes
  useEffect(() => {
    const fetchClients = async () => {
      setClientsLoading(true);
      try {
        const clientsUrl = getPflCdlClientsUrl(sandbox, DEFAULT_ENVIRONMENT);
        const response = await fetch(clientsUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch clients');
        }
        const clientsData = await response.json();
        // Handle both array response and object with clients array
        const clientsList = Array.isArray(clientsData) 
          ? clientsData 
          : (clientsData.clients || []);
        setClients(clientsList);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setClients([]); // Set empty array on error
      } finally {
        setClientsLoading(false);
      }
    };
    
    fetchClients();
  }, [sandbox]);

  // Reset date filter to lifetime when sandbox changes
  useEffect(() => {
    setDateFilter('lifetime');
    setDateError('');
    setStartDate('');
    setEndDate('');
    setSelectedClient('all');
  }, [sandbox]);

  // Automatically refetch when date filter, client, OR sandbox changes (except for manual date_range)
  useEffect(() => {
    if (dateFilter !== 'date_range') {
      // Clear previous data while new sandbox/filter loads
      setData(null);
      fetchPFLCDLData();
    }
  }, [dateFilter, selectedClient, sandbox]);

  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    setDateError('');
    setStartDate('');
    setEndDate('');
  };

  const handleDateRangeSubmit = () => {
    fetchPFLCDLData();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Date Filter Pills */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-3 mb-4 items-center">
            <button
              onClick={() => handleDateFilterChange('lifetime')}
              className={`px-6 py-2 rounded-full font-medium transition-all cursor-pointer ${
                dateFilter === 'lifetime'
                  ? 'bg-[#3a9391] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Lifetime Data
            </button>
            <button
              onClick={() => handleDateFilterChange('today')}
              className={`px-6 py-2 rounded-full font-medium transition-all cursor-pointer ${
                dateFilter === 'today'
                  ? 'bg-[#3a9391] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Today's Data
            </button>
            <button
              onClick={() => handleDateFilterChange('date_range')}
              className={`px-6 py-2 rounded-full font-medium transition-all cursor-pointer flex items-center gap-2 ${
                dateFilter === 'date_range'
                  ? 'bg-[#3a9391] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Calendar size={18} />
              Specific Date Range
            </button>
            
            {/* Client Dropdown */}
            <div className="ml-auto relative">
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                disabled={clientsLoading}
                className="px-6 py-2 pr-10 rounded-full font-medium transition-all cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-200 border-0 focus:ring-2 focus:ring-[#3a9391] focus:outline-none appearance-none min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="all">All Clients</option>
                {clients.map((client) => (
                  <option key={client.uuid} value={client.uuid}>
                    {client.name}
                  </option>
                ))}
              </select>
              <ChevronDown 
                size={18} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-600" 
              />
            </div>
          </div>

          {/* Date Range Picker */}
          {dateFilter === 'date_range' && (
            <div className="border-t pt-4 mt-4">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    max={endDate || undefined}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || undefined}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleDateRangeSubmit}
                  disabled={!startDate || !endDate}
                  className="px-6 py-2 bg-[#3a9391] text-white rounded-lg font-medium hover:bg-[#3a9391] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Apply Filter
                </button>
              </div>
              {dateError && (
                <p className="text-red-600 text-sm mt-2">{dateError}</p>
              )}
            </div>
          )}
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
          <div className="bg-[#d93e3e] border border-[#d93e3e] rounded-lg p-4 mb-8">
            <p className="text-white">{error}</p>
          </div>
        )}

        {/* Funnel View */}
        {!loading && !error && data && <FunnelView data={data} sandbox={sandbox} />}
      </div>
    </div>
  );
};

export default LentraPFLCDLDashboard;
