import React, { useState } from 'react';
import './Export.css';
import './SelectStyles.css';
import { Download } from 'lucide-react';



const Export: React.FC<{ sidebarCollapsed?: boolean }> = ({ sidebarCollapsed = false }) => {
  const [filters, setFilters] = useState({
    category: 'Все категории',
    subcategory: 'Выберите категорию',
    mediaType: 'Все типы',
    period: 'Неделя'
  });



  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  return (
    <div className={`export-page ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* <h1>Экспорт креативов</h1> */}
      
      {/* Фильтры */}
      <div className="export-filters">
        <div className="filter-group">
          <label className="filter-label">Категория</label>
          <select 
            className="filter-select"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option>Все категории</option>
            <option>Банки</option>
            <option>Автомобили</option>
            <option>Еда и напитки</option>
            <option>Телекоммуникации</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Подкатегория</label>
          <select 
            className="filter-select"
            value={filters.subcategory}
            onChange={(e) => handleFilterChange('subcategory', e.target.value)}
          >
            <option>Выберите категорию</option>
            <option>Кредиты</option>
            <option>Легковые авто</option>
            <option>Безалкогольные напитки</option>
            <option>Мобильная связь</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Тип медиа</label>
          <select 
            className="filter-select"
            value={filters.mediaType}
            onChange={(e) => handleFilterChange('mediaType', e.target.value)}
          >
            <option>Все типы</option>
            <option>ТВ</option>
            <option>Радио</option>
            <option>Онлайн видео</option>
            <option>Баннерная реклама</option>
            <option>Наружная реклама</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Период</label>
          <select 
            className="filter-select"
            value={filters.period}
            onChange={(e) => handleFilterChange('period', e.target.value)}
          >
            <option>Неделя</option>
            <option>Месяц</option>
            <option>Квартал</option>
            <option>Год</option>
          </select>
        </div>

        <button className="export-button" >
          <Download size={18} />
          Выгрузить в Excel
        </button>
      </div>

   
    </div>
  );
};

export default Export;