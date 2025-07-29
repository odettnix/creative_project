import React, { useState, useEffect, useRef, useCallback } from 'react';
import { creativeService, Brand } from '../api';
import { Search, ChevronDown, X } from 'lucide-react';
import './SelectStyles.css';
import './BrandSelect.css';

interface BrandSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const BrandSelect: React.FC<BrandSelectProps> = ({
  value,
  onChange,
  placeholder = 'Выберите рекламодателя',
  disabled = false,
  className = ''
}) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    loadBrands();
  }, []);

  useEffect(() => {
    // Найти выбранный бренд по значению
    const brand = brands.find(b => b.name === value);
    setSelectedBrand(brand || null);
  }, [value, brands]);

  useEffect(() => {
    // Фильтрация локально или запрос к API
    if (searchTerm.trim()) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        searchBrands(searchTerm);
      }, 300);
    } else {
      setFilteredBrands(brands);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm, brands]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadBrands = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const brandsData = await creativeService.getBrands();
      setBrands(brandsData);
      setFilteredBrands(brandsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки брендов');
      console.error('Error loading brands:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchBrands = async (term: string) => {
    if (!term.trim()) {
      setFilteredBrands(brands);
      return;
    }

    setLoading(true);
    try {
      const filteredData = await creativeService.getBrandsByFilter(term);
      setFilteredBrands(filteredData);
    } catch (err) {
      console.error('Error searching brands:', err);
      // Fallback to local filtering
      const localFiltered = brands.filter(brand => 
        brand.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredBrands(localFiltered);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (disabled) return;
    
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 100);
    } else {
      setSearchTerm('');
    }
  };

  const handleBrandSelect = (brand: Brand) => {
    onChange(brand.name);
    setSelectedBrand(brand);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSelectedBrand(null);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div className={`filter-group ${className}`} ref={dropdownRef}>
      <label className="filter-label">Рекламодатель</label>
      <div className="brand-select-wrapper">
        <div 
          className={`filter-select ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={handleToggle}
        >
          <div className="brand-select-display">
            {selectedBrand ? (
              <span className="selected-brand" title={selectedBrand.name}>
                {selectedBrand.name}
              </span>
            ) : (
              <span className="placeholder">{placeholder}</span>
            )}
          </div>
          
          <div className="brand-select-actions">
            {selectedBrand && (
              <button 
                className="clear-button"
                onClick={handleClear}
                type="button"
                title="Очистить выбор"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {isOpen && (
          <div className="brand-dropdown">
            <div className="search-container">
              <Search size={16} className="search-icon" />
              <input
                ref={searchRef}
                type="text"
                className="search-input"
                placeholder="Поиск брендов..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                autoComplete="off"
              />
            </div>
            
            <div className="brand-list">
              {loading ? (
                <div className="loading-message">Поиск...</div>
              ) : filteredBrands.length > 0 ? (
                filteredBrands.map(brand => (
                  <div
                    key={brand.id}
                    className={`brand-option ${selectedBrand?.id === brand.id ? 'selected' : ''}`}
                    onClick={() => handleBrandSelect(brand)}
                    title={brand.name}
                  >
                    {brand.name}
                  </div>
                ))
              ) : (
                <div className="no-results">
                  {searchTerm ? 'Бренды не найдены' : 'Нет доступных брендов'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default BrandSelect; 