import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, FileText, CheckCircle, XCircle } from 'lucide-react';
import { currentUrl } from './constant';


const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState('lifetime');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateError, setDateError] = useState('');
  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    setDateError('');

    let url = currentUrl+'/verification/analytics?date_filter_type=' + dateFilter;
    
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
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setAnalyticsData(data);
      } else {
        setError(data.error || 'Failed to fetch analytics');
      }
    } catch (err) {
      setError('Error fetching analytics data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dateFilter !== 'date_range') {
      fetchAnalytics();
    }
  }, [dateFilter]);

  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    setDateError('');
    setStartDate('');
    setEndDate('');
  };

  const handleDateRangeSubmit = () => {
    fetchAnalytics();
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value?.toLocaleString() || 0}</p>
        </div>
        {Icon && <Icon className="text-gray-400" size={40} strokeWidth={1.5} />}
      </div>
    </div>
  );

  const BreakdownCard = ({ title, data }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-3">
        {Object.entries(data || {}).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center border-b border-gray-100 pb-2">
            <span className="text-gray-600 text-sm">{key}</span>
            <span className="text-gray-800 font-semibold">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Date Filter Pills */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-3 mb-4">
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Analytics Data */}
        {!loading && !error && analyticsData && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Documents Processed"
                value={analyticsData.total_documents_processed}
                icon={FileText}
                color="#3a9391"
              />
              <StatCard
                title="KYC/ID Documents"
                value={analyticsData.kyc_id_documents_processed}
                icon={CheckCircle}
                color="#3a9391"
              />
              <StatCard
                title="Non-KYC Documents"
                value={analyticsData.non_kyc_documents_processed}
                icon={FileText}
                color="#3a9391"
              />
              <StatCard
                title="Flows Created"
                value={analyticsData.flows_created}
                icon={TrendingUp}
                color="#3a9391"
              />
            </div>

            {/* Page Counts Metrics */}
            {analyticsData.page_counts && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Pages (Success)"
                  value={analyticsData.page_counts.total_pages_success}
                  icon={CheckCircle}
                  color="#3a9391"
                />
                <StatCard
                  title="Total Pages (Failed)"
                  value={analyticsData.page_counts.total_pages_failed}
                  icon={XCircle}
                  color="#3a9391"
                />
                <StatCard
                  title="Pages Failed by Atlas"
                  value={analyticsData.page_counts.failed_breakdown?.failure_from_atlas}
                  icon={FileText}
                  color="#3a9391"
                />
                <StatCard
                  title="Pages Failed by Lentra"
                  value={analyticsData.page_counts.failed_breakdown?.failure_from_lentra}
                  icon={FileText}
                  color="#3a9391"
                />
              </div>
            )}

            {/* Breakdown Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {analyticsData.document_breakdown?.successful_document_types && (
                <BreakdownCard
                  title="Document Types"
                  data={analyticsData.document_breakdown.successful_document_types}
                />
              )}
              
              {analyticsData.document_breakdown?.processing_status && (
                <BreakdownCard
                  title="Processing Status"
                  data={analyticsData.document_breakdown.processing_status}
                />
              )}
              
              {analyticsData.callback_details && Object.keys(analyticsData.callback_details).length > 0 && (
                <BreakdownCard
                  title="Callback Status"
                  data={analyticsData.callback_details}
                />
              )}
              
              {analyticsData.product_typewise_success && Object.keys(analyticsData.product_typewise_success).length > 0 && (
                <BreakdownCard
                  title="Product Type (Success)"
                  data={analyticsData.product_typewise_success}
                />
              )}

              {analyticsData.total_product_typewise_documents && Object.keys(analyticsData.total_product_typewise_documents).length > 0 && (
                <BreakdownCard
                  title="Product Type (Total)"
                  data={analyticsData.total_product_typewise_documents}
                />
              )}
              
              {analyticsData.document_breakdown?.upload_status && (
                <BreakdownCard
                  title="Upload Status"
                  data={analyticsData.document_breakdown.upload_status}
                />
              )}
            </div>

            {/* Date Filter Info
            {analyticsData.date_filter_info && (
              <div className="bg-[#3a9391] border border-green-200 rounded-lg p-4">
                <p className="text-sm text-white">
                  <span className="font-semibold">Showing data for:</span>{' '}
                  {analyticsData.date_filter_info.date_filter_type === 'lifetime' && 'All Time'}
                  {analyticsData.date_filter_info.date_filter_type === 'today' && 'Today'}
                  {analyticsData.date_filter_info.date_filter_type === 'date_range' &&
                    `${analyticsData.date_filter_info.start_date} to ${analyticsData.date_filter_info.end_date}`}
                </p>
              </div>
            )} */}
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;