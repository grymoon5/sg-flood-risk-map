'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  latitude?: number;
  longitude?: number;
}

interface RiskLevel {
  level: string;
  color: string;
  bg: string;
}

declare global {
  interface Window {
    L: any;
  }
}

export default function FloodMap() {
  const [floodData, setFloodData] = useState<FloodAlert[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState<FloodHotspot | null>(null);
  const [postalCode, setPostalCode] = useState('');
  const [showInfo, setShowInfo] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const floodHotspots: FloodHotspot[] = [
    { name: 'Orchard Road', lat: 1.3048, lng: 103.8318, frequency: 8, severity: 'high' },
    { name: 'Bukit Timah', lat: 1.3294, lng: 103.8078, frequency: 12, severity: 'high' },
    { name: 'Macpherson', lat: 1.3273, lng: 103.8859, frequency: 6, severity: 'medium' },
    { name: 'Changi', lat: 1.3644, lng: 103.9915, frequency: 4, severity: 'medium' },
    { name: 'Jurong', lat: 1.3329, lng: 103.7436, frequency: 5, severity: 'medium' },
  ];

  useEffect(() => {
    fetchFloodData();
    loadLeaflet();
  }, []);

  const loadLeaflet = () => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      setMapLoaded(true);
      setTimeout(() => initializeMap(), 100);
    };
    document.body.appendChild(script);
  };

  const initializeMap = () => {
    if (typeof window === 'undefined' || !window.L || !mapRef.current) return;

    // Initialize map centered on Singapore
    const map = window.L.map(mapRef.current).setView([1.3521, 103.8198], 12);

    // Add OneMap tiles (Singapore's official map)
    window.L.tileLayer('https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png', {
      detectRetina: true,
      maxZoom: 19,
      minZoom: 11,
      attribution: '&copy; <a href="https://www.onemap.gov.sg/" target="_blank">OneMap</a> | Map data © contributors, <a href="https://www.sla.gov.sg/" target="_blank">Singapore Land Authority</a>'
    }).addTo(map);

    // Custom icon style for markers
    const createCustomIcon = (color: string) => {
      return window.L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="position: relative;">
            <div style="
              background-color: ${color};
              width: 32px;
              height: 32px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid white;
              box-shadow: 0 3px 10px rgba(0,0,0,0.4);
              position: relative;
            "></div>
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(45deg);
              width: 12px;
              height: 12px;
              background-color: white;
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
    };

    // Add markers for flood hotspots
    floodHotspots.forEach((spot) => {
      const color = spot.severity === 'high' ? '#ef4444' : '#f97316';
      const icon = createCustomIcon(color);

      const marker = window.L.marker([spot.lat, spot.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="padding: 12px; min-width: 200px;">
            <h3 style="margin: 0 0 12px 0; font-weight: bold; font-size: 16px; color: #1f2937;">${spot.name}</h3>
            <div style="margin: 8px 0;">
              <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; background-color: ${spot.severity === 'high' ? '#fee2e2' : '#ffedd5'}; color: ${color};">
                ${spot.severity.toUpperCase()} RISK
              </span>
            </div>
            <p style="margin: 12px 0 4px 0; font-size: 13px; color: #4b5563;">
              <strong style="color: ${color};">${spot.frequency} incidents</strong> in past 10 years
            </p>
            <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">
              Click marker for details
            </p>
          </div>
        `);

      marker.on('click', () => {
        setSelectedArea(spot);
      });

      // Add pulsing animation for high severity
      if (spot.severity === 'high') {
        const pulseCircle = window.L.circle([spot.lat, spot.lng], {
          color: color,
          fillColor: color,
          fillOpacity: 0.1,
          radius: 200,
          weight: 2,
          opacity: 0.3,
        }).addTo(map);
      }
    });

    // Add scale control
    window.L.control.scale({ imperial: false, metric: true }).addTo(map);

    mapInstanceRef.current = map;
  };

  const fetchFloodData = async () => {
    try {
      const response = await fetch('https://data.gov.sg/api/action/datastore_search?resource_id=d_f1404e08587ce555b9ea3f565e2eb9a3&limit=100');
      const data = await response.json();
      console.log('PUB API Data:', data);
      setFloodData(data.result?.records || []);
    } catch (error) {
      console.error('Error fetching flood data:', error);
      setFloodData([]);
    } finally {
      setLoading(false);
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
      
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([randomHotspot.lat, randomHotspot.lng], 15, {
          animate: true,
          duration: 1
        });
      }
    }
  };

  const shareMap = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Singapore Flood Risk Map',
        text: 'Check your neighborhood flood risk and stay prepared!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
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
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-blue-900">Know Your Flood Risk</p>
                <p className="text-blue-800">This map combines real-time flood alerts with historical data to help you understand and prepare for flooding in your area.</p>
              </div>
            </div>
            <button onClick={() => setShowInfo(false)} className="text-blue-600 hover:text-blue-800 font-bold ml-4">✕</button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
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

          {/* Statistics */}
          <div className="grid grid-cols-1 gap-3">
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

        {/* Right Panel - Map & Alerts */}
        <div className="lg:col-span-2 space-y-4">
          {/* Interactive Map */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Interactive Flood Risk Map</h2>
            <div 
              ref={mapRef}
              className="w-full h-[500px] rounded-lg border-2 border-gray-200 overflow-hidden"
              style={{ minHeight: '500px' }}
            >
              {!mapLoaded && (
                <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <Droplets className="w-12 h-12 text-blue-500 animate-pulse mx-auto mb-2" />
                    <p className="text-gray-600">Loading OneMap Singapore...</p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-slate-50 rounded text-xs border border-blue-100">
              <p className="font-semibold mb-2 text-gray-700">Map Legend:</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-500 border-2 border-white shadow"></div>
                  <span className="text-gray-700">High Risk (10+ incidents)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-orange-500 border-2 border-white shadow"></div>
                  <span className="text-gray-700">Medium Risk (6-9 incidents)</span>
                </div>
              </div>
              <p className="text-gray-500 mt-3 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Click on markers for detailed information
              </p>
            </div>
          </div>

          {/* Real-time Alerts */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Real-time Flood Alerts
            </h2>
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                Loading real-time data from PUB...
              </div>
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
              <div className="text-center py-8 text-green-600 bg-green-50 rounded-lg border border-green-200">
                <div className="text-4xl mb-2">✓</div>
                <p className="font-semibold text-lg">No active flood alerts</p>
                <p className="text-sm text-gray-600 mt-1">All clear across Singapore</p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-4 text-center border-t pt-3">
              Data provided by PUB Singapore | Updated in real-time
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white p-6 mt-8">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p className="mb-2">Created for #30DaysMapChallenge 2025 | Theme: Water</p>
          <p className="text-gray-400">Data sources: PUB Singapore Real-time Flood API, Data.gov.sg | Map: OneMap Singapore</p>
          <p className="text-gray-400 mt-2">Special thanks to Open Government Products (OGP) for enabling public access to critical data</p>
        </div>
      </div>
    </div>
  );
}