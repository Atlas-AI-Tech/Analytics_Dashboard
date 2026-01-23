import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';

// Color mapping based on type - matching LentraPFLCDLDashboard exactly
const TYPE_COLORS = {
  upload: '#f97316',
  'sage-processing': '#3b82f6',
  callbacks: '#10b981',
};

// Generate dummy data (up to 300 records)
const generateDummyData = (count = 300) => {
  const documentTypes = ['PAN', 'Aadhaar', 'Bank Statement', 'Salary Slip', 'Form 16', 'Passport', 'Driving License'];
  const flowUuids = Array.from({ length: 50 }, (_, i) => `flow-${String(i + 1).padStart(3, '0')}`);
  const fileUuids = Array.from({ length: 200 }, (_, i) => `file-${String(i + 1).padStart(4, '0')}`);
  const applicationIds = Array.from({ length: 150 }, (_, i) => `APP${String(i + 1).padStart(6, '0')}`);

  const data = [];
  const now = Date.now();
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < count; i++) {
    const randomTime = new Date(thirtyDaysAgo + Math.random() * (now - thirtyDaysAgo));
    data.push({
      id: i + 1,
      applicationId: applicationIds[Math.floor(Math.random() * applicationIds.length)],
      pageCount: Math.floor(Math.random() * 50) + 1,
      flowUuid: flowUuids[Math.floor(Math.random() * flowUuids.length)],
      fileUuid: fileUuids[Math.floor(Math.random() * fileUuids.length)],
      documentType: documentTypes[Math.floor(Math.random() * documentTypes.length)],
      uploadTime: randomTime.toISOString(),
    });
  }

  return data;
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
      className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-white ${
        sortable ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''
      }`}
      onClick={sortable ? () => onSort(sortKey) : undefined}
    >
      <div className="flex items-center gap-2">
        <span>{label}</span>
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
const DataTable = ({ data, sortConfig, onSort, searchFilters, onSearchChange }) => {
  return (
    <div className="w-full">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white sticky top-0 z-20 shadow-sm">
          {/* Column Headers Row */}
          <tr>
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
          <tr className="bg-gray-50 border-t border-gray-200">
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
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-500">
                No data found
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange, pageSize, onPageSizeChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700">Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white outline-none cursor-pointer"
        >
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Previous
        </button>
        {getPageNumbers().map((page) => (
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
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Next
        </button>
      </div>
      <div className="text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

const V3DetailScreen = () => {
  const { type, status } = useParams();
  const [searchFilters, setSearchFilters] = useState({
    applicationId: '',
    flowUuid: '',
    fileUuid: '',
    documentType: '',
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Get color based on type - matching LentraPFLCDLDashboard section nodes
  const color = TYPE_COLORS[type] || '#d1d5db';

  // Generate dummy data (300 records)
  const allData = useMemo(() => generateDummyData(300), []);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = allData.filter((row) => {
      return (
        row.applicationId.toLowerCase().includes(searchFilters.applicationId.toLowerCase()) &&
        row.flowUuid.toLowerCase().includes(searchFilters.flowUuid.toLowerCase()) &&
        row.fileUuid.toLowerCase().includes(searchFilters.fileUuid.toLowerCase()) &&
        row.documentType.toLowerCase().includes(searchFilters.documentType.toLowerCase())
      );
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === 'uploadTime') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [allData, searchFilters, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  // Reset to page 1 when filters or page size change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchFilters, pageSize]);

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

  const formatTitle = (str) => {
    if (!str) return '';
    return str
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatLabel = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
  };

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
                {formatTitle(type || '')} - {formatLabel(status || '')}
              </h1>
              <p className="text-sm text-gray-600">
                Total Records: {filteredAndSortedData.length}
              </p>
            </div>
            <div
              className="px-4 py-2 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: color }}
            >
              {formatLabel(status || '')}
            </div>
          </div>
        </div>

        {/* Table Section - Scrollable with fixed header and pagination */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 240px)', minHeight: '600px' }}>
          {/* Scrollable Table Content */}
          <div className="flex-1 overflow-y-auto overflow-x-auto">
            <DataTable
              data={paginatedData}
              sortConfig={sortConfig}
              onSort={handleSort}
              searchFilters={searchFilters}
              onSearchChange={handleSearchChange}
            />
          </div>
          
          {/* Fixed Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default V3DetailScreen;
