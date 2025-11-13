import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
const MOCK_FLOW_METRICS = {
  FLOW_91FD4C31: [
    {
      fileId: 'FILE_4B1E9102',
      docType: 'PAN',
      fileUploadTimeIST: '2025-11-12T09:42:15+05:30',
      totalTimeTaken: 4820,
      timings: {
        fileUploadTime: 640,
        grayScalingTime: 870,
        sageAPITime: 1520,
        filePixelConversion: 410,
        reduct: 380,
        lentraAuth: 620,
        callbackSuccess: 260,
        miscellaneous: 120,
      },
    },
    {
      fileId: 'FILE_2AB01F44',
      docType: 'BANK_STATEMENT',
      fileUploadTimeIST: '2025-11-12T09:44:02+05:30',
      totalTimeTaken: 5635,
      timings: {
        fileUploadTime: 710,
        grayScalingTime: 940,
        sageAPITime: 1890,
        filePixelConversion: 520,
        reduct: 455,
        lentraAuth: 760,
        callbackSuccess: 300,
        miscellaneous: 60,
      },
    },
    {
      fileId: 'FILE_8D42A719',
      docType: 'AADHAAR',
      fileUploadTimeIST: '2025-11-12T09:47:28+05:30',
      totalTimeTaken: 4385,
      timings: {
        fileUploadTime: 560,
        grayScalingTime: 810,
        sageAPITime: 1395,
        filePixelConversion: 350,
        reduct: 320,
        lentraAuth: 570,
        callbackSuccess: 240,
        miscellaneous: 140,
      },
    },
    {
      fileId: 'FILE_5E73C192',
      docType: 'GST_CERT',
      fileUploadTimeIST: '2025-11-12T09:50:11+05:30',
      totalTimeTaken: 6020,
      timings: {
        fileUploadTime: 690,
        grayScalingTime: 1025,
        sageAPITime: 1980,
        filePixelConversion: 540,
        reduct: 490,
        lentraAuth: 830,
        callbackSuccess: 290,
        miscellaneous: 175,
      },
    },
    {
      fileId: 'FILE_3F18D407',
      docType: 'SALE_DEED',
      fileUploadTimeIST: '2025-11-12T09:54:36+05:30',
      totalTimeTaken: 7450,
      timings: {
        fileUploadTime: 920,
        grayScalingTime: 1280,
        sageAPITime: 2460,
        filePixelConversion: 760,
        reduct: 710,
        lentraAuth: 930,
        callbackSuccess: 250,
        miscellaneous: 140,
      },
    },
    {
      fileId: 'FILE_9A5D2304',
      docType: 'PURCHASE_ORDER',
      fileUploadTimeIST: '2025-11-12T09:58:03+05:30',
      totalTimeTaken: 5210,
      timings: {
        fileUploadTime: 640,
        grayScalingTime: 885,
        sageAPITime: 1695,
        filePixelConversion: 470,
        reduct: 450,
        lentraAuth: 660,
        callbackSuccess: 260,
        miscellaneous: 150,
      },
    },
    {
      fileId: 'FILE_1B0C8F65',
      docType: 'EBILL',
      fileUploadTimeIST: '2025-11-12T10:01:27+05:30',
      totalTimeTaken: 3965,
      timings: {
        fileUploadTime: 470,
        grayScalingTime: 690,
        sageAPITime: 1220,
        filePixelConversion: 315,
        reduct: 285,
        lentraAuth: 545,
        callbackSuccess: 260,
        miscellaneous: 180,
      },
    },
    {
      fileId: 'FILE_6F7BC903',
      docType: 'INDEX_2',
      fileUploadTimeIST: '2025-11-12T10:03:58+05:30',
      totalTimeTaken: 5840,
      timings: {
        fileUploadTime: 670,
        grayScalingTime: 960,
        sageAPITime: 1840,
        filePixelConversion: 510,
        reduct: 460,
        lentraAuth: 790,
        callbackSuccess: 300,
        miscellaneous: 210,
      },
    },
    {
      fileId: 'FILE_7D4E2309',
      docType: 'UDYAM_CERT',
      fileUploadTimeIST: '2025-11-12T10:07:41+05:30',
      totalTimeTaken: 5525,
      timings: {
        fileUploadTime: 620,
        grayScalingTime: 930,
        sageAPITime: 1760,
        filePixelConversion: 465,
        reduct: 420,
        lentraAuth: 750,
        callbackSuccess: 295,
        miscellaneous: 285,
      },
    },
    {
      fileId: 'FILE_0C5A12E7',
      docType: 'LAD_LOAN_DOC',
      fileUploadTimeIST: '2025-11-12T10:11:05+05:30',
      totalTimeTaken: 6180,
      timings: {
        fileUploadTime: 710,
        grayScalingTime: 990,
        sageAPITime: 2015,
        filePixelConversion: 530,
        reduct: 505,
        lentraAuth: 860,
        callbackSuccess: 315,
        miscellaneous: 255,
      },
    },
    {
      fileId: 'FILE_D3A1840F',
      docType: 'BANK_STATEMENT',
      fileUploadTimeIST: '2025-11-12T10:14:52+05:30',
      totalTimeTaken: 5795,
      timings: {
        fileUploadTime: 680,
        grayScalingTime: 970,
        sageAPITime: 1885,
        filePixelConversion: 520,
        reduct: 480,
        lentraAuth: 805,
        callbackSuccess: 310,
        miscellaneous: 245,
      },
    },
    {
      fileId: 'FILE_4D7B6102',
      docType: 'ACH_FORM',
      fileUploadTimeIST: '2025-11-12T10:18:26+05:30',
      totalTimeTaken: 4590,
      timings: {
        fileUploadTime: 550,
        grayScalingTime: 820,
        sageAPITime: 1450,
        filePixelConversion: 360,
        reduct: 330,
        lentraAuth: 600,
        callbackSuccess: 280,
        miscellaneous: 200,
      },
    },
    {
      fileId: 'FILE_6C3B08D7',
      docType: 'EBILL',
      fileUploadTimeIST: '2025-11-12T10:21:33+05:30',
      totalTimeTaken: 4025,
      timings: {
        fileUploadTime: 480,
        grayScalingTime: 705,
        sageAPITime: 1255,
        filePixelConversion: 325,
        reduct: 300,
        lentraAuth: 550,
        callbackSuccess: 255,
        miscellaneous: 160,
      },
    },
  ],
  FLOW_3AA7F9BE: [
    {
      fileId: 'FILE_7CD91AE0',
      docType: 'AADHAAR',
      fileUploadTimeIST: '2025-11-11T18:11:45+05:30',
      totalTimeTaken: 4265,
      timings: {
        fileUploadTime: 520,
        grayScalingTime: 780,
        sageAPITime: 1375,
        filePixelConversion: 365,
        reduct: 330,
        lentraAuth: 520,
        callbackSuccess: 250,
        miscellaneous: 125,
      },
    },
    {
      fileId: 'FILE_1E4F8C30',
      docType: 'GST_CERT',
      fileUploadTimeIST: '2025-11-11T18:16:27+05:30',
      totalTimeTaken: 6120,
      timings: {
        fileUploadTime: 760,
        grayScalingTime: 1040,
        sageAPITime: 2130,
        filePixelConversion: 600,
        reduct: 520,
        lentraAuth: 690,
        callbackSuccess: 310,
        miscellaneous: 70,
      },
    },
    {
      fileId: 'FILE_EF4A21B9',
      docType: 'SALE_DEED',
      fileUploadTimeIST: '2025-11-11T18:22:04+05:30',
      totalTimeTaken: 7355,
      timings: {
        fileUploadTime: 905,
        grayScalingTime: 1255,
        sageAPITime: 2415,
        filePixelConversion: 775,
        reduct: 685,
        lentraAuth: 915,
        callbackSuccess: 245,
        miscellaneous: 160,
      },
    },
    {
      fileId: 'FILE_2C0A5F33',
      docType: 'BANK_STATEMENT',
      fileUploadTimeIST: '2025-11-11T18:28:18+05:30',
      totalTimeTaken: 5865,
      timings: {
        fileUploadTime: 690,
        grayScalingTime: 970,
        sageAPITime: 1920,
        filePixelConversion: 505,
        reduct: 470,
        lentraAuth: 790,
        callbackSuccess: 315,
        miscellaneous: 205,
      },
    },
    {
      fileId: 'FILE_5A9D4B81',
      docType: 'ACH_FORM',
      fileUploadTimeIST: '2025-11-11T18:33:47+05:30',
      totalTimeTaken: 4680,
      timings: {
        fileUploadTime: 560,
        grayScalingTime: 830,
        sageAPITime: 1480,
        filePixelConversion: 365,
        reduct: 330,
        lentraAuth: 620,
        callbackSuccess: 285,
        miscellaneous: 210,
      },
    },
  ],
};

const MOCK_FLOW_IDS = Object.keys(MOCK_FLOW_METRICS);
const isDevEnvironment = import.meta.env?.DEV ?? false;

import {
  AlertCircle,
  ArrowUpDown,
  CalendarClock,
  Download,
  Loader2,
  RefreshCcw,
} from 'lucide-react';
import { currentUrl } from './constant';

const API_ENDPOINT = `${currentUrl}/verification/flows/metrics`;
const PAGE_SIZE_OPTIONS = [10, 25, 50];
const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0];

const LatencyTracker = ({ flowId: initialFlowId = '' }) => {
  const [flowIdInput, setFlowIdInput] = useState(initialFlowId);
  const [activeFlowId, setActiveFlowId] = useState(initialFlowId);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: 'fileUploadTimeIST',
    direction: 'asc',
  });

  const totalPages = Math.max(
    1,
    Math.ceil(metrics.length / pageSize),
  );

  const resetPagination = () => {
    setCurrentPage(1);
  };

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
    resetPagination();
  };

  const sortedMetrics = useMemo(() => {
    if (!sortConfig.key) {
      return metrics;
    }
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

  const paginatedMetrics = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    return sortedMetrics.slice(startIdx, endIdx);
  }, [currentPage, pageSize, sortedMetrics]);

  const fetchMetrics = useCallback(
    async (flow) => {
      if (!flow) {
        setMetrics([]);
        setError(null);
        setUsingMockData(false);
        return;
      }

      if (isDevEnvironment && MOCK_FLOW_METRICS[flow]) {
        setMetrics(MOCK_FLOW_METRICS[flow]);
        setUsingMockData(true);
        setError(null);
        setLoading(false);
        resetPagination();
        return;
      }

      setLoading(true);
      setUsingMockData(false);
      setError(null);
      try {
        const response = await fetch(
          `${API_ENDPOINT}?flow_id=${encodeURIComponent(flow)}`,
        );

        let payload = null;
        if (!response.ok) {
          payload = await response.json().catch(() => null);
          throw new Error(
            payload?.error || `Failed to fetch metrics for flow ${flow}`,
          );
        }

        payload = payload ?? (await response.json());

        const data = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
          ? payload
          : [];

        if (data.length === 0 && MOCK_FLOW_METRICS[flow]) {
          setMetrics(MOCK_FLOW_METRICS[flow]);
          setUsingMockData(true);
        } else {
          setMetrics(data);
          setUsingMockData(false);
        }
        resetPagination();
      } catch (err) {
        if (MOCK_FLOW_METRICS[flow]) {
          setMetrics(MOCK_FLOW_METRICS[flow]);
          setUsingMockData(true);
          setError(null);
        } else {
          setError(err.message || 'Unable to load latency metrics');
          setMetrics([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (initialFlowId) {
      fetchMetrics(initialFlowId);
    }
  }, [initialFlowId, fetchMetrics]);

  useEffect(() => {
    setActiveFlowId(initialFlowId);
    setFlowIdInput(initialFlowId);
  }, [initialFlowId]);

  useEffect(() => {
    if (!initialFlowId && isDevEnvironment && MOCK_FLOW_IDS.length > 0) {
      const demoFlowId = MOCK_FLOW_IDS[0];
      setFlowIdInput(demoFlowId);
      setActiveFlowId(demoFlowId);
      setMetrics(MOCK_FLOW_METRICS[demoFlowId]);
      setUsingMockData(true);
      setLoading(false);
      resetPagination();
    }
    // We want this to run only once on mount for local preview purposes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (!flow) {
      return;
    }
    setFlowIdInput(flow);
    setActiveFlowId(flow);
    if (MOCK_FLOW_METRICS[flow]) {
      setMetrics(MOCK_FLOW_METRICS[flow]);
      setUsingMockData(true);
      setError(null);
      setLoading(false);
      resetPagination();
    } else {
      fetchMetrics(flow);
    }
  };

  const handleRetry = () => {
    fetchMetrics(activeFlowId);
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (direction === 'prev') {
        return Math.max(1, prev - 1);
      }
      if (direction === 'next') {
        return Math.min(totalPages, prev + 1);
      }
      return prev;
    });
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    resetPagination();
  };

  const downloadCSV = () => {
    if (!metrics.length) return;

    const headers = [
      'fileId',
      'docType',
      'fileUploadTimeIST',
      'totalTimeTaken',
      'fileUploadTime',
      'grayScalingTime',
      'sageAPITime',
      'filePixelConversion',
      'reduct',
      'lentraAuth',
      'callbackSuccess',
      'miscellaneous',
    ];

    const rows = metrics.map((metric) => [
      metric.fileId ?? '',
      metric.docType ?? '',
      metric.fileUploadTimeIST ?? '',
      metric.totalTimeTaken ?? '',
      metric.timings?.fileUploadTime ?? '',
      metric.timings?.grayScalingTime ?? '',
      metric.timings?.sageAPITime ?? '',
      metric.timings?.filePixelConversion ?? '',
      metric.timings?.reduct ?? '',
      metric.timings?.lentraAuth ?? '',
      metric.timings?.callbackSuccess ?? '',
      metric.timings?.miscellaneous ?? '',
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

  const tableHeaders = [
    { key: 'fileId', label: 'File ID' },
    { key: 'docType', label: 'Document Type' },
    { key: 'fileUploadTimeIST', label: 'Upload Time (IST)' },
    { key: 'totalTimeTaken', label: 'Total Time Taken (ms)' },
    { key: 'fileUploadTime', label: 'Upload (ms)', tooltip: 'Time between file upload initiation and completion' },
    { key: 'grayScalingTime', label: 'Gray Scaling (ms)', tooltip: 'Image preprocessing duration' },
    { key: 'sageAPITime', label: 'Sage API (ms)', tooltip: 'External Sage API processing time' },
    { key: 'filePixelConversion', label: 'Pixel Conversion (ms)', tooltip: 'Time taken to convert document pixels' },
    { key: 'reduct', label: 'Reduct (ms)', tooltip: 'Document reduction pipeline duration' },
    { key: 'lentraAuth', label: 'Lentra Auth (ms)', tooltip: 'Authentication call to Lentra services' },
    { key: 'callbackSuccess', label: 'Callback (ms)', tooltip: 'Callback acknowledgement time' },
    { key: 'miscellaneous', label: 'Misc (ms)', tooltip: 'Other processing tasks' },
  ];

  return (
    <section className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-8 flex flex-col gap-4 rounded-2xl border border-[#3a9391]/20 bg-white p-6 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Flow Latency Tracker
              </h1>
              <p className="text-sm text-gray-600">
                Monitor processing metrics for a specific flow to diagnose performance bottlenecks.
              </p>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              disabled={!activeFlowId || loading}
              className="inline-flex items-center gap-2 rounded-lg border border-[#3a9391]/60 bg-[#3a9391] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#347f7d] disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-200"
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
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3a9391] px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#347f7d] focus:outline-none focus:ring-2 focus:ring-[#3a9391] focus:ring-offset-2"
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
              Active Flow:{' '}
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
              <p className="font-medium text-gray-800">
                Fetching latency metrics…
              </p>
              <p className="text-sm text-gray-600">
                Please wait while we retrieve the latest processing data.
              </p>
            </div>
          </div>
        )}

        {!loading && !metrics.length && activeFlowId && !error && (
          <div className="mb-8 rounded-2xl border border-[#3a9391]/20 bg-white p-6 text-sm text-gray-600 shadow-md">
            No latency metrics were found for the selected flow. Try refreshing or checking the flow ID.
          </div>
        )}

        {metrics.length > 0 && (
          <article className="rounded-2xl border border-[#3a9391]/20 bg-white p-6 shadow-md">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <label className="flex items-center gap-2">
                  <span>Rows per page</span>
                  <select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="rounded-lg border border-gray-300 px-3 py-1 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#3a9391]"
                    aria-label="Rows per page"
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </label>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#3a9391]/10 px-3 py-1 text-xs font-medium text-[#3a9391]">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange('prev')}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => handlePageChange('next')}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
                >
                  Next
                </button>
                {/* <button
                  type="button"
                  onClick={downloadCSV}
                  disabled={!metrics.length}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#3a9391]/60 bg-[#3a9391] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#347f7d] disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-200"
                >
                  <Download size={16} />
                  Export CSV
                </button> */}
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
                  {paginatedMetrics.map((metric, index) => (
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
                        {metric.fileUploadTimeIST || '—'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                        {metric.totalTimeTaken ?? '—'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                        {metric.timings?.fileUploadTime ?? '—'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                        {metric.timings?.grayScalingTime ?? '—'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                        {metric.timings?.sageAPITime ?? '—'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                        {metric.timings?.filePixelConversion ?? '—'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                        {metric.timings?.reduct ?? '—'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                        {metric.timings?.lentraAuth ?? '—'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                        {metric.timings?.callbackSuccess ?? '—'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                        {metric.timings?.miscellaneous ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        )}
    </div>
    </section>
  );
};

export default LatencyTracker;