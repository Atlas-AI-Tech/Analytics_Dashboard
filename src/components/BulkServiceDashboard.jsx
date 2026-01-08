import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import {
  DEFAULT_ENVIRONMENT,
  getBulkServiceClientsUrl,
  getBulkServiceAnalyticsUrl,
} from '../constant';

// Analytics Card Component
const AnalyticsCard = ({ title, value, color = '#3a9391' }) => {
  return (
    <div
      className="bg-white rounded-lg p-6 shadow-sm border-l-4 transition-all hover:shadow"
      style={{ borderColor: color }}
    >
      <h3 className="text-sm font-semibold text-gray-600 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

// Master Summary Component
const MasterSummary = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border-2 border-gray-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Upload Documents Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsCard
          title="Total Documents"
          value={data.total_documents || 0}
          color="#10b981"
        />
        <AnalyticsCard
          title="Total Pages"
          value={data.total_pages || 0}
          color="#3b82f6"
        />
        <AnalyticsCard
          title="Total Unrecognised"
          value={data.total_unrecognised || 0}
          color="#f59e0b"
        />
      </div>
    </div>
  );
};

// Processing Status Section
const ProcessingStatus = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border-2 border-gray-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Sage Processing Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsCard
          title="Processing Success"
          value={data.PROCESSING_SUCCESS || 0}
          color="#10b981"
        />
        <AnalyticsCard
          title="Processing In Progress"
          value={data.PROCESSING_INPROGRESS || 0}
          color="#3b82f6"
        />
        <AnalyticsCard
          title="Processing Failed"
          value={data.PROCESSING_FAILED || 0}
          color="#ef4444"
        />
      </div>
    </div>
  );
};

const BulkServiceDashboard = ({ sandbox }) => {
  const [dateFilter, setDateFilter] = useState('lifetime');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBulkServiceData = useCallback(async () => {
    // client_uuid is required, don't fetch if no client selected
    if (!selectedClient) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);
    setDateError('');

    const baseUrl = getBulkServiceAnalyticsUrl(sandbox, DEFAULT_ENVIRONMENT);

    // Build URL with required client_uuid
    let url = `${baseUrl}?client_uuid=${selectedClient}`;

    // Add date filter parameters based on selected filter type
    if (dateFilter === 'lifetime') {
      url += `&date_filter_type=lifetime`;
    } else if (dateFilter === 'today') {
      url += `&date_filter_type=today`;
    } else if (dateFilter === 'date_range') {
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

      url += `&from_date=${startDate}&to_date=${endDate}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch data');
      }
      const responseData = await response.json();
      setData(responseData);
    } catch (err) {
      setError(err.message || 'Error fetching data');
      console.error('Error fetching bulk service data:', err);
    } finally {
      setLoading(false);
    }
  }, [sandbox, dateFilter, startDate, endDate, selectedClient]);

  // Fetch clients on mount and when sandbox changes
  useEffect(() => {
    const fetchClients = async () => {
      setClientsLoading(true);

      try {
        const clientsUrl = getBulkServiceClientsUrl(sandbox, DEFAULT_ENVIRONMENT);
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
        
        // Auto-select first client if available and none selected
        // Use functional update to avoid dependency on selectedClient
        setSelectedClient((current) => {
          if (!current && clientsList.length > 0) {
            return clientsList[0].client_uuid;
          }
          return current;
        });
      } catch (err) {
        console.error('Error fetching clients:', err);
        setClients([]); // Set empty array on error
      } finally {
        setClientsLoading(false);
      }
    };
    
    fetchClients();
  }, [sandbox]);

  // Reset filters when sandbox changes
  useEffect(() => {
    setDateFilter('lifetime');
    setDateError('');
    setStartDate('');
    setEndDate('');
    setSelectedClient('');
    setData(null);
  }, [sandbox]);

  // Automatically refetch when date filter, client, OR sandbox changes (except for manual date_range)
  useEffect(() => {
    if (dateFilter !== 'date_range') {
      // Clear previous data while new sandbox/filter loads
      setData(null);
      fetchBulkServiceData();
    }
  }, [dateFilter, selectedClient, sandbox, fetchBulkServiceData]);

  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    setDateError('');
    setStartDate('');
    setEndDate('');
  };

  const handleDateRangeSubmit = () => {
    fetchBulkServiceData();
  };

  const handleClientChange = (clientUuid) => {
    setSelectedClient(clientUuid);
  };

  return (
    <div className="mt-8">
      {/* Date Filter Pills and Client Dropdown */}
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
              onChange={(e) => handleClientChange(e.target.value)}
              disabled={clientsLoading || clients.length === 0}
              className="px-6 py-2 pr-10 rounded-full font-medium transition-all cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-200 border-0 focus:ring-2 focus:ring-[#3a9391] focus:outline-none appearance-none min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.client_uuid} value={client.client_uuid}>
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

      {/* Analytics Data */}
      {!loading && !error && data && (
        <div>
          <MasterSummary data={data} />
          <ProcessingStatus data={data} />
        </div>
      )}

      {/* No Client Selected Message */}
      {!loading && !error && !data && selectedClient && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-yellow-800">No data available for the selected filters.</p>
        </div>
      )}

      {/* No Client Selected Message */}
      {!loading && !error && !selectedClient && clients.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-blue-800">Please select a client to view analytics.</p>
        </div>
      )}
    </div>
  );
};

export default BulkServiceDashboard;

