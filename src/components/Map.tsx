import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';

interface MapProps {
  sites?: Array<{
    id: string;
    name: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    city?: string;
    state?: string;
  }>;
  onSiteClick?: (siteId: string) => void;
  className?: string;
}

const Map: React.FC<MapProps> = ({ sites = [], onSiteClick, className = "" }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch Mapbox token from Supabase Edge Function
  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        if (error) {
          console.error('Error fetching Mapbox token:', error);
          setError('Failed to load map configuration');
          setIsLoading(false);
          return;
        }
        setMapboxToken(data.token);
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
        setError('Failed to load map configuration');
        setIsLoading(false);
      }
    };

    fetchMapboxToken();
  }, []);

  // Initialize map when token is available
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      // Set the token
      mapboxgl.accessToken = mapboxToken;
      
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-79.3832, 43.6532], // Default to Toronto
        zoom: 10,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      map.current.on('load', () => {
        setIsLoading(false);
      });

      map.current.on('error', (e) => {
        setError('Failed to load map. Please check your Mapbox token.');
        setIsLoading(false);
        console.error('Mapbox error:', e);
      });

    } catch (error) {
      setError('Failed to initialize map');
      setIsLoading(false);
      console.error('Map initialization error:', error);
    }

    // Cleanup
    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Update markers when sites change
  useEffect(() => {
    if (!map.current || !sites) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for sites with coordinates
    sites.forEach(site => {
      if (site.latitude && site.longitude) {
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <h3 class="font-semibold text-sm">${site.name}</h3>
            <p class="text-xs text-gray-600">${site.address || ''}</p>
            <p class="text-xs text-gray-600">${site.city || ''}, ${site.state || ''}</p>
          </div>
        `);

        const marker = new mapboxgl.Marker({
          color: '#3b82f6'
        })
          .setLngLat([site.longitude, site.latitude])
          .setPopup(popup)
          .addTo(map.current!);

        // Add click handler
        if (onSiteClick) {
          marker.getElement().addEventListener('click', () => {
            onSiteClick(site.id);
          });
        }

        markers.current.push(marker);
      }
    });

    // Fit map to markers if we have sites with coordinates
    const sitesWithCoords = sites.filter(site => site.latitude && site.longitude);
    if (sitesWithCoords.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      sitesWithCoords.forEach(site => {
        bounds.extend([site.longitude!, site.latitude!]);
      });
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [sites, onSiteClick]);

  if (error) {
    return (
      <div className={`bg-muted rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <div className="text-muted-foreground mb-2">⚠️ Map Error</div>
          <p className="text-sm text-muted-foreground">{error}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Please ensure your Mapbox token is configured properly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
    </div>
  );
};

export default Map;