import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, Clock, Car, Train, Bus } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Campus {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number]; // [lng, lat]
  phone: string;
  description: string;
}

const campuses: Campus[] = [
  {
    id: "central-surrey",
    name: "Central Surrey Campus",
    address: "Unit 900 13761 96 Ave, Surrey, BC V3V 1Z2 Canada",
    coordinates: [-122.8447, 49.1666],
    phone: "+1 (604) 594-3500",
    description: "Our main campus featuring state-of-the-art facilities and comprehensive programs."
  },
  {
    id: "scott-road",
    name: "Scott Road, Surrey Campus",
    address: "Unit 201 8318 120 St Surrey, BC V3W 3N4",
    coordinates: [-122.8794, 49.1294],
    phone: "+1 (604) 594-3500",
    description: "Conveniently located near Scott Road SkyTrain station with modern classrooms."
  },
  {
    id: "abbotsford",
    name: "Abbotsford Campus",
    address: "Unit 201, 3670 Townline Rd Abbotsford, BC V2T 5W8",
    coordinates: [-122.2647, 49.0504],
    phone: "+1 (604) 778-1301",
    description: "Located in the heart of the Fraser Valley with specialized program offerings."
  },
  {
    id: "aviation-abbotsford",
    name: "Aviation Campus - Abbotsford",
    address: "Hangar F, 120-1185 Townline Road Abbotsford BC, V2T 6E1",
    coordinates: [-122.2794, 49.0250],
    phone: "+1 (604) 594-3500",
    description: "Specialized aviation training facility with hands-on aircraft experience."
  },
  {
    id: "agassiz",
    name: "Agassiz Campus",
    address: "2812 Chemat Road Agassiz, BC V0M 1A0",
    coordinates: [-121.7647, 49.2294],
    phone: "+1 (604) 594-3500",
    description: "Scenic campus nestled in the mountains, perfect for outdoor education programs."
  },
  {
    id: "king-george",
    name: "King George Campus",
    address: "10490 King George Blvd, Surrey, BC V3T 1Z8 Canada",
    coordinates: [-122.8458, 49.1883],
    phone: "+1 (604) 594-3500",
    description: "Modern facilities with easy access to transit and downtown Surrey."
  }
];

const CampusExplorer: React.FC = () => {
  const [selectedCampus, setSelectedCampus] = useState<Campus>(campuses[0]);
  const [mapboxToken, setMapboxToken] = useState<string>("pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbTJ3b21rbGkwanl6MmpxdGZvemMxNmJ2In0.WbcTkn8TyOPUh8E4Fg6GEQ");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [distances, setDistances] = useState<Record<string, any>>({});
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.log("Geolocation error:", error);
          // Default to Vancouver if geolocation fails
          setUserLocation([-123.1207, 49.2827]);
        }
      );
    } else {
      setUserLocation([-123.1207, 49.2827]);
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Cleanup existing map
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: selectedCampus.coordinates,
        zoom: 12,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add markers for all campuses
      campuses.forEach((campus) => {
        const el = document.createElement('div');
        el.className = 'campus-marker';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = campus.id === selectedCampus.id ? '#3B82F6' : '#6B7280';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        el.style.cursor = 'pointer';

        const marker = new mapboxgl.Marker(el)
          .setLngLat(campus.coordinates)
          .addTo(map.current!);

        // Add popup
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">${campus.name}</h3>
              <p style="margin: 0; font-size: 12px; color: #666;">${campus.address}</p>
            </div>
          `);

        marker.setPopup(popup);

        el.addEventListener('click', () => {
          setSelectedCampus(campus);
        });

        markers.current.push(marker);
      });

      // Add user location marker if available
      if (userLocation) {
        const userMarker = document.createElement('div');
        userMarker.innerHTML = '📍';
        userMarker.style.fontSize = '20px';
        
        new mapboxgl.Marker(userMarker)
          .setLngLat(userLocation)
          .addTo(map.current);
      }

    } catch (error) {
      console.error("Error initializing map:", error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, selectedCampus, userLocation]);

  // Calculate distances when user location is available
  useEffect(() => {
    if (!userLocation || !mapboxToken) return;

    const calculateDistances = async () => {
      const newDistances: Record<string, any> = {};
      
      for (const campus of campuses) {
        try {
          const response = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation[0]},${userLocation[1]};${campus.coordinates[0]},${campus.coordinates[1]}?access_token=${mapboxToken}&overview=simplified`
          );
          
          if (response.ok) {
            const data = await response.json();
            const route = data.routes[0];
            
            newDistances[campus.id] = {
              distance: Math.round(route.distance / 1000 * 10) / 10, // km
              duration: Math.round(route.duration / 60), // minutes
              driving: true
            };
          }
        } catch (error) {
          console.error(`Error calculating distance to ${campus.name}:`, error);
          // Fallback to estimated distance
          newDistances[campus.id] = {
            distance: Math.round(
              Math.sqrt(
                Math.pow(campus.coordinates[0] - userLocation[0], 2) + 
                Math.pow(campus.coordinates[1] - userLocation[1], 2)
              ) * 111 * 10
            ) / 10,
            duration: 30,
            driving: false
          };
        }
      }
      
      setDistances(newDistances);
    };

    calculateDistances();
  }, [userLocation, mapboxToken]);

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Explore Your Campus</h3>
      
      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map">Campus Map</TabsTrigger>
          <TabsTrigger value="distances">Travel Distances</TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="space-y-4">
          {!mapboxToken && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Mapbox Token Required</h4>
                </div>
                <p className="text-sm text-blue-700">
                  To display the interactive campus map, please enter your Mapbox public token. 
                  Get yours at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="underline font-medium">mapbox.com</a>
                </p>
                <div className="space-y-2">
                  <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
                  <Input
                    id="mapbox-token"
                    type="text"
                    placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6IktjUE..."
                    value={mapboxToken}
                    onChange={(e) => setMapboxToken(e.target.value)}
                  />
                </div>
              </div>
            </Card>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Campus List */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 mb-3">Select Campus</h4>
              {campuses.map((campus) => (
                <Card
                  key={campus.id}
                  className={`p-3 cursor-pointer transition-colors ${
                    selectedCampus.id === campus.id
                      ? 'bg-blue-50 border-blue-300'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCampus(campus)}
                >
                  <div className="flex items-start gap-3">
                    <MapPin className={`w-4 h-4 mt-1 ${
                      selectedCampus.id === campus.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div>
                      <h5 className="font-medium text-sm">{campus.name}</h5>
                      <p className="text-xs text-gray-500 mt-1">{campus.address}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Map */}
            <div className="lg:col-span-2">
              <Card className="p-0 overflow-hidden">
                <div 
                  ref={mapContainer}
                  className="w-full h-96 bg-gray-100 flex items-center justify-center"
                >
                  {!mapboxToken && (
                    <div className="text-center text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Enter Mapbox token to view interactive map</p>
                    </div>
                  )}
                </div>
              </Card>
              
              {/* Selected Campus Info */}
              <Card className="p-4 mt-4">
                <h4 className="font-bold text-lg">{selectedCampus.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{selectedCampus.description}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedCampus.address}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="distances" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Navigation className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium">Travel Times from Your Location</h4>
            </div>
            
            {!userLocation && (
              <p className="text-sm text-gray-500 mb-4">
                Enable location services to see accurate travel times
              </p>
            )}
            
            <div className="space-y-3">
              {campuses.map((campus) => (
                <div key={campus.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h5 className="font-medium">{campus.name}</h5>
                    <p className="text-sm text-gray-500">{campus.address}</p>
                  </div>
                  
                  <div className="text-right">
                    {distances[campus.id] ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Car className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{distances[campus.id].distance} km</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{distances[campus.id].duration} min</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">Calculating...</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Travel times are estimates for driving. 
                Public transit options may be available for some locations.
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampusExplorer;