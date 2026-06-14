'use client'
import React, { useEffect, useMemo, useRef, useState, KeyboardEvent } from 'react'
import './Dropdown.css';

export type Option = {
  label: string;
  value: string;
  [key: string]: any; 
}

interface DropdownProps {
  options?: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearchChange?: (query: string) => void; 
  disabled?: boolean; // Explicitly declared state token 
}

const Dropdown = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Select an option...",
  onSearchChange,
  disabled = false // Safe fallback mapping rule
}: DropdownProps) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset focus tracking index when list results modify or panel visibility toggles
  useEffect(() => {
    setFocusedIndex(-1);
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen, search]);

  // Handle auto-scroll context locks into focused elements inside overflowing views
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[focusedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  // Dynamically filters text matching elements safely
  const filteredOptions = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return options;

    return options.filter(option => {
      return Object.values(option).some(val => 
        typeof val === 'string' && val.toLowerCase().includes(query)
      );
    });
  }, [options, search]);

  // Extract visual representation string
  const selectedLabel = useMemo(() => {
    return options.find(opt => opt.value === value)?.label || '';
  }, [options, value]);

  const handleSelect = (option: Option) => {
    if (disabled) return;
    onChange(option.value);
    setSearch(""); 
    if (onSearchChange) onSearchChange(""); // Reset search string upstream on selection click
    setIsOpen(false); 
  };

  // Keyboard navigation controller
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          handleSelect(filteredOptions[focusedIndex]);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex(prev => Math.min(filteredOptions.length - 1, prev + 1));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => Math.max(0, prev - 1));
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  // Synchronized search text execution hook
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearch(inputValue);
    if (onSearchChange) {
      onSearchChange(inputValue); // Bubbles search back out to dynamic parent debouncers
    }
  };

  return (
    <div 
      className={`dropdown-container ${disabled ? 'is-disabled' : ''}`} 
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      {/* Control Display Button */}
      <button 
        type="button"
        className={`dropdown-control ${isOpen ? 'is-open' : ''}`} 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={selectedLabel ? `Selected: ${selectedLabel}` : placeholder}
      >
        <span className="dropdown-selected-text">
          {selectedLabel || placeholder}
        </span>
        <span className="dropdown-arrow" aria-hidden="true">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {/* Dropdown Menu Container */}
      {isOpen && (
        <div className="dropdown-menu">
          {/* Search Input Box */}
          <div className="dropdown-search-wrapper">
            <input 
              ref={inputRef}
              type="text" 
              className="dropdown-search-input"
              value={search}
              onChange={handleInputChange} // Correctly points to synchronized upstream engine
              placeholder="Search..."
              autoComplete="off"
              role="searchbox"
            />
          </div>

          {/* Rendered Options */}
          <div 
            className="dropdown-options-list" 
            ref={listRef}
            role="listbox"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item, index) => {
                const isSelected = value === item.value;
                const isFocused = index === focusedIndex;

                return (
                  <div 
                    key={item.value} 
                    className={`dropdown-option-item ${isSelected ? 'is-selected' : ''} ${isFocused ? 'is-focused' : ''}`}
                    onClick={() => handleSelect(item)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="option-main-label">{item.label}</div>
                    
                    {/* Dynamic Meta Badges */}
                    <div className="option-meta-tags">
                      {Object.entries(item).map(([key, val]) => {
                        if (key !== 'label' && key !== 'value' && typeof val === 'string') {
                          return <span key={key} className="meta-badge">{val}</span>;
                        }
                        return null;
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="dropdown-no-data" role="status">
                No Data Found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dropdown;
