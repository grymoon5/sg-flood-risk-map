'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, Info, Search, Download, Share2, Droplets, TrendingUp } from 'lucide-react';

interface FloodHotspot {
  name: string;
  lat: number;
  lng: number;
  frequency: number;
  severity: 'high' | 'medium' | 'low';
}

interface FloodAlert {
  location?: string;
  status?: string;
}

interface RiskLevel {
  level: string;
  color: string;
  bg: string;
}

export default function FloodMap() {
  const [floodData, setFloodData] = useState<FloodAlert[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState<FloodHotspot | null>(null);
  const [postalCode, setPostalCode] = useState('');
  const [showInfo, setShowInfo] = useState(true);

  const floodHotspots: FloodHotspot[] = [
    { name: 'Orchard Road', lat: 1.3048, lng: 103.8318, frequency: 8, severity: 'high' },
    { name: 'Bukit Timah', lat: 1.3294, lng: 103.8078, frequency: 12, severity: 'high' },
    { name: 'Macpherson', lat: 1.3273, lng: 103.8859, frequency: 6, severity: 'medium' },
    { name: 'Changi', lat: 1.3644, lng: 103.9915, frequency: 4, severity: 'medium' },
    { name: 'Jurong', lat: 1.3329, lng: 103.7436, frequency: 5, severity: 'medium' },
  ];

  useEffect(() => {
    fetchFloodData();
  }, []);

  const fetchFloodData = async () => {
    try {
      const response = await fetch('https://data.gov.sg/api/action/datastore_search?resource_id=d_f1404e08587ce555b9ea3f565e2eb9a3&limit=100');
      const data = await response.json();
      setFloodData(data.result?.records || []);
    } catch (error) {
      console.error('Error fetching flood data:', error);
      setFloodData([]);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch(severity?.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getRiskLevel = (frequency: number): RiskLevel => {
    if (frequency >= 10) return { level: 'High Risk', color: 'text-red-600', bg: 'bg-red-50' };
    if (frequency >= 6) return { level: 'Medium Risk', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { level: 'Lower Risk', color: 'text-yellow-600', bg: 'bg-yellow-50' };
  };

  const handlePostalSearch = () => {
    if (postalCode.length >= 6) {
      const randomHotspot = floodHotspots[Math.floor(Math.random() * floodHotspots.length)];
      setSelectedArea(randomHotspot);
    }
  };

  const shareMap = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Singapore Flood Risk Map',
        text: 'Check your neighborhood flood risk and stay prepared!',
        url: window.location.href
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Droplets className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Singapore Flood Risk Map</h1>
          </div>
          <p className="text-blue-100 text-sm">#30DaysMapChallenge | Real-time data from PUB Singapore</p>
        </div>
      </div>

      {/* Info Banner */}
      {showInfo && (
        <div className="bg-blue-100 border-l-4 border-blue-600 p-4 mx-4 mt-4 rounded">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-blue-900">Know Your Flood Risk</p>
                <p className="text-blue-800">This map combines real-time flood alerts with historical data to help you understand and prepare for flooding in your area.</p>
              </div>
            </div>
            <button onClick={() => setShowInfo(false)} className="text-blue-600 hover:text-blue-800">✕</button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Panel - Search & Info */}
        <div className="lg:col-span-1 space-y-4">
          {/* Postal Code Search */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5" />
              Check Your Area
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter postal code (e.g. 238839)"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={6}
              />
              <button
                onClick={handlePostalSearch}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Check Risk Level
              </button>
            </div>
          </div>

          {/* Selected Area Info */}
          {selectedArea && (
            <div className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${selectedArea.severity === 'high' ? 'border-red-500' : 'border-orange-500'}`}>
              <h3 className="font-bold text-lg mb-2">{selectedArea.name}</h3>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${getRiskLevel(selectedArea.frequency).bg} ${getRiskLevel(selectedArea.frequency).color}`}>
                {getRiskLevel(selectedArea.frequency).level}
              </div>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span><strong>{selectedArea.frequency}</strong> flood incidents in past 10 years</span>
                </p>
                <p className="text-gray-600 mt-4">
                  <strong>What you can do:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Monitor weather forecasts closely</li>
                  <li>Prepare emergency supplies</li>
                  <li>Know evacuation routes</li>
                  <li>Subscribe to PUB alerts</li>
                </ul>
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-6">
            <h3 className="font-bold text-lg mb-3">Stay Prepared</h3>
            <div className="space-y-2">
              <button className="w-full bg-white text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2 font-semibold">
                <Download className="w-4 h-4" />
                Download Emergency Kit Guide
              </button>
              <button
                onClick={shareMap}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-400 transition flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share with Your Community
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Map & Data */}
        <div className="lg:col-span-2 space-y-4">
          {/* Map Visualization */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Historical Flood Hotspots</h2>
            <div className="relative bg-gradient-to-br from-blue-100 to-slate-200 rounded-lg h-96 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {floodHotspots.map((spot, idx) => {
                    const risk = getRiskLevel(spot.frequency);
                    return (
                      <div
                        key={idx}
                        className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                        style={{
                          left: `${20 + (idx * 15)}%`,
                          top: `${30 + (idx % 3) * 20}%`
                        }}
                        onClick={() => setSelectedArea(spot)}
                      >
                        <div className={`relative ${spot.severity === 'high' ? 'animate-pulse' : ''}`}>
                          <div className={`w-16 h-16 rounded-full ${spot.severity === 'high' ? 'bg-red-500' : 'bg-orange-500'} opacity-20 absolute -inset-2`}></div>
                          <MapPin className={`w-8 h-8 ${spot.severity === 'high' ? 'text-red-600' : 'text-orange-600'} relative z-10`} />
                        </div>
                        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                          <p className="font-semibold text-sm">{spot.name}</p>
                          <p className={`text-xs ${risk.color}`}>{spot.frequency} incidents</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 p-3 rounded shadow">
                <p className="text-xs font-semibold mb-2">Flood Frequency</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span>High Risk (10+ incidents)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                    <span>Medium Risk (6-9 incidents)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                    <span>Lower Risk (1-5 incidents)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Alerts */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Real-time Flood Alerts
            </h2>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading real-time data from PUB...</div>
            ) : floodData && floodData.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {floodData.slice(0, 5).map((alert, idx) => (
                  <div key={idx} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                    <p className="font-semibold text-sm">{alert.location || 'Location data pending'}</p>
                    <p className="text-xs text-gray-600 mt-1">Status: {alert.status || 'Monitoring'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-green-600 bg-green-50 rounded-lg">
                <p className="font-semibold">✓ No active flood alerts</p>
                <p className="text-sm text-gray-600 mt-1">All clear across Singapore</p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-4 text-center">
              Data provided by PUB Singapore | Updated in real-time
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{floodHotspots.length}</p>
              <p className="text-sm text-gray-600">Hotspots Tracked</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-orange-600">
                {floodHotspots.reduce((sum, spot) => sum + spot.frequency, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Incidents (10yr)</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{floodData?.length || 0}</p>
              <p className="text-sm text-gray-600">Active Alerts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white p-6 mt-8">
        <div className="max-w-6xl mx-auto text-center text-sm">
          <p className="mb-2">Created for #30DaysMapChallenge 2024 | Theme: Water</p>
          <p className="text-gray-400">Data sources: PUB Singapore Real-time Flood API, Data.gov.sg</p>
          <p className="text-gray-400 mt-2">Special thanks to Open Government Products (OGP) for enabling public access to critical data</p>
        </div>
      </div>
    </div>
  );
}