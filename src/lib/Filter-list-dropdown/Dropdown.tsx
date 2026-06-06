'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import './Dropdown.css';

// Extended type allows adding flexible extra string properties like country, code, etc.
export type Option = {
  label: string;
  value: string;
  [key: string]: any; 
}

interface DropdownProps {
  options?: Option[]; // Made optional with safe default fallback to prevent filter crashes
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Dropdown = ({ options = [], value, onChange, placeholder = "Select an option..." }: DropdownProps) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dynamically searches ANY string parameter inside the option object
  const filteredOptions = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return options;

    return options.filter(option => {
      return Object.values(option).some(val => 
        typeof val === 'string' && val.toLowerCase().includes(query)
      );
    });
  }, [options, search]);

  // Find the label of the currently selected option
  const selectedLabel = useMemo(() => {
    return options.find(opt => opt.value === value)?.label || '';
  }, [options, value]);

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setSearch(""); 
    setIsOpen(false); 
  };

  return (
    <div className='dropdown-container' ref={containerRef}>
      {/* Control Display Button */}
      <div 
        className={`dropdown-control ${isOpen ? 'is-open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="dropdown-selected-text">
          {selectedLabel || placeholder}
        </span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>

      {/* Dropdown Menu Container */}
      {isOpen && (
        <div className="dropdown-menu">
          {/* Search Input Box */}
          <div className="dropdown-search-wrapper">
            <input 
              type="text" 
              className="dropdown-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search...'
              autoFocus
            />
          </div>

          {/* Rendered Options */}
          <div className="dropdown-options-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(item => (
                <div 
                  key={item.value} 
                  className={`dropdown-option-item ${value === item.value ? 'is-selected' : ''}`}
                  onClick={() => handleSelect(item)}
                >
                  <div className="option-main-label">{item.label}</div>
                  
                  {/* Dynamic Meta Badges (Renders extra string info like Country/Code if present) */}
                  <div className="option-meta-tags">
                    {Object.entries(item).map(([key, val]) => {
                      if (key !== 'label' && key !== 'value' && typeof val === 'string') {
                        return <span key={key} className="meta-badge">{val}</span>;
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="dropdown-no-data">
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
