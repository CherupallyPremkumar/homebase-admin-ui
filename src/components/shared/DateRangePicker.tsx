import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DateRange, DateRangePreset, getPresetDateRange, getPresetOptions, formatDateRange } from '@/utils/date-range';

interface DateRangePickerProps {
    value: DateRange;
    onChange: (range: DateRange) => void;
    className?: string;
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
    const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>(
        value.preset || DateRangePreset.TODAY
    );
    const [isCustomOpen, setIsCustomOpen] = useState(false);

    const presetOptions = getPresetOptions();

    const handlePresetChange = (preset: string) => {
        const presetEnum = preset as DateRangePreset;
        setSelectedPreset(presetEnum);

        if (presetEnum === DateRangePreset.CUSTOM) {
            setIsCustomOpen(true);
        } else {
            const range = getPresetDateRange(presetEnum);
            onChange(range);
            setIsCustomOpen(false);
        }
    };

    const handleCustomDateChange = (dates: { from?: Date; to?: Date } | undefined) => {
        if (dates?.from && dates?.to) {
            onChange({
                startDate: dates.from,
                endDate: dates.to,
                preset: DateRangePreset.CUSTOM,
                label: `${format(dates.from, 'MMM d')} - ${format(dates.to, 'MMM d, yyyy')}`,
            });
            setIsCustomOpen(false);
        }
    };

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Select value={selectedPreset} onValueChange={handlePresetChange}>
                <SelectTrigger className="w-[180px]">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                    {presetOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {selectedPreset === DateRangePreset.CUSTOM && (
                <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                'justify-start text-left font-normal',
                                !value && 'text-muted-foreground'
                            )}
                        >
                            {formatDateRange(value)}
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="range"
                            selected={{
                                from: value.startDate,
                                to: value.endDate,
                            }}
                            onSelect={handleCustomDateChange}
                            numberOfMonths={2}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            )}

            {selectedPreset !== DateRangePreset.CUSTOM && (
                <span className="text-sm text-muted-foreground">
                    {formatDateRange(value)}
                </span>
            )}
        </div>
    );
}
