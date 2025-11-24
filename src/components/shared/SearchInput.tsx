import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

/**
 * Accessible search input component
 * Includes proper labeling for screen readers
 */
export function SearchInput({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  label = 'Search',
  className 
}: SearchInputProps) {
  const inputId = `search-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={className}>
      <Label htmlFor={inputId} className="sr-only">
        {label}
      </Label>
      <div className="relative">
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" 
          aria-hidden="true"
        />
        <Input
          id={inputId}
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9"
          aria-label={label}
        />
      </div>
    </div>
  );
}
