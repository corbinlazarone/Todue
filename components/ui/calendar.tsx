import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface CustomCalendarProps {
  value: string;
  onChange: (date: string) => void;
  onClose?: () => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function CustomCalendar({ value, onChange, onClose }: CustomCalendarProps) {
  // Parse the initial date from string, ensuring it's in local timezone
  const parseDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const initialDate = value ? parseDate(value) : new Date();
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState(value ? parseDate(value) : null);

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selected);
    onChange(formatDateToString(selected));
    if (onClose) {
      onClose();
    }
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear()
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  const renderDays = () => {
    const days = [];
    const totalSlots = Math.ceil((startingDayOfWeek + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalSlots; i++) {
      const dayNumber = i - startingDayOfWeek + 1;
      const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;

      days.push(
        <button
          key={i}
          onClick={() => isValidDay && handleDateSelect(dayNumber)}
          disabled={!isValidDay}
          className={`
            h-8 w-8 rounded-full text-sm font-medium
            ${!isValidDay ? 'text-gray-300 cursor-default' : 'hover:bg-gray-100'}
            ${isSelected(dayNumber) ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}
            ${isToday(dayNumber) && !isSelected(dayNumber) ? 'border border-indigo-600 text-indigo-600' : ''}
          `}
        >
          {isValidDay ? dayNumber : ''}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="p-3 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold text-gray-900">
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(day => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>
  );
}

// Calendar Trigger Component for use in forms
export function CalendarTrigger({ value, onChange }: CustomCalendarProps) {
  const [open, setOpen] = useState(false);
  
  const displayDate = value ? parseDate(value).toLocaleDateString() : 'Select date';
  
  function parseDate(dateStr: string) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          {displayDate}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <CustomCalendar 
          value={value} 
          onChange={onChange} 
          onClose={() => setOpen(false)} 
        />
      </PopoverContent>
    </Popover>
  );
}