import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Calendar } from 'lucide-react';

interface AttendanceLocationData {
  clock_in_latitude?: number;
  clock_in_longitude?: number;
  clock_in_address?: string;
  clock_out_latitude?: number;
  clock_out_longitude?: number;
  clock_out_address?: string;
  time_in?: string;
  time_out?: string;
  record_date?: string;
}

interface AttendanceReviewMapProps {
  attendanceRecord: AttendanceLocationData;
  studentName?: string;
  className?: string;
}

export default function AttendanceReviewMap({ 
  attendanceRecord, 
  studentName = "Student",
  className 
}: AttendanceReviewMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasLocationData = (
    attendanceRecord.clock_in_latitude && attendanceRecord.clock_in_longitude
  ) || (
    attendanceRecord.clock_out_latitude && attendanceRecord.clock_out_longitude
  );

  useEffect(() => {
    if (!mapContainer.current || !hasLocationData) {
      setIsLoading(false);
      return;
    }

    const initializeMap = async () => {
      try {
        // Get Mapbox token from edge function
        const { data, error: tokenError } = await supabase.functions.invoke('get-mapbox-token');
        
        if (tokenError || !data?.token) {
          setError('Could not load map: Token unavailable');
          setIsLoading(false);
          return;
        }

        mapboxgl.accessToken = data.token;
        
        // Create map with default center
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-74.5, 40],
          zoom: 9
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        map.current.on('load', () => {
          setIsLoading(false);
          updateMapMarkers();
        });

      } catch (err) {
        setError('Failed to initialize map');
        setIsLoading(false);
        console.error('Map initialization error:', err);
      }
    };

    initializeMap();

    return () => {
      map.current?.remove();
    };
  }, [hasLocationData]);

  const updateMapMarkers = () => {
    if (!map.current) return;

    // Remove existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());

    const locations = [];
    
    // Add clock in location
    if (attendanceRecord.clock_in_latitude && attendanceRecord.clock_in_longitude) {
      const clockInMarker = new mapboxgl.Marker({ color: '#22c55e' })
        .setLngLat([attendanceRecord.clock_in_longitude, attendanceRecord.clock_in_latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div class="p-3">
            <h3 class="font-semibold text-green-600 flex items-center gap-2 mb-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              Clock In Location
            </h3>
            <div class="space-y-1 text-sm">
              <p><strong>Student:</strong> ${studentName}</p>
              <p><strong>Time:</strong> ${attendanceRecord.time_in || 'N/A'}</p>
              <p><strong>Date:</strong> ${attendanceRecord.record_date || 'N/A'}</p>
              ${attendanceRecord.clock_in_address ? `<p><strong>Address:</strong> ${attendanceRecord.clock_in_address}</p>` : ''}
              <p class="text-gray-500"><strong>Coordinates:</strong> ${attendanceRecord.clock_in_latitude.toFixed(6)}, ${attendanceRecord.clock_in_longitude.toFixed(6)}</p>
            </div>
          </div>
        `))
        .addTo(map.current);
      
      locations.push([attendanceRecord.clock_in_longitude, attendanceRecord.clock_in_latitude]);
    }

    // Add clock out location
    if (attendanceRecord.clock_out_latitude && attendanceRecord.clock_out_longitude) {
      const clockOutMarker = new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat([attendanceRecord.clock_out_longitude, attendanceRecord.clock_out_latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div class="p-3">
            <h3 class="font-semibold text-red-600 flex items-center gap-2 mb-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
              Clock Out Location
            </h3>
            <div class="space-y-1 text-sm">
              <p><strong>Student:</strong> ${studentName}</p>
              <p><strong>Time:</strong> ${attendanceRecord.time_out || 'N/A'}</p>
              <p><strong>Date:</strong> ${attendanceRecord.record_date || 'N/A'}</p>
              ${attendanceRecord.clock_out_address ? `<p><strong>Address:</strong> ${attendanceRecord.clock_out_address}</p>` : ''}
              <p class="text-gray-500"><strong>Coordinates:</strong> ${attendanceRecord.clock_out_latitude.toFixed(6)}, ${attendanceRecord.clock_out_longitude.toFixed(6)}</p>
            </div>
          </div>
        `))
        .addTo(map.current);
      
      locations.push([attendanceRecord.clock_out_longitude, attendanceRecord.clock_out_latitude]);
    }

    // Fit map to show all locations
    if (locations.length > 0) {
      if (locations.length === 1) {
        map.current.setCenter(locations[0] as [number, number]);
        map.current.setZoom(15);
      } else {
        const bounds = new mapboxgl.LngLatBounds();
        locations.forEach(location => bounds.extend(location as [number, number]));
        map.current.fitBounds(bounds, { padding: 50 });
      }
    }
  };

  useEffect(() => {
    updateMapMarkers();
  }, [attendanceRecord]);

  if (!hasLocationData) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Attendance Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No location data available for this attendance record</p>
            <p className="text-sm">Location tracking was not enabled when this record was submitted</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Attendance Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Attendance Locations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50 animate-pulse" />
            <p>Loading map...</p>
          </div>
        ) : (
          <>
            <div ref={mapContainer} className="w-full h-64 rounded-lg mb-4" />
            
            {/* Location Summary */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4" />
                <span>Attendance Summary for {studentName}</span>
              </div>
              
              <div className="grid gap-2">
                {attendanceRecord.clock_in_latitude && attendanceRecord.clock_in_longitude && (
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="h-4 w-4" />
                        <span>Clock In: {attendanceRecord.time_in || 'N/A'}</span>
                      </div>
                      {attendanceRecord.clock_in_address && (
                        <p className="text-sm text-muted-foreground">{attendanceRecord.clock_in_address}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {attendanceRecord.clock_in_latitude.toFixed(6)}, {attendanceRecord.clock_in_longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
                )}
                
                {attendanceRecord.clock_out_latitude && attendanceRecord.clock_out_longitude && (
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5"></div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="h-4 w-4" />
                        <span>Clock Out: {attendanceRecord.time_out || 'N/A'}</span>
                      </div>
                      {attendanceRecord.clock_out_address && (
                        <p className="text-sm text-muted-foreground">{attendanceRecord.clock_out_address}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {attendanceRecord.clock_out_latitude.toFixed(6)}, {attendanceRecord.clock_out_longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}