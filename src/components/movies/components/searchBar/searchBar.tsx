'use client'
import React, { useEffect, useRef, useState, KeyboardEvent } from 'react'
import './searchBar.css'

export type Option = {
  label: string;
  value: string;
  [key: string]: any;
}

interface SearchBarProps {
  options?: Option[];
  value: string; 
  onSelect: (value: string) => void;
  placeholder?: string;
  onSearchChange: (query: string) => void;
  disabled?: boolean;
}

const SearchBar = ({
  options = [],
  value,
  onSelect,
  placeholder = "Search movies...",
  onSearchChange,
  disabled = false
}: SearchBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlight index when options array changes
  useEffect(() => {
    setFocusedIndex(-1);
  }, [options]);

  // Keep keyboard-focused item in viewport view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[focusedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onSearchChange(val);

    if (!val.trim()) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  const handleItemClick = (item: Option) => {
    onSelect(item.value);
    onSearchChange(item.label); 
    setIsOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled || !isOpen || options.length === 0) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && options[focusedIndex]) {
          handleItemClick(options[focusedIndex]);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => Math.min(options.length - 1, prev + 1));
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

  return (
    <div className={`search-bar-container ${disabled ? 'is-disabled' : ''}`} ref={containerRef}>
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-main-input"
          value={value} 
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => value.trim() && setIsOpen(true)} 
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen && options.length > 0}
          aria-autocomplete="list"
        />

        {value && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => { onSearchChange(""); setIsOpen(false); }}
            aria-label="Clear text input"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && value.trim() && options.length > 0 && (
        <div className="search-results-menu">
          <div className="search-options-list" ref={listRef} role="listbox">
            {options.map((item, index) => {
              const isFocused = index === focusedIndex;
              return (
                <div
                  key={item.value}
                  className={`search-option-item ${isFocused ? 'is-focused' : ''}`}
                  onClick={() => handleItemClick(item)}
                  role="option"
                  aria-selected={isFocused}
                >
                  <div className="option-main-label">{item.label}</div>

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
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar;
