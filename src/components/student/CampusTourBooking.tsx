import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, Users, Calendar as CalendarIcon, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CampusTourBooking: React.FC = () => {
  const [selectedCampus, setSelectedCampus] = useState<string>("");
  const [selectedTourType, setSelectedTourType] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const campuses = [
    { id: "central-surrey", name: "Central Surrey Campus", address: "Unit 900 13761 96 Ave, Surrey, BC V3V 1Z2 Canada", phone: "+1 (604) 594-3500" },
    { id: "scott-road", name: "Scott Road, Surrey Campus", address: "Unit 201 8318 120 St Surrey, BC V3W 3N4", phone: "+1 (604) 594-3500" },
    { id: "abbotsford", name: "Abbotsford Campus", address: "Unit 201, 3670 Townline Rd Abbotsford, BC V2T 5W8", phone: "+1 (604) 778-1301" },
    { id: "aviation-abbotsford", name: "Aviation Campus - Abbotsford", address: "Hangar F, 120-1185 Townline Road Abbotsford BC, V2T 6E1", phone: "+1 (604) 594-3500" },
    { id: "agassiz", name: "Agassiz Campus", address: "2812 Chemat Road Agassiz, BC V0M 1A0", phone: "+1 (604) 594-3500" },
    { id: "king-george", name: "King George Campus", address: "10490 King George Blvd, Surrey, BC V3T 1Z8 Canada", phone: "+1 (604) 594-3500" },
  ];

  const tourTypes = [
    { id: "in-person", name: "In-Person Tour", icon: MapPin },
    { id: "online", name: "Virtual Tour", icon: Users },
  ];

  const timeSlots = [
    "9:00 AM", "10:30 AM", "12:00 PM", "1:30 PM", "3:00 PM", "4:30 PM"
  ];

  const popularSlots = [
    { date: "2024-02-15", time: "10:30 AM", label: "Most Popular" },
    { date: "2024-02-16", time: "1:30 PM", label: "Available Soon" },
    { date: "2024-02-17", time: "12:00 PM", label: "Weekend Special" },
  ];

  const handleBooking = async () => {
    setIsLoading(true);
    
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log({
      campus: selectedCampus,
      tourType: selectedTourType,
      date: selectedDate,
      time: selectedTime,
    });
    
    setIsLoading(false);
    setIsConfirmed(true);
  };

  const isFormValid = selectedCampus && selectedTourType && selectedDate && selectedTime;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2 justify-center border-green-600 text-green-600 hover:bg-green-50 text-sm"
        >
          <CalendarIcon className="w-4 h-4" />
          Book Your Campus Tour
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center space-y-4 animate-fade-in">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Booking Your Tour</h3>
                <p className="text-sm text-gray-500">Please wait while we process your request...</p>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Overlay */}
        {isConfirmed && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center space-y-4 animate-fade-in">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto animate-scale-in" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">Tour Booked Successfully!</h3>
                <p className="text-sm text-gray-500 mt-2">
                  You'll receive a confirmation email shortly with all the details.
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => {
                    setIsConfirmed(false);
                    setSelectedCampus("");
                    setSelectedTourType("");
                    setSelectedDate(undefined);
                    setSelectedTime("");
                  }}
                >
                  Book Another Tour
                </Button>
              </div>
            </div>
          </div>
        )}

        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Book Your Campus Tour</DialogTitle>
          <DialogDescription>
            Schedule a visit to explore our campus and learn about our programs
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Campus Selection */}
          <div>
            <h3 className="text-sm font-medium mb-3">Select Campus</h3>
            <div className="grid gap-3">
              {campuses.map((campus) => (
                <Card
                  key={campus.id}
                  className={cn(
                    "p-4 cursor-pointer border-2 transition-colors",
                    selectedCampus === campus.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => setSelectedCampus(campus.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{campus.name}</h4>
                      <p className="text-sm text-gray-500">{campus.address}</p>
                    </div>
                    {selectedCampus === campus.id && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Tour Type Selection */}
          <div>
            <h3 className="text-sm font-medium mb-3">Tour Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {tourTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Card
                    key={type.id}
                    className={cn(
                      "p-4 cursor-pointer border-2 transition-colors",
                      selectedTourType === type.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => setSelectedTourType(type.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">{type.name}</span>
                      {selectedTourType === type.id && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full ml-auto"></div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Popular Time Slots */}
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Popular Time Slots
            </h3>
            <div className="grid gap-2">
              {popularSlots.map((slot, index) => (
                <Card
                  key={index}
                  className="p-3 cursor-pointer border hover:border-blue-300 transition-colors"
                  onClick={() => {
                    setSelectedDate(new Date(slot.date));
                    setSelectedTime(slot.time);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-sm">
                        <div className="font-medium">{new Date(slot.date).toLocaleDateString()}</div>
                        <div className="text-gray-500">{slot.time}</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {slot.label}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <h3 className="text-sm font-medium mb-3">Select Date</h3>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date.getDay() === 0}
                className={cn("p-3 pointer-events-auto border rounded-md")}
              />
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div>
              <h3 className="text-sm font-medium mb-3">Select Time</h3>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                    className="text-xs"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Book Button */}
          <div className="pt-4 border-t">
            <Button 
              onClick={handleBooking}
              disabled={!isFormValid}
              className="w-full"
            >
              Book Campus Tour
            </Button>
            {!isFormValid && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Please select all options to continue
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampusTourBooking;