import React, { useState, useEffect } from 'react';
import { creativeService, Category } from '../api';
import './SelectStyles.css';

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onChange,
  placeholder = 'Выберите категорию',
  disabled = false,
  className = ''
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const categoriesData = await creativeService.getCategories();
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки категорий');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`filter-group ${className}`}>
      <label className="filter-label">Категория</label>
      <select 
        className="filter-select"
        value={value}
        onChange={handleChange}
        disabled={disabled || loading}
      >
        <option>{placeholder}</option>
        {categories.map(category => (
          <option key={category.id} value={category.name}>
            {category.name}
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

export default CategorySelect; 