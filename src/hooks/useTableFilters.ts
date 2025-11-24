import { useState, useMemo } from 'react';

interface UseTableFiltersOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  filterFn?: (item: T) => boolean;
}

interface UseTableFiltersReturn<T> {
  filteredData: T[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

/**
 * Custom hook for table filtering and searching
 * Provides search functionality across multiple fields
 */
export function useTableFilters<T>({
  data,
  searchFields,
  filterFn,
}: UseTableFiltersOptions<T>): UseTableFiltersReturn<T> {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search filter
      const matchesSearch = searchFields.some((field) => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
      });

      if (!matchesSearch) return false;

      // Additional custom filter
      if (filterFn && !filterFn(item)) return false;

      return true;
    });
  }, [data, searchQuery, searchFields, filterFn]);

  return {
    filteredData,
    searchQuery,
    setSearchQuery,
  };
}
