import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AlertCircle,
  ArrowUpDown,
  CalendarClock,
  Download,
  Loader2,
  RefreshCcw,
} from 'lucide-react';
import { currentUrl } from './constant';

const MOCK_FLOW_IDS = [];
const API_ENDPOINT = `${currentUrl}/verification/analytics/flow-files`;
const MEDIAN_API_ENDPOINT = `${currentUrl}/verification/analytics/flow-medians`;
const LOS_LOCAL_API_ENDPOINT = "http://localhost:5000"
const LOS_PROD_API_ENDPOINT = "https://uat-lentra-los.kreditmind.com"
const LOS_API_ENDPOINT =
  `${LOS_PROD_API_ENDPOINT}/v3/verification/analytics`;

const formatTimeValue = (value, timeUnit) => {
  if (value == null || value === '') return '—';
  const numValue = Number(value);
  if (Number.isNaN(numValue)) return '—';
  if (timeUnit === 'seconds') {
    return (numValue / 1000).toFixed(3);
  }
  return numValue;
};

const LentraV2Tracker = ({ initialFlowId }) => {
  const [trackingMode, setTrackingMode] = useState('flow_uuid');
  const [flowIdInput, setFlowIdInput] = useState(initialFlowId);
  const [activeFlowId, setActiveFlowId] = useState(initialFlowId);
  const [metrics, setMetrics] = useState([]);
  const [medianData, setMedianData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [timeUnit, setTimeUnit] = useState('seconds');
  const [sortConfig, setSortConfig] = useState({
    key: 'fileUploadTimestamp',
    direction: 'asc',
  });

  const handleSort = (columnKey) => {
    setSortConfig((prev) => {
      if (prev.key === columnKey) {
        return {
          key: columnKey,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key: columnKey, direction: 'asc' };
    });
  };

  const sortedMetrics = useMemo(() => {
    if (!sortConfig.key) return metrics;
    const sorted = [...metrics].sort((a, b) => {
      const aValue = a?.[sortConfig.key];
      const bValue = b?.[sortConfig.key];
      if (aValue === bValue) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (!Number.isNaN(Number(aValue)) && !Number.isNaN(Number(bValue))) {
        return sortConfig.direction === 'asc'
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }
      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
    return sorted;
  }, [metrics, sortConfig]);

  const formatTime = useCallback(
    (value) => formatTimeValue(value, timeUnit),
    [timeUnit],
  );

  const fetchMetrics = useCallback(async (flow) => {
    if (!flow) {
      setMetrics([]);
      setError(null);
      setUsingMockData(false);
      return;
    }
    setLoading(true);
    setUsingMockData(false);
    setError(null);
    try {
      const url = `${API_ENDPOINT}?flow_uuid=${encodeURIComponent(flow)}`;
      const response = await fetch(url, {
        method: 'GET',
      });
      let payload = null;
      if (!response.ok) {
        payload = await response.json().catch(() => null);
        throw new Error(
          payload?.error || `Failed to fetch metrics for flow ${flow}`,
        );
      }

      payload = payload ?? (await response.json());
      const files = Array.isArray(payload?.files) ? payload.files : [];
      const flowUuid = payload?.flow_uuid || flow;
      const mappedData = files.map((file) => ({
        fileId: file.file_uuid || '',
        docType: file.document_type || '',
        fileUploadTimestamp: file.file_upload_timestamp || '',
        chatNotificationTimestamp: file.chat_notification_timestamp || '',
        callbackSendTimestamp: file.callback_send_timestamp || '',
        totalTimeTaken: file.total_time_taken ?? null,
        fileUploadTime: file.file_upload_time ?? null,
        grayScalingTime: file.gray_scaling_time ?? null,
        sageAPITime: file.sage_api_time ?? null,
        filePixelConversion: file.file_pixel_conversion_time ?? null,
        reduct: file.reduct_time ?? null,
        lentraAuth: file.lentra_auth_time ?? null,
        callbackSuccess: file.callback_success_time ?? null,
        miscellaneous: file.miscellaneous_time ?? null,
        flowUuid: file.flow_uuid || flowUuid,
      }));
      setMetrics(mappedData);
      setUsingMockData(false);
    } catch (err) {
      setError(err.message || 'Unable to load latency metrics');
      setMetrics([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMedians = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(MEDIAN_API_ENDPOINT, {
        method: 'GET',
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || 'Failed to fetch median metrics');
      }
      const payload = await response.json();
      setMedianData(payload);
    } catch (err) {
      setError(err.message || 'Unable to load median metrics');
      setMedianData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (trackingMode === 'median') {
      fetchMedians();
    } else if (initialFlowId) {
      fetchMetrics(initialFlowId);
    }
  }, [trackingMode, initialFlowId, fetchMetrics, fetchMedians]);

  useEffect(() => {
    setActiveFlowId(initialFlowId);
    setFlowIdInput(initialFlowId);
  }, [initialFlowId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedFlowId = flowIdInput?.trim();
    if (!trimmedFlowId) {
      setError('Please enter a valid flow ID before fetching metrics.');
      return;
    }
    setActiveFlowId(trimmedFlowId);
    fetchMetrics(trimmedFlowId);
  };

  const applyMockFlow = (flow) => {
    if (!flow) return;
    setFlowIdInput(flow);
    setActiveFlowId(flow);
    fetchMetrics(flow);
  };

  const handleRetry = () => {
    if (trackingMode === 'flow_uuid') {
      fetchMetrics(activeFlowId);
    } else {
      fetchMedians();
    }
  };

  const toggleTimeUnit = () => {
    setTimeUnit((prev) => (prev === 'seconds' ? 'milliseconds' : 'seconds'));
  };

  const downloadCSV = () => {
    if (!metrics.length) return;
    const headers = [
      'file_uuid',
      'document_type',
      'file_upload_timestamp',
      'chat_notification_timestamp',
      'callback_send_timestamp',
      'total_time_taken',
      'file_upload_time',
      'gray_scaling_time',
      'sage_api_time',
      'file_pixel_conversion_time',
      'reduct_time',
      'lentra_auth_time',
      'callback_success_time',
      'miscellaneous_time',
      'flow_uuid',
    ];
    const rows = metrics.map((metric) => [
      metric.fileId ?? '',
      metric.docType ?? '',
      metric.fileUploadTimestamp ?? '',
      metric.chatNotificationTimestamp ?? '',
      metric.callbackSendTimestamp ?? '',
      metric.totalTimeTaken ?? '',
      metric.fileUploadTime ?? '',
      metric.grayScalingTime ?? '',
      metric.sageAPITime ?? '',
      metric.filePixelConversion ?? '',
      metric.reduct ?? '',
      metric.lentraAuth ?? '',
      metric.callbackSuccess ?? '',
      metric.miscellaneous ?? '',
      metric.flowUuid ?? '',
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((value) => {
            if (value == null) return '';
            const stringValue = String(value);
            return stringValue.includes(',')
              ? `"${stringValue.replace(/"/g, '""')}"`
              : stringValue;
          })
          .join(','),
      ),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `flow-${activeFlowId || 'metrics'}-latency.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const timeUnitLabel = timeUnit === 'seconds' ? 's' : 'ms';

  const medianTableData = useMemo(() => {
    if (!medianData) return [];
    const medianKeys = [
      { key: 'median_callback_success_time', label: 'Callback Success Time' },
      {
        key: 'median_file_pixel_conversion_time',
        label: 'File Pixel Conversion Time',
      },
      { key: 'median_file_upload_time', label: 'File Upload Time' },
      { key: 'median_gray_scaling_time', label: 'Gray Scaling Time' },
      { key: 'median_lentra_auth_time', label: 'Lentra Auth Time' },
      { key: 'median_miscellaneous_time', label: 'Miscellaneous Time' },
      { key: 'median_reduct_time', label: 'Reduct Time' },
      { key: 'median_sage_api_time', label: 'Sage API Time' },
      { key: 'median_total_time_taken', label: 'Total Time Taken' },
    ];
    return medianKeys.map(({ key, label }) => ({
      medianType: label,
      overallMedian: medianData.overall_medians?.[key] ?? null,
      todaysMedian: medianData.todays_medians?.[key] ?? null,
    }));
  }, [medianData]);

  const tableHeaders = [
    { key: 'fileId', label: 'File UUID' },
    { key: 'docType', label: 'Document Type' },
    { key: 'fileUploadTimestamp', label: 'File Upload Timestamp' },
    { key: 'chatNotificationTimestamp', label: 'Chat Notification Timestamp' },
    { key: 'callbackSendTimestamp', label: 'Callback Send Timestamp' },
    { key: 'totalTimeTaken', label: `Total Time (${timeUnitLabel})` },
    {
      key: 'fileUploadTime',
      label: `Upload (${timeUnitLabel})`,
      tooltip: 'Time between file upload initiation and completion',
    },
    {
      key: 'grayScalingTime',
      label: `Gray Scaling (${timeUnitLabel})`,
      tooltip: 'Image preprocessing duration',
    },
    {
      key: 'sageAPITime',
      label: `Sage API (${timeUnitLabel})`,
      tooltip: 'External Sage API processing time',
    },
    {
      key: 'filePixelConversion',
      label: `Pixel Conversion (${timeUnitLabel})`,
      tooltip: 'Time taken to convert document pixels',
    },
    {
      key: 'reduct',
      label: `Reduct (${timeUnitLabel})`,
      tooltip: 'Document reduction pipeline duration',
    },
    {
      key: 'lentraAuth',
      label: `Lentra Auth (${timeUnitLabel})`,
      tooltip: 'Authentication call to Lentra services',
    },
    {
      key: 'callbackSuccess',
      label: `Callback (${timeUnitLabel})`,
      tooltip: 'Callback acknowledgement time',
    },
    {
      key: 'miscellaneous',
      label: `Misc (${timeUnitLabel})`,
      tooltip: 'Other processing tasks',
    },
    { key: 'flowUuid', label: 'Flow UUID' },
  ];

  return (
    <>
      <div className="mb-6 flex items-center gap-4 rounded-2xl border border-[#3a9391]/20 bg-white p-4 shadow-md">
        <span className="text-sm font-medium text-gray-700">Tracking Mode:</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTrackingMode('flow_uuid')}
            className={`rounded-lg px-4 py-2 cursor-pointer text-sm font-medium transition ${
              trackingMode === 'flow_uuid'
                ? 'bg-[#3a9391] text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Track by flow_uuid
          </button>
          <button
            type="button"
            onClick={() => setTrackingMode('median')}
            className={`rounded-lg px-4 py-2 cursor-pointer text-sm font-medium transition ${
              trackingMode === 'median'
                ? 'bg-[#3a9391] text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Track by Median
          </button>
        </div>
      </div>

      <header className="mb-8 flex flex-col gap-4 rounded-2xl border border-[#3a9391]/20 bg-white p-6 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Flow Latency Tracker
            </h1>
            <p className="text-sm text-gray-600">
              {trackingMode === 'flow_uuid'
                ? 'Monitor processing metrics for a specific flow to diagnose performance bottlenecks.'
                : 'View median latency metrics across all flows to understand overall system performance.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRetry}
            disabled={loading || (trackingMode === 'flow_uuid' && !activeFlowId)}
            className="inline-flex items-center gap-2 rounded-lg cursor-pointer border border-[#3a9391]/60 bg-[#3a9391] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#347f7d] disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-200"
          >
            <RefreshCcw size={16} />
            Refresh Data
          </button>
        </div>

        {trackingMode === 'flow_uuid' && (
          <>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:flex-row sm:items-end"
              aria-label="Flow selection"
            >
              <label className="flex-1" htmlFor="flowIdInput">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Flow ID
                </span>
                <input
                  id="flowIdInput"
                  name="flowIdInput"
                  type="text"
                  value={flowIdInput}
                  onChange={(event) => setFlowIdInput(event.target.value)}
                  placeholder="Enter or paste a flow identifier"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#3a9391]"
                  aria-required="true"
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3a9391] cursor-pointer px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#347f7d] focus:outline-none focus:ring-2 focus:ring-[#3a9391] focus:ring-offset-2"
              >
                <CalendarClock size={16} />
                Load Metrics
              </button>
            </form>

            {MOCK_FLOW_IDS.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <span className="font-medium text-gray-700">
                  Sample flow IDs:
                </span>
                {MOCK_FLOW_IDS.map((flow) => (
                  <button
                    key={flow}
                    type="button"
                    onClick={() => applyMockFlow(flow)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                      activeFlowId === flow && usingMockData
                        ? 'border-[#3a9391]/70 bg-[#3a9391]/10 text-[#3a9391]'
                        : 'border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {flow}
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span>
                Active Flow{' '}
                <strong className="text-gray-900">
                  {activeFlowId || 'None selected'}
                </strong>
              </span>
              {metrics.length > 0 && (
                <span className="inline-flex items-center gap-2 rounded-full border border-[#3a9391]/40 bg-[#3a9391]/10 px-3 py-1 text-xs font-medium text-[#3a9391]">
                  {metrics.length} records loaded
                </span>
              )}
              {usingMockData && (
                <span className="inline-flex items-center gap-2 rounded-full border border-[#3a9391]/40 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  Showing mock data for preview
                </span>
              )}
            </div>
          </>
        )}

        {trackingMode === 'median' && (
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#3a9391]/40 bg-[#3a9391]/10 px-3 py-1 text-xs font-medium text-[#3a9391]">
              Showing median metrics across all flows
            </span>
          </div>
        )}
      </header>

      {error && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <AlertCircle size={20} className="mt-0.5" />
          <div>
            <p className="font-medium">Unable to fetch latency metrics.</p>
            <p>{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-2 inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100"
            >
              <RefreshCcw size={14} />
              Retry
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div
          role="status"
          aria-live="polite"
          className="mb-8 flex items-center gap-3 rounded-2xl border border-[#3a9391]/20 bg-white p-6 shadow-md"
        >
          <Loader2 size={24} className="animate-spin text-[#3a9391]" />
          <div>
            <p className="font-medium text-gray-800">Fetching latency metrics…</p>
            <p className="text-sm text-gray-600">
              Please wait while we retrieve the latest processing data.
            </p>
          </div>
        </div>
      )}

      {trackingMode === 'flow_uuid' && (
        <>
          {!loading && !metrics.length && activeFlowId && !error && (
            <div className="mb-8 rounded-2xl border border-[#3a9391]/20 bg-white p-6 text-sm text-gray-600 shadow-md">
              No latency metrics were found for the selected flow. Try refreshing
              or checking the flow ID.
            </div>
          )}

          {metrics.length > 0 && (
            <article className="rounded-2xl border border-[#3a9391]/20 bg-white p-6 shadow-md">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={toggleTimeUnit}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#3a9391]/60 bg-white px-4 py-2 text-sm font-medium text-[#3a9391] transition hover:bg-[#3a9391]/10"
                  >
                    <ArrowUpDown size={16} />
                    Show in {timeUnit === 'seconds' ? 'Milliseconds' : 'Seconds'}
                  </button>
                  {/*<button
                    type="button"
                    onClick={downloadCSV}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#3a9391]/60 bg-[#3a9391] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#347f7d]"
                  >
                    <Download size={16} />
                    Download CSV
                  </button>*/}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table
                  className="min-w-full divide-y divide-gray-200"
                  role="table"
                  aria-label="Flow processing metrics"
                >
                  <thead className="bg-[#3a9391]">
                    <tr>
                      {tableHeaders.map(({ key, label, tooltip }) => (
                        <th
                          key={key}
                          scope="col"
                          className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white"
                          aria-sort={
                            sortConfig.key === key
                              ? sortConfig.direction === 'asc'
                                ? 'ascending'
                                : 'descending'
                              : 'none'
                          }
                        >
                          <button
                            type="button"
                            onClick={() => handleSort(key)}
                            className="inline-flex items-center gap-2 text-left hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-white/60"
                            title={tooltip}
                          >
                            <span>{label}</span>
                            <ArrowUpDown size={14} />
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {sortedMetrics.map((metric, index) => (
                      <tr
                        key={`${metric.fileId}-${index}`}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          {metric.fileId || '—'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {metric.docType || '—'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {metric.fileUploadTimestamp || '—'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {metric.chatNotificationTimestamp || '—'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {metric.callbackSendTimestamp || '—'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                          {formatTime(metric.totalTimeTaken)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {formatTime(metric.fileUploadTime)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {formatTime(metric.grayScalingTime)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {formatTime(metric.sageAPITime)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {formatTime(metric.filePixelConversion)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {formatTime(metric.reduct)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {formatTime(metric.lentraAuth)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {formatTime(metric.callbackSuccess)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {formatTime(metric.miscellaneous)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          {metric.flowUuid || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          )}
        </>
      )}

      {trackingMode === 'median' && (
        <>
          {!loading && !medianData && !error && (
            <div className="mb-8 rounded-2xl border border-[#3a9391]/20 bg-white p-6 text-sm text-gray-600 shadow-md">
              No median metrics available. Try refreshing.
            </div>
          )}

          {medianData && medianTableData.length > 0 && (
            <article className="rounded-2xl border border-[#3a9391]/20 bg-white p-6 shadow-md">
              <div className="mb-4 flex flex-wrap items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={toggleTimeUnit}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#3a9391]/60 bg-white px-4 py-2 text-sm font-medium text-[#3a9391] transition hover:bg-[#3a9391]/10"
                >
                  <ArrowUpDown size={16} />
                  Show in {timeUnit === 'seconds' ? 'Milliseconds' : 'Seconds'}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table
                  className="min-w-full divide-y divide-gray-200"
                  role="table"
                  aria-label="Median latency metrics"
                >
                  <thead className="bg-[#3a9391]">
                    <tr>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white"
                      >
                        Median Type
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white"
                      >
                        Overall Median ({timeUnitLabel})
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white"
                      >
                        Today's Median ({timeUnitLabel})
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {medianTableData.map((row, index) => (
                      <tr
                        key={row.medianType}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                          {row.medianType}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {formatTime(row.overallMedian)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {formatTime(row.todaysMedian)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          )}
        </>
      )}
    </>
  );
};

const LentraLOSTracker = ({ initialFlowId }) => {
  const [flowIdInput, setFlowIdInput] = useState(initialFlowId);
  const [activeFlowId, setActiveFlowId] = useState(initialFlowId);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeUnit, setTimeUnit] = useState('seconds');
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'asc',
  });

  useEffect(() => {
    setActiveFlowId(initialFlowId);
    setFlowIdInput(initialFlowId);
  }, [initialFlowId]);

  const formatTime = useCallback(
    (value) => formatTimeValue(value, timeUnit),
    [timeUnit],
  );

  const handleSort = (columnKey) => {
    setSortConfig((prev) => {
      if (prev.key === columnKey) {
        return {
          key: columnKey,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key: columnKey, direction: 'asc' };
    });
  };

  const sortedMetrics = useMemo(() => {
    if (!sortConfig.key) return metrics;
    const sorted = [...metrics].sort((a, b) => {
      const aValue = a?.[sortConfig.key];
      const bValue = b?.[sortConfig.key];
      if (aValue === bValue) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (!Number.isNaN(Number(aValue)) && !Number.isNaN(Number(bValue))) {
        return sortConfig.direction === 'asc'
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }
      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
    return sorted;
  }, [metrics, sortConfig]);

  const fetchMetrics = async (flow) => {
    if (!flow) {
      setMetrics([]);
      setError('Please enter a valid flow ID before fetching metrics.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const url = `${LOS_API_ENDPOINT}?flow_uuid=${encodeURIComponent(flow)}`;
      const response = await fetch(url, { method: 'GET' });
      
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || 'Failed to fetch LOS metrics');
      }
      const payload = await response.json();
      const items = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.analytics)
          ? payload.analytics
          : [];
      const mapped = items.map((item) => ({
        batchId: item.batch_id || '',
        createdAt: item.created_at || '',
        fileUpload: item.file_upload ?? null,
        fileUuid: item.file_uuid || '',
        flowUuid: item.flow_uuid || flow,
        pageCount: item.page_count ?? null,
        prepareSagePayload: item.prepare_sage_payload ?? null,
        sageLlmApi: item.sage_llm_api ?? null,
        totalTimeMs: item.total_time_ms ?? null,
      }));
      setMetrics(mapped);
      setActiveFlowId(flow);
    } catch (err) {
      setMetrics([]);
      setError(err.message || 'Unable to load LOS metrics');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = flowIdInput?.trim();
    if (!trimmed) {
      setError('Please enter a valid flow ID before fetching metrics.');
      return;
    }
    fetchMetrics(trimmed);
  };

  const handleRetry = () => {
    fetchMetrics(activeFlowId);
  };

  const toggleTimeUnit = () => {
    setTimeUnit((prev) => (prev === 'seconds' ? 'milliseconds' : 'seconds'));
  };

  const downloadCSV = () => {
    if (!metrics.length) return;
    const headers = [
      'batch_id',
      'created_at',
      'file_upload',
      'file_uuid',
      'flow_uuid',
      'page_count',
      'prepare_sage_payload',
      'sage_llm_api',
      'total_time_ms',
    ];
    const rows = metrics.map((metric) => [
      metric.batchId ?? '',
      metric.createdAt ?? '',
      metric.fileUpload ?? '',
      metric.fileUuid ?? '',
      metric.flowUuid ?? '',
      metric.pageCount ?? '',
      metric.prepareSagePayload ?? '',
      metric.sageLlmApi ?? '',
      metric.totalTimeMs ?? '',
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((value) => {
            if (value == null) return '';
            const stringValue = String(value);
            return stringValue.includes(',')
              ? `"${stringValue.replace(/"/g, '""')}"`
              : stringValue;
          })
          .join(','),
      ),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `los-flow-${activeFlowId || 'metrics'}-latency.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const timeUnitLabel = timeUnit === 'seconds' ? 's' : 'ms';

  const tableHeaders = [
    { key: 'batchId', label: 'Batch ID' },
    { key: 'createdAt', label: 'Created At' },
    { key: 'fileUpload', label: `File Upload (${timeUnitLabel})` },
    { key: 'fileUuid', label: 'File UUID' },
    { key: 'flowUuid', label: 'Flow UUID' },
    { key: 'pageCount', label: 'Page Count' },
    {
      key: 'prepareSagePayload',
      label: `Prepare Sage Payload (${timeUnitLabel})`,
    },
    { key: 'sageLlmApi', label: `Sage LLM API (${timeUnitLabel})` },
    { key: 'totalTimeMs', label: `Total Time (${timeUnitLabel})` },
  ];

  return (
    <>
      <header className="mb-8 flex flex-col gap-4 rounded-2xl border border-[#3a9391]/20 bg-white p-6 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Flow Latency Tracker
            </h1>
            <p className="text-sm text-gray-600">
              Monitor processing metrics for a specific flow to diagnose
              performance bottlenecks.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRetry}
            disabled={loading || !activeFlowId}
            className="inline-flex items-center gap-2 rounded-lg cursor-pointer border border-[#3a9391]/60 bg-[#3a9391] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#347f7d] disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-200"
          >
            <RefreshCcw size={16} />
            Refresh Data
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
          aria-label="Flow selection"
        >
          <label className="flex-1" htmlFor="losFlowIdInput">
            <span className="mb-2 block text-sm font-medium text-gray-700">
              Flow ID
            </span>
            <input
              id="losFlowIdInput"
              name="losFlowIdInput"
              type="text"
              value={flowIdInput}
              onChange={(event) => setFlowIdInput(event.target.value)}
              placeholder="Enter or paste a flow identifier"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#3a9391]"
              aria-required="true"
            />
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3a9391] cursor-pointer px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#347f7d] focus:outline-none focus:ring-2 focus:ring-[#3a9391] focus:ring-offset-2"
          >
            <CalendarClock size={16} />
            Load Metrics
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span>
            Active Flow{' '}
            <strong className="text-gray-900">
              {activeFlowId || 'None selected'}
            </strong>
          </span>
          {metrics.length > 0 && (
            <span className="inline-flex items-center gap-2 rounded-full border border-[#3a9391]/40 bg-[#3a9391]/10 px-3 py-1 text-xs font-medium text-[#3a9391]">
              {metrics.length} records loaded
            </span>
          )}
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <AlertCircle size={20} className="mt-0.5" />
          <div>
            <p className="font-medium">Unable to fetch latency metrics.</p>
            <p>{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-2 inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100"
            >
              <RefreshCcw size={14} />
              Retry
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div
          role="status"
          aria-live="polite"
          className="mb-8 flex items-center gap-3 rounded-2xl border border-[#3a9391]/20 bg-white p-6 shadow-md"
        >
          <Loader2 size={24} className="animate-spin text-[#3a9391]" />
          <div>
            <p className="font-medium text-gray-800">Fetching latency metrics…</p>
            <p className="text-sm text-gray-600">
              Please wait while we retrieve the latest processing data.
            </p>
          </div>
        </div>
      )}

      {!loading && !metrics.length && activeFlowId && !error && (
        <div className="mb-8 rounded-2xl border border-[#3a9391]/20 bg-white p-6 text-sm text-gray-600 shadow-md">
          No latency metrics were found for the selected flow. Try refreshing or
          checking the flow ID.
        </div>
      )}

      {metrics.length > 0 && (
        <article className="rounded-2xl border border-[#3a9391]/20 bg-white p-6 shadow-md">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={toggleTimeUnit}
                className="inline-flex items-center gap-2 rounded-lg border border-[#3a9391]/60 bg-white px-4 py-2 text-sm font-medium text-[#3a9391] transition hover:bg-[#3a9391]/10"
              >
                <ArrowUpDown size={16} />
                Show in {timeUnit === 'seconds' ? 'Milliseconds' : 'Seconds'}
              </button>
              {/*
              <button
                type="button"
                onClick={downloadCSV}
                className="inline-flex items-center gap-2 rounded-lg border border-[#3a9391]/60 bg-[#3a9391] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#347f7d]"
              >
                <Download size={16} />
                Download CSV
              </button>
              */}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table
              className="min-w-full divide-y divide-gray-200"
              role="table"
              aria-label="Flow processing metrics"
            >
              <thead className="bg-[#3a9391]">
                <tr>
                  {tableHeaders.map(({ key, label }) => (
                    <th
                      key={key}
                      scope="col"
                      className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white"
                      aria-sort={
                        sortConfig.key === key
                          ? sortConfig.direction === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                    >
                      <button
                        type="button"
                        onClick={() => handleSort(key)}
                        className="inline-flex items-center gap-2 text-left hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-white/60"
                      >
                        <span>{label}</span>
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {sortedMetrics.map((metric, index) => (
                  <tr
                    key={`${metric.fileUuid}-${index}`}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                      {metric.batchId || '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {metric.createdAt || '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      {formatTime(metric.fileUpload)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {metric.fileUuid || '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {metric.flowUuid || '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {metric.pageCount ?? '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {formatTime(metric.prepareSagePayload)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {formatTime(metric.sageLlmApi)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {formatTime(metric.totalTimeMs)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      )}
    </>
  );
};

const LatencyTracker = ({ flowId: initialFlowId = '' }) => {
  const [productType, setProductType] = useState('lentraV2');
  const productOptions = [
    { key: 'lentraV2', label: 'Lentra V2' },
    { key: 'lentraLOS', label: 'Lentra LOS' },
  ];

  return (
    <section className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-6 flex items-center gap-4 rounded-2xl border border-[#3a9391]/20 bg-white p-4 shadow-md">
          <span className="text-sm font-medium text-gray-700">Product Type:</span>
          <div className="flex gap-2">
            {productOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setProductType(option.key)}
                className={`rounded-lg px-4 py-2 cursor-pointer text-sm font-medium transition ${
                  productType === option.key
                    ? 'bg-[#3a9391] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {productType === 'lentraV2' ? (
          <LentraV2Tracker initialFlowId={initialFlowId} />
        ) : (
          <LentraLOSTracker initialFlowId={initialFlowId} />
        )}
      </div>
    </section>
  );
};

export default LatencyTracker;