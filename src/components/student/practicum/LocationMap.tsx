import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock } from 'lucide-react';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
}

interface LocationMapProps {
  clockInLocation?: LocationData | null;
  clockOutLocation?: LocationData | null;
  className?: string;
}

export default function LocationMap({ clockInLocation, clockOutLocation, className }: LocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

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
  }, []);

  const updateMapMarkers = () => {
    if (!map.current) return;

    // Remove existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());

    const locations = [];
    
    // Add clock in location
    if (clockInLocation) {
      const clockInMarker = new mapboxgl.Marker({ color: '#22c55e' })
        .setLngLat([clockInLocation.longitude, clockInLocation.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h3 class="font-semibold text-green-600 flex items-center gap-1">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              Clock In
            </h3>
            <p class="text-sm">${new Date(clockInLocation.timestamp).toLocaleTimeString()}</p>
            ${clockInLocation.address ? `<p class="text-xs text-gray-600 mt-1">${clockInLocation.address}</p>` : ''}
            <p class="text-xs text-gray-500">±${Math.round(clockInLocation.accuracy)}m accuracy</p>
          </div>
        `))
        .addTo(map.current);
      
      locations.push([clockInLocation.longitude, clockInLocation.latitude]);
    }

    // Add clock out location
    if (clockOutLocation) {
      const clockOutMarker = new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat([clockOutLocation.longitude, clockOutLocation.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h3 class="font-semibold text-red-600 flex items-center gap-1">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
              Clock Out
            </h3>
            <p class="text-sm">${new Date(clockOutLocation.timestamp).toLocaleTimeString()}</p>
            ${clockOutLocation.address ? `<p class="text-xs text-gray-600 mt-1">${clockOutLocation.address}</p>` : ''}
            <p class="text-xs text-gray-500">±${Math.round(clockOutLocation.accuracy)}m accuracy</p>
          </div>
        `))
        .addTo(map.current);
      
      locations.push([clockOutLocation.longitude, clockOutLocation.latitude]);
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
  }, [clockInLocation, clockOutLocation]);

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Map
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
          Clock In/Out Locations
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
            <div ref={mapContainer} className="w-full h-64 rounded-lg" />
            
            {/* Location Summary */}
            {(clockInLocation || clockOutLocation) && (
              <div className="mt-4 space-y-2">
                {clockInLocation && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <Clock className="h-4 w-4" />
                    <span>In: {new Date(clockInLocation.timestamp).toLocaleTimeString()}</span>
                    {clockInLocation.address && (
                      <span className="text-muted-foreground">at {clockInLocation.address}</span>
                    )}
                  </div>
                )}
                {clockOutLocation && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <Clock className="h-4 w-4" />
                    <span>Out: {new Date(clockOutLocation.timestamp).toLocaleTimeString()}</span>
                    {clockOutLocation.address && (
                      <span className="text-muted-foreground">at {clockOutLocation.address}</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}