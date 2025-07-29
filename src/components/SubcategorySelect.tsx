import React, { useState, useEffect } from 'react';
import { creativeService, Subcategory } from '../api';
import './SelectStyles.css';

interface SubcategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  selectedCategory: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const SubcategorySelect: React.FC<SubcategorySelectProps> = ({
  value,
  onChange,
  selectedCategory,
  placeholder = 'Выберите подкатегорию',
  disabled = false,
  className = ''
}) => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'Все категории') {
      loadSubcategories();
    } else {
      setSubcategories([]);
      onChange(placeholder);
    }
  }, [selectedCategory]);

  const loadSubcategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Найти ID выбранной категории
      const categories = await creativeService.getCategories();
      const selectedCategoryObj = categories.find(cat => cat.name === selectedCategory);
      
      if (selectedCategoryObj) {
        const subcategoriesData = await creativeService.getSubcategoriesByCategory(selectedCategoryObj.id);
        setSubcategories(subcategoriesData);
        
        // Автоматически выбираем первую подкатегорию, если есть и текущее значение равно placeholder
        if (subcategoriesData.length > 0 && (value === placeholder || value === 'Выберите подкатегорию')) {
          onChange(subcategoriesData[0].name);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки подкатегорий');
      console.error('Error loading subcategories:', err);
      setSubcategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const isDisabled = disabled || loading || !selectedCategory || selectedCategory === 'Все категории';

  return (
    <div className={`filter-group ${className}`}>
      <label className="filter-label">Подкатегория</label>
      <select 
        className="filter-select"
        value={value}
        onChange={handleChange}
        disabled={isDisabled}
      >
        <option>{placeholder}</option>
        {subcategories.map(subcategory => (
          <option key={subcategory.id} value={subcategory.name}>
            {subcategory.name}
          </option>
        ))}
      </select>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default SubcategorySelect; 