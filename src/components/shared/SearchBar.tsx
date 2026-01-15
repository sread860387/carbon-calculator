/**
 * Search Bar Component
 * Reusable search input with filter options
 */

import { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  filterOptions?: Array<{ value: string; label: string }>;
  onFilterChange?: (filter: string) => void;
  currentFilter?: string;
}

export function SearchBar({
  placeholder = 'Search...',
  onSearch,
  filterOptions,
  onFilterChange,
  currentFilter = 'all'
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="flex gap-3 items-center">
      {/* Search Input */}
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Dropdown */}
      {filterOptions && onFilterChange && (
        <div className="w-48">
          <Select
            value={currentFilter}
            onChange={(e) => onFilterChange(e.target.value)}
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
}
