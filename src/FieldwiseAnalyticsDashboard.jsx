import React, { useState, useEffect } from 'react';
import { currentUrl, lentra_documents } from './constant';

const FieldwiseAnalyticsDashboard = () => {
    const [openKeys, setOpenKeys] = useState(new Set());
    const [apiData, setApiData] = useState({});
    const [loadingStates, setLoadingStates] = useState({});
    const [errorStates, setErrorStates] = useState({});

    const baseUrl = currentUrl + '/verification/analytics/field-breakdown?documentType=';
    // const baseUrl = prodUrl + '/verification/analytics/field-breakdown?documentType=';

    const fetchDocumentData = async (documentType) => {
        // Don't fetch if data already exists or is currently loading
        if (apiData[documentType] || loadingStates[documentType]) {
            return;
        }

        setLoadingStates(prev => ({ ...prev, [documentType]: true }));
        setErrorStates(prev => ({ ...prev, [documentType]: null }));

        try {
            const response = await fetch(`${baseUrl}${documentType}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            
            // Extract the data from the response structure
            const documentData = result.data?.[documentType] || {};
            setApiData(prev => ({ ...prev, [documentType]: documentData }));
        } catch (error) {
            console.error(`Error fetching data for ${documentType}:`, error);
            setErrorStates(prev => ({ ...prev, [documentType]: error.message }));
        } finally {
            setLoadingStates(prev => ({ ...prev, [documentType]: false }));
        }
    };

    const toggle = (key) => {
        setOpenKeys((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
                // Fetch data when opening an accordion
                fetchDocumentData(key);
            }
            return newSet;
        });
    };

    const getColorClass = (value) => {
        if (value >= 90) return 'text-[#3a9391]';
        if (value >= 80) return 'text-blue-600';
        if (value >= 70) return 'text-yellow-600';
        return 'text-[#d93e3e]';
    };

    const getBarColorClass = (value) => {
        if (value >= 90) return 'bg-[#3a9391]';
        if (value >= 80) return 'bg-blue-500';
        if (value >= 70) return 'bg-yellow-500';
        return 'bg-[#d93e3e]';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Fieldwise Analytics</h1>

                <div className="space-y-6">
                    {lentra_documents.map((docType) => {
                        const isOpen = openKeys.has(docType);
                        const isLoading = loadingStates[docType];
                        const hasError = errorStates[docType];
                        const fields = apiData[docType] || {};
                        
                        return (
                            <div key={docType} className="w-full">
                                <button
                                    onClick={() => toggle(docType)}
                                    className={`w-full cursor-pointer flex items-center justify-between bg-white rounded-lg shadow-sm px-6 py-4 border-l-4 transition-all ${
                                        isOpen ? 'border-l-[#3a9391] border-gray-200' : 'border-l-gray-200 border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <span className="text-lg font-semibold text-gray-800">{docType.replaceAll('_', ' ')}</span>
                                    <div className="flex items-center space-x-2">
                                        {isLoading && (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#3a9391]"></div>
                                        )}
                                        <svg
                                            className={`h-5 w-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.168l3.71-2.938a.75.75 0 111.06 1.06l-4.24 3.36a.75.75 0 01-.94 0l-4.24-3.36a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </button>

                                {isOpen && (
                                    <div className="bg-white rounded-b-lg shadow-md border border-t-0 border-gray-200 px-6 py-6">
                                        {isLoading ? (
                                            <div className="flex items-center justify-center py-12">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3a9391]"></div>
                                                <span className="ml-3 text-gray-600">Loading analytics data...</span>
                                            </div>
                                        ) : hasError ? (
                                            <div className="flex items-center justify-center py-12">
                                                <div className="text-center">
                                                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                                                    <p className="text-red-600 font-medium">Failed to load data</p>
                                                    <p className="text-gray-500 text-sm mt-1">{hasError}</p>
                                                    <button 
                                                        onClick={() => fetchDocumentData(docType)}
                                                        className="mt-4 px-4 py-2 bg-[#3a9391] text-white rounded-lg hover:bg-[#2d7573] transition-colors"
                                                    >
                                                        Retry
                                                    </button>
                                                </div>
                                            </div>
                                        ) : Object.keys(fields).length === 0 ? (
                                            <div className="flex items-center justify-center py-12">
                                                <div className="text-center">
                                                    <div className="text-gray-400 text-6xl mb-4">📊</div>
                                                    <p className="text-gray-500">No data available for this document type</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {Object.entries(fields).map(([fieldName, metrics]) => {
                                                    const extractionRate = Math.round(metrics.successful_extraction_rate * 100) / 100;
                                                    const confidence = Math.round(metrics.average_confidence * 100);
                                                    
                                                    return (
                                                        <div key={fieldName} className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                                                            <div className="mb-4">
                                                                <h3 className="text-lg font-semibold text-gray-800 capitalize">{fieldName.replaceAll('_', ' ')}</h3>
                                                            </div>
                                                            
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <span className="text-sm font-medium text-gray-600">Successful Extraction Rate</span>
                                                                        <span className={`text-2xl font-bold ${getColorClass(extractionRate)}`}>{extractionRate}%</span>
                                                                    </div>
                                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                                        <div 
                                                                            className={`h-2 rounded-full transition-all ${getBarColorClass(extractionRate)}`}
                                                                            style={{ width: `${extractionRate}%` }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                                
                                                                <div>
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <span className="text-sm font-medium text-gray-600">Average Confidence</span>
                                                                        <span className={`text-2xl font-bold ${getColorClass(confidence)}`}>{confidence}%</span>
                                                                    </div>
                                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                                        <div 
                                                                            className={`h-2 rounded-full transition-all ${getBarColorClass(confidence)}`}
                                                                            style={{ width: `${confidence}%` }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FieldwiseAnalyticsDashboard;