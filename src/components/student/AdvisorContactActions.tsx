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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Phone, MessageSquare, Calendar as CalendarIcon, Clock, CheckCircle, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvisorContactActionsProps {
  advisorName: string;
}

const AdvisorContactActions: React.FC<AdvisorContactActionsProps> = ({ advisorName }) => {
  // Callback scheduling state
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [callbackReason, setCallbackReason] = useState<string>("");
  const [isCallbackLoading, setIsCallbackLoading] = useState(false);
  const [isCallbackConfirmed, setIsCallbackConfirmed] = useState(false);
  
  // Message state
  const [message, setMessage] = useState<string>("");
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(false);

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
  ];

  const popularCallbackTimes = [
    { date: "2024-02-15", time: "10:00 AM", label: "Next Available" },
    { date: "2024-02-16", time: "2:00 PM", label: "Popular" },
    { date: "2024-02-17", time: "11:00 AM", label: "Weekend" },
  ];

  const handleCallbackRequest = async () => {
    setIsCallbackLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log({
      advisor: advisorName,
      date: selectedDate,
      time: selectedTime,
      reason: callbackReason,
    });
    
    setIsCallbackLoading(false);
    setIsCallbackConfirmed(true);
  };

  const handleSendMessage = async () => {
    setIsMessageLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log({
      advisor: advisorName,
      message: message,
    });
    
    setIsMessageLoading(false);
    setIsMessageSent(true);
    
    setTimeout(() => {
      setIsMessageSent(false);
      setMessage("");
    }, 2000);
  };

  const isCallbackFormValid = selectedDate && selectedTime && callbackReason.trim();

  return (
    <div className="space-y-2">
      {/* Request Callback */}
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center gap-2 justify-center bg-green-50 border-green-200 hover:bg-green-100 text-green-700"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm font-medium">Request Callback</span>
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Schedule a Callback</DialogTitle>
            <DialogDescription>
              Schedule a call with {advisorName} at your convenience
            </DialogDescription>
          </DialogHeader>

          {isCallbackLoading ? (
            <div className="py-16 text-center space-y-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Scheduling Your Callback</h3>
                <p className="text-sm text-gray-500">Please wait while we process your request...</p>
              </div>
            </div>
          ) : isCallbackConfirmed ? (
            <div className="py-16 text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto animate-scale-in" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">Callback Scheduled!</h3>
                <p className="text-sm text-gray-500 mt-2">
                  {advisorName} will call you on {selectedDate?.toLocaleDateString()} at {selectedTime}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Popular Times */}
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Popular Times
                </h3>
                <div className="grid gap-2">
                  {popularCallbackTimes.map((slot, index) => (
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
                    disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                    className={cn("p-3 pointer-events-auto border rounded-md")}
                  />
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Select Time</h3>
                  <div className="grid grid-cols-4 gap-2">
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

              {/* Reason for Call */}
              <div>
                <Label htmlFor="callback-reason" className="text-sm font-medium">
                  What would you like to discuss?
                </Label>
                <Textarea
                  id="callback-reason"
                  value={callbackReason}
                  onChange={(e) => setCallbackReason(e.target.value)}
                  placeholder="Please provide a brief description of what you'd like to discuss..."
                  className="mt-2"
                  rows={3}
                />
              </div>

              {/* Schedule Button */}
              <div className="pt-4 border-t">
                <Button 
                  onClick={handleCallbackRequest}
                  disabled={!isCallbackFormValid}
                  className="w-full"
                >
                  Schedule Callback
                </Button>
                {!isCallbackFormValid && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Please select date, time, and provide a reason for the call
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Send Message */}
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center gap-2 justify-center bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">Send Message</span>
          </Button>
        </SheetTrigger>
        
        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Send Message to {advisorName}</SheetTitle>
            <SheetDescription>
              Send a direct message to your advisor
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {isMessageSent ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto animate-scale-in" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Message Sent!</h3>
                  <p className="text-sm text-gray-500">
                    {advisorName} will respond to your message shortly
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <Label htmlFor="advisor-message" className="text-sm font-medium">
                    Your Message
                  </Label>
                  <Textarea
                    id="advisor-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="mt-2 min-h-[200px]"
                    rows={8}
                  />
                </div>

                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isMessageLoading}
                  className="w-full"
                >
                  {isMessageLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdvisorContactActions;