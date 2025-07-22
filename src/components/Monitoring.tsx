import React, { useState } from 'react';
import './Monitoring.css';
import { Tv, Radio, Play, Image, MapPin } from 'lucide-react';
import CreativeModal from './CreativeModal';

interface MonitoringRow {
  date: string;
  brand: string;
  category: string;
  subcategory: string;
  media: string;
  ots: string;
  status: string;
}

const mockData: MonitoringRow[] = [
  {
    date: '15.07.2025',
    brand: 'Сбербанк',
    category: 'Банки',
    subcategory: 'Кредиты',
    media: 'ТВ',
    ots: '2 500 000',
    status: 'Активен',
  },
  {
    date: '16.07.2025',
    brand: 'Toyota',
    category: 'Автомобили',
    subcategory: 'Легковые авто',
    media: 'Онлайн видео',
    ots: '1 800 000',
    status: 'Активен',
  },
  {
    date: '17.07.2025',
    brand: 'Coca-Cola',
    category: 'Еда и напитки',
    subcategory: 'Безалкогольные напитки',
    media: 'ТВ',
    ots: '1 200 000',
    status: 'Активен',
  },
  {
    date: '18.07.2025',
    brand: 'МТС',
    category: 'Телекоммуникации',
    subcategory: 'Мобильная связь',
    media: 'Баннерная реклама',
    ots: '850 000',
    status: 'Активен',
  },
  {
    date: '19.07.2025',
    brand: 'Pepsi',
    category: 'Еда и напитки',
    subcategory: 'Безалкогольные напитки',
    media: 'Наружная реклама',
    ots: '920 000',
    status: 'Активен',
  },
];

const statsData = [
  {
    icon: <Tv size={24} />,
    title: 'ТВ',
    value: '198,731',
    subtitle: 'Всего креативов',
    type: 'tv'
  },
  {
    icon: <Radio size={24} />,
    title: 'Радио',
    value: '85,085',
    subtitle: 'Всего креативов',
    type: 'radio'
  },
  {
    icon: <Play size={24} />,
    title: 'Онлайн видео',
    value: '141,809',
    subtitle: 'Лидер по количеству новых креативов',
    type: 'online'
  },
  {
    icon: <Image size={24} />,
    title: 'Баннерная реклама',
    value: '113,447',
    subtitle: 'Всего креативов',
    type: 'banner'
  },
  {
    icon: <MapPin size={24} />,
    title: 'Наружная реклама',
    value: '28,162',
    subtitle: 'Всего креативов',
    type: 'outdoor'
  }
];

const getMediaBadgeClass = (media: string): string => {
  switch (media) {
    case 'ТВ':
      return 'media-badge tv';
    case 'Радио':
      return 'media-badge radio';
    case 'Онлайн видео':
      return 'media-badge online';
    case 'Баннерная реклама':
      return 'media-badge banner';
    case 'Наружная реклама':
      return 'media-badge outdoor';
    default:
      return 'media-badge';
  }
};

const Monitoring: React.FC<{ sidebarCollapsed?: boolean }> = ({ sidebarCollapsed = false }) => {
  const [filters, setFilters] = useState({
    category: 'Все категории',
    subcategory: 'Выберите категорию',
    mediaType: 'Все типы',
    period: 'Неделя'
  });

  const [modalData, setModalData] = useState<MonitoringRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleDetailsClick = (rowData: MonitoringRow) => {
    setModalData(rowData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  return (
    <div className={`monitoring-page ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* <h1>Мониторинг креативов</h1> */}
      
      {/* Фильтры */}
      <div className="monitoring-filters">
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
      </div>

      {/* Статистические карточки */}
      <div className="monitoring-stats">
        {statsData.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card-header">
              <div className={`stat-icon ${stat.type}`}>
                {stat.icon}
              </div>
              <div>
                <h3 className="stat-title">{stat.title}</h3>
                <p className="stat-value">{stat.value}</p>
              </div>
            </div>
            <p className="stat-subtitle">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Таблица данных */}
      <div className="monitoring-table-wrapper">
        <table className="monitoring-table">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Бренд</th>
              <th>Категория</th>
              <th>Подкатегория</th>
              <th>Медиа</th>
              <th>OTS</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((row, index) => (
              <tr key={index}>
                <td>{row.date}</td>
                <td className="brand-name">{row.brand}</td>
                <td>{row.category}</td>
                <td>{row.subcategory}</td>
                <td>
                  <span className={getMediaBadgeClass(row.media)}>
                    {row.media}
                  </span>
                </td>
                <td className="ots-value">{row.ots}</td>
                <td>
                  <span className="status-badge">{row.status}</span>
                </td>
                <td>
                  <button 
                    className="action-button"
                    onClick={() => handleDetailsClick(row)}
                  >
                    Подробнее
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модальное окно */}
      {modalData && (
        <CreativeModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data={modalData}
        />
      )}
    </div>
  );
};

export default Monitoring;