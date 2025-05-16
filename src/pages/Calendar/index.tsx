
import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { cn } from "@/lib/utils";
import { addDays, format } from 'date-fns';
import { useData } from '@/contexts/DataContext';
import MainLayout from '@/components/MainLayout';
import { Calendar } from "@/components/ui/calendar";

const CalendarPlanner = () => {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [calendarItemsForSelectedDate, setCalendarItemsForSelectedDate] = useState([]);
  const { calendarItems } = useData();

  useEffect(() => {
    if (selected) {
      const formattedDate = format(selected, 'yyyy-MM-dd');
      const items = calendarItems.filter(item => {
        const itemDate = new Date(item.date);
        const formattedItemDate = format(itemDate, 'yyyy-MM-dd');
        return formattedItemDate === formattedDate;
      });
      setCalendarItemsForSelectedDate(items);
    }
  }, [selected, calendarItems]);

  const dateHasCalendarItems = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return calendarItems.some(item => {
      const itemDate = new Date(item.date);
      const formattedItemDate = format(itemDate, 'yyyy-MM-dd');
      return formattedItemDate === formattedDate;
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Content Calendar</h1>
        <div className="rounded-md border">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={setSelected}
            className={cn("border-none p-0 relative")}
            modifiers={{
              hasItems: (day) => dateHasCalendarItems(day),
              today: new Date()
            }}
            modifiersClassNames={{
              selected: "bg-primary text-primary-foreground",
              today: "bg-accent text-accent-foreground",
              hasItems: "bg-primary/10 font-bold"
            }}
          />
        </div>

        {selected && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">
              Content for {format(selected, 'MMMM d, yyyy')}
            </h2>
            {calendarItemsForSelectedDate.length > 0 ? (
              <ul>
                {calendarItemsForSelectedDate.map(item => (
                  <li key={item.id} className="py-2 border-b">
                    {item.title} - {item.platform}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No content scheduled for this day.</p>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CalendarPlanner;
