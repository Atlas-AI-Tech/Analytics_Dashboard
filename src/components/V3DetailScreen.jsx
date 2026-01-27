import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import {
  DEFAULT_ENVIRONMENT,
  SANDBOXES,
  V3_ANALYTICS_STATUSES_BY_VIEW,
  V3_ANALYTICS_VIEWS,
} from '../constant';
import { fetchV3Analytics, fetchV3AnalyticsSummarySpreadsheet } from '../services/v3Analytics';

// Color mapping based on type - matching LentraPFLCDLDashboard exactly
const TYPE_COLORS = {
  upload: '#f97316',
  'sage-processing': '#3b82f6',
  callbacks: '#10b981',
};

// Search Input Component
const SearchInput = ({ value, onChange, placeholder }) => {
  return (
    <div className="relative">
      <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs bg-white outline-none"
      />
    </div>
  );
};

// Sortable Table Header Component
const SortableHeader = ({ label, sortKey, currentSort, onSort, sortable = false }) => {
  const isActive = currentSort.key === sortKey;
  const sortDirection = isActive ? currentSort.direction : null;

  return (
    <th
      className={`px-4 py-3 text-left  text-xs font-semibold text-gray-700 uppercase tracking-wider bg-white ${
        sortable ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''
      }`}
      onClick={sortable ? () => onSort(sortKey) : undefined}
    >
      <div className="flex items-center gap-2">
        <span >{label}</span>
        {sortable && (
          <div className="flex flex-col">
            <ChevronUp
              size={14}
              className={`-mb-1 ${
                isActive && sortDirection === 'asc' ? 'text-[#3a9391]' : 'text-gray-300'
              }`}
            />
            <ChevronDown
              size={14}
              className={`${
                isActive && sortDirection === 'desc' ? 'text-[#3a9391]' : 'text-gray-300'
              }`}
            />
          </div>
        )}
      </div>
    </th>
  );
};

// Data Table Component
const DataTable = ({ data, sortConfig, onSort, searchFilters, onSearchChange, currentPage, pageSize, loading }) => {
  return (
    <div className="w-full">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white sticky top-0 z-20 shadow-sm">
          {/* Column Headers Row */}
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Sr No
            </th>
            <SortableHeader
              label="Application ID"
              sortKey="applicationId"
              currentSort={sortConfig}
              onSort={onSort}
              sortable={false}
            />
            <SortableHeader
              label="Page Count"
              sortKey="pageCount"
              currentSort={sortConfig}
              onSort={onSort}
              sortable={true}
            />
            <SortableHeader
              label="Flow UUID"
              sortKey="flowUuid"
              currentSort={sortConfig}
              onSort={onSort}
              sortable={false}
            />
            <SortableHeader
              label="File UUID"
              sortKey="fileUuid"
              currentSort={sortConfig}
              onSort={onSort}
              sortable={false}
            />
            <SortableHeader
              label="Document Type"
              sortKey="documentType"
              currentSort={sortConfig}
              onSort={onSort}
              sortable={false}
            />
            <SortableHeader
              label="Upload Time"
              sortKey="uploadTime"
              currentSort={sortConfig}
              onSort={onSort}
              sortable={true}
            />
          </tr>
          {/* Search Inputs Row */}
          <tr className="bg-gray-50">
            <th className="px-4 py-2">
              {/* No search for Sr. No */}
            </th>
            <th className="px-4 py-2">
              <SearchInput
                value={searchFilters.applicationId}
                onChange={(value) => onSearchChange('applicationId', value)}
                placeholder="Search Application ID..."
              />
            </th>
            <th className="px-4 py-2">
              {/* No search for Page Count */}
            </th>
            <th className="px-4 py-2">
              <SearchInput
                value={searchFilters.flowUuid}
                onChange={(value) => onSearchChange('flowUuid', value)}
                placeholder="Search Flow UUID..."
              />
            </th>
            <th className="px-4 py-2">
              <SearchInput
                value={searchFilters.fileUuid}
                onChange={(value) => onSearchChange('fileUuid', value)}
                placeholder="Search File UUID..."
              />
            </th>
            <th className="px-4 py-2">
              <SearchInput
                value={searchFilters.documentType}
                onChange={(value) => onSearchChange('documentType', value)}
                placeholder="Search Document Type..."
              />
            </th>
            <th className="px-4 py-2">
              {/* No search for Upload Time */}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-500">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-500">
                No data found
              </td>
            </tr>
          ) : (
            data.map((row, index) => {
              // Calculate serial number based on page number
              const serialNumber = (currentPage - 1) * pageSize + index + 1;
              return (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {serialNumber}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {row.applicationId}
                  </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {row.pageCount}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-mono text-xs">
                  {row.flowUuid}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-mono text-xs">
                  {row.fileUuid}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {row.documentType}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {new Date(row.uploadTime).toLocaleString()}
                </td>
              </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageItems = useMemo(() => {
    if (!Number.isFinite(totalPages) || totalPages <= 1) return [1];

    const pages = new Set();

    // Always show first 4 pages (or fewer if totalPages is small)
    const firstCount = Math.min(4, totalPages);
    for (let i = 1; i <= firstCount; i++) pages.add(i);

    // Always show last page
    pages.add(totalPages);

    // Show current page neighborhood if we're beyond the first group
    if (currentPage > 4 && currentPage < totalPages) {
      pages.add(currentPage - 1);
      pages.add(currentPage);
      pages.add(currentPage + 1);
    }

    // If we're near the end, show the last few pages too
    if (currentPage >= totalPages - 2) {
      pages.add(totalPages - 2);
      pages.add(totalPages - 1);
    }

    const sorted = Array.from(pages)
      .filter((p) => p >= 1 && p <= totalPages)
      .sort((a, b) => a - b);

    // Insert ellipsis for gaps
    const items = [];
    for (let i = 0; i < sorted.length; i++) {
      const page = sorted[i];
      const prev = sorted[i - 1];
      if (i > 0 && page - prev > 1) items.push('ellipsis');
      items.push(page);
    }
    return items;
  }, [currentPage, totalPages]);

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
      <div className="flex w-full justify-center items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Previous
        </button>
        {pageItems.map((item, idx) => {
          if (item === 'ellipsis') {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 py-1.5 text-sm text-gray-500 select-none">
                ...
              </span>
            );
          }

          const page = item;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1.5 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                currentPage === page
                  ? 'bg-[#3a9391] text-white border-[#3a9391]'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Next
        </button>
      </div>
      {/* <div className="text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </div> */}
    </div>
  );
};

const V3DetailScreen = () => {
  const { type, status } = useParams();
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const sandboxParam = searchParams.get('sandbox');
  const sandbox = Object.values(SANDBOXES).includes(sandboxParam) ? sandboxParam : SANDBOXES.LENTRA;

  const [selectedView, setSelectedView] = useState(type);
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    applicationId: '',
    flowUuid: '',
    fileUuid: '',
    documentType: '',
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [downloadingAllRecords, setDownloadingAllRecords] = useState(false);
  const pageSize = 100;

  // Get color based on type - matching LentraPFLCDLDashboard section nodes
  const color = TYPE_COLORS[selectedView] || '#d1d5db';

  const isValidView = useMemo(() => {
    return Object.values(V3_ANALYTICS_VIEWS).includes(selectedView);
  }, [selectedView]);

  const isValidStatus = useMemo(() => {
    if (!isValidView) return false;
    const allowed = Object.values(V3_ANALYTICS_STATUSES_BY_VIEW?.[selectedView] || {});
    return allowed.includes(selectedStatus);
  }, [isValidView, selectedView, selectedStatus]);

  // Keep state in sync with route params
  useEffect(() => {
    setSelectedView(type);
    setSelectedStatus(status);
    setCurrentPage(1);
    setTotalPages(1);
    setTableData([]);
    setError(null);
    setTotalCount(null);
  }, [type, status]);

  // Clear data immediately when view changes
  useEffect(() => {
    setTableData([]);
  }, [selectedView]);

  // Reset page number when view or status changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedView, selectedStatus]);

  // Fetch analytics data whenever view/status/page changes (and params are valid)
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!isValidView || !isValidStatus) return;
      if (!currentPage || currentPage < 1) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetchV3Analytics({
          sandbox,
          environment: DEFAULT_ENVIRONMENT,
          view: selectedView,
          status: selectedStatus,
          pageNumber: currentPage,
        });

        if (cancelled) return;

        const rows = Array.isArray(response?.data) ? response.data : [];
        const mapped = rows.map((r, idx) => {
          const createdAt = r?.created_at ?? null;
          return {
            id:
              r?.file_uuid ||
              `${r?.flow_uuid ?? ''}-${r?.application_id ?? ''}-${createdAt ?? ''}-${idx}`,
            applicationId: r?.application_id ?? '',
            pageCount: r?.page_count ?? null,
            flowUuid: r?.flow_uuid ?? '',
            fileUuid: r?.file_uuid ?? '',
            documentType: r?.document_type ?? '',
            uploadTime: createdAt,
          };
        });

        const pagination = response?.pagination || null;
        const apiCurrentPage = Number(pagination?.current_page ?? response?.current_page) || 1;
        const apiTotalPages = Number(pagination?.total_pages ?? response?.total_pages) || 1;
        const apiTotalCount =
          pagination?.total_count !== undefined && pagination?.total_count !== null
            ? Number(pagination.total_count)
            : null;

        setTableData(mapped);
        setCurrentPage(apiCurrentPage);
        setTotalPages(apiTotalPages);
        setTotalCount(Number.isFinite(apiTotalCount) ? apiTotalCount : null);
      } catch (e) {
        if (cancelled) return;
        setTableData([]);
        setCurrentPage(1);
        setTotalPages(1);
        setError(e?.message || 'Error fetching data');
        setTotalCount(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [sandbox, selectedView, selectedStatus, currentPage, isValidView, isValidStatus]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = tableData.filter((row) => {
      return (
        (row.applicationId || '').toLowerCase().includes(searchFilters.applicationId.toLowerCase()) &&
        (row.flowUuid || '').toLowerCase().includes(searchFilters.flowUuid.toLowerCase()) &&
        (row.fileUuid || '').toLowerCase().includes(searchFilters.fileUuid.toLowerCase()) &&
        (row.documentType || '').toLowerCase().includes(searchFilters.documentType.toLowerCase())
      );
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === 'uploadTime') {
          aVal = aVal ? new Date(aVal).getTime() : 0;
          bVal = bVal ? new Date(bVal).getTime() : 0;
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [tableData, searchFilters, sortConfig]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchFilters]);

  const handleSort = (key) => {
    setSortConfig((current) => {
      if (current.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleSearchChange = (field, value) => {
    setSearchFilters((prev) => ({ ...prev, [field]: value }));
  };

  const downloadBase64File = ({ base64, contentType, filename }) => {
    if (!base64) throw new Error('Empty file payload');

    // Convert base64 -> bytes -> Blob
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: contentType || 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'analytics_details.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  const handleDownloadAllRecords = async () => {
    if (downloadingAllRecords) return;
    if (!isValidView || !isValidStatus) return;

    setDownloadingAllRecords(true);
    setError(null);

    try {
      const payload = await fetchV3AnalyticsSummarySpreadsheet({
        sandbox,
        environment: DEFAULT_ENVIRONMENT,
        view: selectedView,
        status: selectedStatus,
      });

      const file = payload?.file;
      downloadBase64File({
        base64: file?.data_base64,
        contentType: file?.content_type,
        filename: file?.filename,
      });
    } catch (e) {
      setError(e?.message || 'Failed to download CSV');
    } finally {
      setDownloadingAllRecords(false);
    }
  };

  const formatTitle = (str) => {
    if (!str) return '';
    return str
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatLabel = (str) => {
    if (!str) return '';
    const withSpaces = str.replace(/_/g, ' ').replace(/-/g, ' ');
    return withSpaces
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const hasActiveSearch = useMemo(() => {
    return Object.values(searchFilters).some((v) => String(v || '').trim().length > 0);
  }, [searchFilters]);

  const headerTotalRecords =
    hasActiveSearch || totalCount === null ? filteredAndSortedData.length : totalCount;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section - Using exact same color styling as section nodes */}
        <div
          className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 transition-all"
          style={{ borderColor: color }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-2xl font-bold text-gray-800 mb-2"
                style={{ color: color }}
              >
                {formatTitle(selectedView || '')} - {formatLabel(selectedStatus || '')}
              </h1>
              <p className="text-sm text-gray-600">
                Total Records: {headerTotalRecords}
              </p>
            </div>
            <div className='flex items-center gap-4'>
            <div
              className="px-4 py-2 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: color }}
            >
              {formatLabel(selectedStatus || '')}
            </div>
            <button
              type="button"
              onClick={handleDownloadAllRecords}
              disabled={downloadingAllRecords || !isValidView || !isValidStatus}
              className="text-sm px-6 cursor-pointer py-2 bg-[#3a9391] text-white rounded-full font-medium hover:bg-[#3a9391] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {downloadingAllRecords ? 'Downloading…' : 'Download All Records'}
            </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-[#d93e3e] border border-[#d93e3e] rounded-lg p-4 mb-6">
            <p className="text-white">{error}</p>
          </div>
        )}

        {/* Table Section - Scrollable with fixed header and pagination */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 240px)', minHeight: '600px' }}>
          {/* Scrollable Table Content */}
          <div className="flex-1 overflow-y-auto overflow-x-auto">
            <DataTable
              data={filteredAndSortedData}
              sortConfig={sortConfig}
              onSort={handleSort}
              searchFilters={searchFilters}
              onSearchChange={handleSearchChange}
              currentPage={currentPage}
              pageSize={pageSize}
              loading={loading}
            />
          </div>
          
          {/* Fixed Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default V3DetailScreen;
