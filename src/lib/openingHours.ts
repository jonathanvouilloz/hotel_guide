/**
 * Opening hours utilities
 * Check if a spot is currently open based on opening hours
 * Supports both simple string format and detailed object format
 */

import type { OpeningHoursDetailed, DayOfWeek } from './types';

type OpeningHoursInput = string | OpeningHoursDetailed | undefined;

/**
 * Get current day of week as DayOfWeek type
 */
function getCurrentDay(timezone: string): DayOfWeek {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'long',
  });
  return formatter.format(now).toLowerCase() as DayOfWeek;
}

/**
 * Get hours string for today, handling both simple and detailed formats
 */
function getHoursForToday(
  openingHours: OpeningHoursInput,
  timezone: string
): string | null {
  if (!openingHours) return null;

  // Simple string format
  if (typeof openingHours === 'string') {
    return openingHours;
  }

  // Detailed object format
  const today = getCurrentDay(timezone);
  const exception = openingHours.exceptions?.[today];

  // Check for day-specific exception
  if (exception !== undefined) {
    // "closed" means closed for the day
    if (exception.toLowerCase() === 'closed') {
      return 'closed';
    }
    return exception;
  }

  // Fall back to default hours
  return openingHours.default || null;
}

/**
 * Parse opening hours string and check if within time range
 */
function parseAndCheckHours(
  hoursString: string,
  timezone: string
): boolean | null {
  // Check for "closed" keyword
  if (hoursString.toLowerCase() === 'closed') {
    return false;
  }

  // Parse format "HH:MM - HH:MM" or "HH:MM-HH:MM"
  const match = hoursString.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (!match) return null;

  const [, openHour, openMin, closeHour, closeMin] = match;

  // Get current time in the specified timezone
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const currentHour = parseInt(parts.find((p) => p.type === 'hour')?.value || '0');
  const currentMin = parseInt(parts.find((p) => p.type === 'minute')?.value || '0');

  const currentMinutes = currentHour * 60 + currentMin;
  const openMinutes = parseInt(openHour) * 60 + parseInt(openMin);
  const closeMinutes = parseInt(closeHour) * 60 + parseInt(closeMin);

  // Handle overnight hours (e.g., 22:00 - 02:00)
  if (closeMinutes < openMinutes) {
    return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
  }

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

/**
 * Check if a spot is currently open
 * Supports both simple string format ("11:30-22:00") and
 * detailed object format ({ default: "11:30-22:00", exceptions: { monday: "closed" } })
 * @param openingHours String or OpeningHoursDetailed object
 * @param timezone Optional timezone (default: Asia/Bangkok)
 * @returns true if open, false if closed, null if can't determine
 */
export function isOpen(
  openingHours: OpeningHoursInput,
  timezone: string = 'Asia/Bangkok'
): boolean | null {
  const todayHours = getHoursForToday(openingHours, timezone);
  if (!todayHours) return null;

  return parseAndCheckHours(todayHours, timezone);
}

/**
 * Get opening status with label
 * @returns Object with isOpen boolean and label string
 */
export function getOpeningStatus(
  openingHours: OpeningHoursInput,
  timezone: string = 'Asia/Bangkok'
): { isOpen: boolean | null; label: string } {
  const open = isOpen(openingHours, timezone);

  if (open === null) {
    return { isOpen: null, label: '' };
  }

  return {
    isOpen: open,
    label: open ? 'OPEN' : 'CLOSED',
  };
}

/**
 * Get formatted opening hours for display
 * Returns an array of { day, hours, isToday } objects
 */
export function getFormattedHours(
  openingHours: OpeningHoursInput,
  timezone: string = 'Asia/Bangkok'
): { day: string; hours: string; isToday: boolean }[] {
  if (!openingHours) return [];

  const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels: Record<DayOfWeek, string> = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
  };

  const today = getCurrentDay(timezone);

  // Simple string format - same hours every day
  if (typeof openingHours === 'string') {
    return days.map((day) => ({
      day: dayLabels[day],
      hours: openingHours,
      isToday: day === today,
    }));
  }

  // Detailed format with exceptions
  return days.map((day) => {
    const exception = openingHours.exceptions?.[day];
    let hours = openingHours.default || '';

    if (exception !== undefined) {
      hours = exception.toLowerCase() === 'closed' ? 'Closed' : exception;
    }

    return {
      day: dayLabels[day],
      hours,
      isToday: day === today,
    };
  });
}

/**
 * Get today's hours as a simple string for display
 */
export function getTodayHours(
  openingHours: OpeningHoursInput,
  timezone: string = 'Asia/Bangkok'
): string | null {
  const hours = getHoursForToday(openingHours, timezone);
  if (!hours) return null;
  if (hours.toLowerCase() === 'closed') return 'Closed today';
  return hours;
}
