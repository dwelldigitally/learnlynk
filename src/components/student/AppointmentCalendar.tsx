
import React, { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

const AppointmentCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(22);
  
  // Get current month and year
  const month = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();
  
  // Days of the week
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  
  // Get number of days in current month
  const daysInMonth = new Date(year, currentMonth.getMonth() + 1, 0).getDate();
  
  // Get first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(year, currentMonth.getMonth(), 1).getDay();
  
  // Generate array of days
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Add empty days at the beginning to align with the correct day of the week
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => 0);
  
  // Previous month
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Handle date selection
  const handleDateClick = (day: number) => {
    setSelectedDate(day);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="font-medium">{month} {year}</div>
        <div className="flex space-x-2">
          <button 
            onClick={previousMonth} 
            className="p-1 hover:bg-gray-200 rounded-full"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={nextMonth} 
            className="p-1 hover:bg-gray-200 rounded-full"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Days of week headers */}
        {daysOfWeek.map((day) => (
          <div key={day} className="text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
        
        {/* Empty days */}
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="h-8"></div>
        ))}
        
        {/* Calendar days */}
        {days.map((day) => (
          <div key={day} className="py-1">
            <button
              onClick={() => handleDateClick(day)}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-xs
                ${selectedDate === day ? "bg-blue-500 text-white" : "hover:bg-gray-200"}
              `}
            >
              {day}
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <div className="text-xs text-gray-600 mb-2">Time zone</div>
        <div className="flex items-center">
          <div className="bg-blue-500 rounded-full w-4 h-4 mr-2"></div>
          <span className="text-xs">Eastern time - US & Canada</span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
