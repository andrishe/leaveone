'use client';

import type {
  CalendarLegendItem,
  CalendarLeaveDTO,
} from '@/components/calendar/calendar-month';
import { CalendarMonth } from '@/components/calendar/calendar-month';

interface MiniCalendarProps {
  leaves?: CalendarLeaveDTO[];
  legend?: CalendarLegendItem[];
  initialDate?: string;
}

export function MiniCalendar({
  leaves = [],
  legend,
  initialDate,
}: MiniCalendarProps) {
  return (
    <CalendarMonth
      leaves={leaves}
      legend={legend}
      title="Calendrier"
      initialDate={initialDate}
    />
  );
}
