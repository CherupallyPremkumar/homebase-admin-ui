/**
 * Date Range Utilities
 * 
 * Provides centralized date range handling for dashboard and analytics.
 * Supports preset ranges, custom ranges, and comparison periods.
 */

import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, format, parseISO, isValid } from 'date-fns';

export enum DateRangePreset {
    TODAY = 'today',
    YESTERDAY = 'yesterday',
    LAST_7_DAYS = 'last_7_days',
    LAST_30_DAYS = 'last_30_days',
    THIS_MONTH = 'this_month',
    LAST_MONTH = 'last_month',
    CUSTOM = 'custom',
}

export interface DateRange {
    startDate: Date;
    endDate: Date;
    preset?: DateRangePreset;
    label?: string;
}

export interface ComparisonPeriod {
    current: DateRange;
    previous: DateRange;
}

/**
 * Get date range for a preset
 */
export function getPresetDateRange(preset: DateRangePreset): DateRange {
    const now = new Date();

    switch (preset) {
        case DateRangePreset.TODAY:
            return {
                startDate: startOfDay(now),
                endDate: endOfDay(now),
                preset,
                label: 'Today',
            };

        case DateRangePreset.YESTERDAY:
            const yesterday = subDays(now, 1);
            return {
                startDate: startOfDay(yesterday),
                endDate: endOfDay(yesterday),
                preset,
                label: 'Yesterday',
            };

        case DateRangePreset.LAST_7_DAYS:
            return {
                startDate: startOfDay(subDays(now, 6)),
                endDate: endOfDay(now),
                preset,
                label: 'Last 7 Days',
            };

        case DateRangePreset.LAST_30_DAYS:
            return {
                startDate: startOfDay(subDays(now, 29)),
                endDate: endOfDay(now),
                preset,
                label: 'Last 30 Days',
            };

        case DateRangePreset.THIS_MONTH:
            return {
                startDate: startOfMonth(now),
                endDate: endOfDay(now),
                preset,
                label: 'This Month',
            };

        case DateRangePreset.LAST_MONTH:
            const lastMonth = subMonths(now, 1);
            return {
                startDate: startOfMonth(lastMonth),
                endDate: endOfMonth(lastMonth),
                preset,
                label: 'Last Month',
            };

        default:
            return getPresetDateRange(DateRangePreset.TODAY);
    }
}

/**
 * Get comparison period (previous period of same length)
 */
export function getComparisonPeriod(current: DateRange): ComparisonPeriod {
    const daysDiff = Math.ceil((current.endDate.getTime() - current.startDate.getTime()) / (1000 * 60 * 60 * 24));

    const previousEnd = subDays(current.startDate, 1);
    const previousStart = subDays(previousEnd, daysDiff - 1);

    return {
        current,
        previous: {
            startDate: startOfDay(previousStart),
            endDate: endOfDay(previousEnd),
            label: 'Previous Period',
        },
    };
}

/**
 * Format date range for display
 */
export function formatDateRange(range: DateRange): string {
    if (range.label) {
        return range.label;
    }

    const start = format(range.startDate, 'MMM d, yyyy');
    const end = format(range.endDate, 'MMM d, yyyy');

    if (start === end) {
        return start;
    }

    return `${start} - ${end}`;
}

/**
 * Format date range for API (ISO strings)
 */
export function formatDateRangeForAPI(range: DateRange): { startDate: string; endDate: string } {
    return {
        startDate: range.startDate.toISOString(),
        endDate: range.endDate.toISOString(),
    };
}

/**
 * Parse date range from URL params or storage
 */
export function parseDateRange(startDate: string, endDate: string): DateRange | null {
    try {
        const start = parseISO(startDate);
        const end = parseISO(endDate);

        if (!isValid(start) || !isValid(end)) {
            return null;
        }

        return {
            startDate: start,
            endDate: end,
            preset: DateRangePreset.CUSTOM,
        };
    } catch {
        return null;
    }
}

/**
 * Get all available preset options
 */
export function getPresetOptions(): Array<{ value: DateRangePreset; label: string }> {
    return [
        { value: DateRangePreset.TODAY, label: 'Today' },
        { value: DateRangePreset.YESTERDAY, label: 'Yesterday' },
        { value: DateRangePreset.LAST_7_DAYS, label: 'Last 7 Days' },
        { value: DateRangePreset.LAST_30_DAYS, label: 'Last 30 Days' },
        { value: DateRangePreset.THIS_MONTH, label: 'This Month' },
        { value: DateRangePreset.LAST_MONTH, label: 'Last Month' },
        { value: DateRangePreset.CUSTOM, label: 'Custom Range' },
    ];
}

/**
 * Check if a date range is "today"
 */
export function isToday(range: DateRange): boolean {
    const today = new Date();
    return (
        format(range.startDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') &&
        format(range.endDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
    );
}

/**
 * Get hours array for hourly breakdown (0-23)
 */
export function getHoursArray(): number[] {
    return Array.from({ length: 24 }, (_, i) => i);
}

/**
 * Get business hours array (9-21)
 */
export function getBusinessHoursArray(): number[] {
    return Array.from({ length: 13 }, (_, i) => i + 9);
}

/**
 * Format hour for display (e.g., "9 AM", "2 PM")
 */
export function formatHour(hour: number): string {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
}
