import React, { useState, useEffect, useRef } from 'react';
import { creativeService, Creative } from '../api';
import { Search, ChevronDown, X } from 'lucide-react';
import './SelectStyles.css';
import './CreativeSelect.css';

interface CreativeSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const CreativeSelect: React.FC<CreativeSelectProps> = ({
  value,
  onChange,
  placeholder = 'Все креативы',
  disabled = false,
  className = ''
}) => {
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [filteredCreatives, setFilteredCreatives] = useState<Creative[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCreatives();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadCreatives = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Загружаем все креативы с фильтрами (без ограничений)
      const creativesData = await creativeService.getCreativesByFilters(undefined, undefined, undefined, undefined, undefined, 100, 0);
      setCreatives(creativesData);
      setFilteredCreatives(creativesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки креативов');
      console.error('Error loading creatives:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredCreatives(creatives);
      return;
    }

    const filtered = creatives.filter(creative => 
      creative.id_orig?.toString().includes(term) ||
      creative.domain?.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredCreatives(filtered);
  };

  const handleSelect = (creative: Creative) => {
    const displayValue = creative.id_orig ? `ID: ${creative.id_orig}` : 'Без ID';
    onChange(displayValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    onChange(placeholder);
    setSearchTerm('');
  };

  const toggleDropdown = () => {
    if (!disabled && !loading) {
      setIsOpen(!isOpen);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      toggleDropdown();
    }
  };

    return (
    <div className={`filter-group ${className}`}>
      <label className="filter-label">Креатив</label>
      <div className="creative-select-container" ref={dropdownRef}>
        <div className="creative-select-wrapper">
          <div 
            className={`filter-select creative-select-custom ${isOpen ? 'open' : ''} ${disabled || loading ? 'disabled' : ''}`}
            onClick={toggleDropdown}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            <div className="creative-select-display">
              {value === placeholder ? (
                <span className="placeholder">{placeholder}</span>
              ) : (
                <span className="selected-creative">{value}</span>
              )}
            </div>
            
            <div className="creative-select-actions">
              {value !== placeholder && (
                <button
                  type="button"
                  className="clear-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  title="Очистить"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {isOpen && (
            <div className="creative-dropdown">
              <div className="search-container">
                <Search size={16} className="search-icon" />
                                 <input
                   type="text"
                   placeholder="Поиск по ID или домену..."
                   value={searchTerm}
                   onChange={(e) => handleSearch(e.target.value)}
                   className="search-input"
                   autoFocus
                 />
              </div>
              
              <div className="creative-list">
                {loading ? (
                  <div className="loading-message">Загрузка...</div>
                ) : error ? (
                  <div className="error-message">{error}</div>
                ) : filteredCreatives.length === 0 ? (
                  <div className="no-results">Креативы не найдены</div>
                ) : (
                  filteredCreatives.map((creative, index) => (
                    <div
                      key={creative.id_orig || `creative-${index}`}
                      className="creative-option"
                      onClick={() => handleSelect(creative)}
                    >
                      <div className="creative-id">ID: {creative.id_orig || 'N/A'}</div>
                      {creative.domain && (
                        <div className="creative-domain">{creative.domain}</div>
                      )}
                      {creative.comment && (
                        <div className="creative-comment">{creative.comment}</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeSelect; 