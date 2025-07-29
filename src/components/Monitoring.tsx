import React, { useState, useEffect } from 'react';
import './Monitoring.css';
import './SelectStyles.css';
import { Tv, Radio, Play, Image, MapPin, Calendar, CloudCog } from 'lucide-react';
import CreativeModal from './CreativeModal';
import DateRangePicker from './DateRangePicker';
import CategorySelect from './CategorySelect';
import SubcategorySelect from './SubcategorySelect';
import BrandSelect from './BrandSelect';
import { creativeService, Creative, Category, Subcategory, Brand } from '../api';

interface MonitoringRow {
  date: string;
  brand: string;
  category: string;
  subcategory: string;
  media: string;
  ots: string;
  status: string;
  id_orig: string;
  file_link?: string;
  date_time?: string;
}

// Функция для проверки активности креатива
const isCreativeActive = (dateTime?: string): boolean => {
  if (!dateTime || dateTime === 'null' || dateTime === '') {
    return false;
  }

  try {
    const creativeDate = new Date(dateTime);
    const currentWeek = getCurrentWeek();
    
    // Проверяем, находится ли дата креатива в текущей неделе
    return creativeDate >= currentWeek.startDate && creativeDate <= currentWeek.endDate;
  } catch {
    return false;
  }
};

// Функция для получения текущей недели (понедельник - воскресенье)
const getCurrentWeek = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Понедельник = 1
  const monday = new Date(now.setDate(diff));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  return {
    startDate: monday,
    endDate: sunday,
    displayText: `${formatDate(monday)} – ${formatDate(sunday)}`
  };
};

// Функция для получения номера недели в году
const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

// Функция для конвертации даты в формат недели (год:номер_недели)
const dateToWeekFormat = (date: Date): string => {
  const year = date.getFullYear();
  const weekNumber = getWeekNumber(date);
  return `${year}:${weekNumber}`;
};

const statsData = [
  {
    icon: <Tv size={24} />,
    title: 'ТВ',
    value: '0',
    subtitle: 'Всего креативов',
    type: 'tv'
  },
  {
    icon: <Radio size={24} />,
    title: 'Радио',
    value: '0',
    subtitle: 'Всего креативов',
    type: 'radio'
  },
  {
    icon: <Play size={24} />,
    title: 'Онлайн видео',
    value: '0',
    subtitle: 'Лидер по количеству новых креативов',
    type: 'online'
  },
  {
    icon: <Image size={24} />,
    title: 'Баннерная реклама',
    value: '0',
    subtitle: 'Всего креативов',
    type: 'banner'
  },
  {
    icon: <MapPin size={24} />,
    title: 'Наружная реклама',
    value: '0',
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
    subcategory: 'Все подкатегории',
    advertiser: 'Все рекламодатели',
    mediaType: 'Все типы',
    period: 'Неделя'
  });

  const [selectedWeek, setSelectedWeek] = useState<{
    startDate: Date;
    endDate: Date;
    displayText: string;
  }>(getCurrentWeek());

  const [modalData, setModalData] = useState<MonitoringRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Состояние для данных
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [stats, setStats] = useState(statsData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Состояние для пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 8;

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadInitialData();
  }, []);

  // Загрузка данных при изменении фильтров или страницы
  useEffect(() => {
    loadCreativesWithFilters();
  }, [filters, currentPage, selectedWeek]);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Загружаем бренды, категории и подкатегории параллельно
      const [brandsData, categoriesData, subcategoriesData] = await Promise.all([
        creativeService.getBrands(),
        creativeService.getCategories(),
        creativeService.getSubcategories(),
      ]);
      
      setBrands(brandsData);
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
      
      // Обновляем статистику
      updateStats();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCreativesWithFilters = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Получаем ID категории и подкатегории
      const categoryId = filters.category !== 'Все категории' 
        ? categories.find(cat => cat.name === filters.category)?.id 
        : undefined;
      
      const subcategoryId = filters.subcategory !== 'Все подкатегории' && filters.subcategory !== 'Выберите категорию'
        ? subcategories.find(sub => sub.name === filters.subcategory)?.id 
        : undefined;
      
      // Получаем ID бренда
      const brandId = filters.advertiser !== 'Все рекламодатели'
        ? brands.find(brand => brand.name === filters.advertiser)?.id
        : undefined;
      
      // Определяем параметры для фильтрации
      let weekParam: string | undefined = undefined;
      let periodParam: string | undefined = undefined;
      
      if (selectedWeek) {
        const startWeek = dateToWeekFormat(selectedWeek.startDate);
        const endWeek = dateToWeekFormat(selectedWeek.endDate);
        
        if (startWeek === endWeek) {
          // Одна неделя
          weekParam = startWeek;
        } else {
          // Диапазон недель
          periodParam = `${startWeek}-${endWeek}`;
        }
      }
      
      // Вычисляем offset для пагинации
      const offset = (currentPage - 1) * itemsPerPage;
      
      // Параллельно загружаем данные и общее количество
      const [creativesData, totalCount] = await Promise.all([
        creativeService.getCreativesByFilters(
          categoryId,
          subcategoryId,
          brandId,
          weekParam,
          periodParam,
          itemsPerPage,
          offset
        ),
        creativeService.getCreativesCountWithFilters(
          categoryId,
          subcategoryId,
          brandId,
          weekParam,
          periodParam
        )
      ]);
      
      setCreatives(creativesData || []);
      
      // Отладочная информация
      if (creativesData && creativesData.length > 0) {
        console.log('First creative from API:', creativesData[0]);
        console.log('First creative date_time:', creativesData[0].date_time);
      }
      
      // Обновляем пагинацию
      const receivedItems = creativesData?.length || 0;
      
      setTotalItems(totalCount);
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки креативов');
      console.error('Error loading creatives with filters:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = async () => {
    try {
      // Получаем количество только для баннерной рекламы
      const bannerCount = await creativeService.getCreativesCount({
        // Можно добавить фильтры если нужно
      });
      
      const updatedStats = stats.map(stat => {
        if (stat.type === 'banner') {
          return { ...stat, value: bannerCount.total_count?.toLocaleString() || '0' };
        } else {
          return { ...stat, value: '-' };
        }
      });
      
      setStats(updatedStats);
    } catch (err) {
      console.error('Error updating stats:', err);
      // В случае ошибки тоже показываем прочерки
      const updatedStats = stats.map(stat => ({
        ...stat,
        value: stat.type === 'banner' ? '0' : '-'
      }));
      setStats(updatedStats);
    }
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    
    // Сбрасываем страницу при изменении фильтров
    setCurrentPage(1);
  };

  const handleWeekChange = (startDate: Date, endDate: Date) => {
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };
    
    setSelectedWeek({
      startDate,
      endDate,
      displayText: `${formatDate(startDate)} – ${formatDate(endDate)}`
    });
    
    // Сбрасываем страницу при изменении недели
    setCurrentPage(1);
  };

  // Обработчики пагинации
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDetailsClick = (rowData: MonitoringRow) => {
    setModalData(rowData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  // Преобразование Creative в MonitoringRow
  const creativeToMonitoringRow = (creative: Creative): MonitoringRow => {
    // Форматируем дату для отображения
    const formatDate = (dateString?: string) => {
      if (!dateString) return 'Н/Д';
      try {
        return new Date(dateString).toLocaleDateString('ru-RU');
      } catch {
        return 'Н/Д';
      }
    };

    // Получаем имена по ID
    const getBrandName = (brandId?: number) => {
      if (!brandId) return 'Н/Д';
      const brand = brands.find(b => b.id === brandId);
      return brand ? brand.name : `Бренд ${brandId}`;
    };

    const getCategoryName = (categoryId?: number) => {
      if (!categoryId) return 'Н/Д';
      const category = categories.find(cat => cat.id === categoryId);
      return category ? category.name : `Категория ${categoryId}`;
    };

    const getSubcategoryName = (subcategoryId?: number) => {
      if (!subcategoryId) return 'Н/Д';
      const subcategory = subcategories.find(sub => sub.id === subcategoryId);
      return subcategory ? subcategory.name : `Подкатегория ${subcategoryId}`;
    };

    // Отладочная информация
    console.log('Creative date_time:', creative.date_time);
    console.log('Creative object:', creative);

    return {
      date: formatDate(creative.date_time || creative.date_first_show),
      brand: getBrandName(creative.brand_id),
      category: getCategoryName(creative.category_id),
      subcategory: getSubcategoryName(creative.subcategory_id),
      media: 'Баннерная реклама', // Фиксированное значение
      ots: '0', // Используем show_counter как OTS
      status: isCreativeActive(creative.date_time) ? 'Активен' : 'Неактивен', // Используем confidence для статуса
      id_orig: creative.id_orig?.toString() || 'Н/Д', // Добавляем id_orig
      file_link: creative.file_link, // Добавляем file_link
      date_time: creative.date_time && creative.date_time !== 'null' ? creative.date_time : undefined // Добавляем date_time с проверкой
    };
  };

  return (
    <div className={`monitoring-page ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {/* Фильтры */}
      <div className="monitoring-filters">
        <CategorySelect
          value={filters.category}
          onChange={(value) => handleFilterChange('category', value)}
          placeholder="Все категории"
        />
        
        <SubcategorySelect
          value={filters.subcategory}
          onChange={(value) => handleFilterChange('subcategory', value)}
          selectedCategory={filters.category}
          placeholder="Все подкатегории"
        />
        
        <BrandSelect
          value={filters.advertiser || 'Все рекламодатели'}
          onChange={(value) => handleFilterChange('advertiser', value)}
          placeholder="Все рекламодатели"
        />
        
        <div className="filter-group">
          <label className="filter-label">Тип медиа</label>
          <select 
            className="filter-select"
            value="Баннерная реклама"
            disabled
          >
            <option>Баннерная реклама</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Период</label>
          <DateRangePicker
            selectedWeek={selectedWeek}
            onWeekChange={handleWeekChange}
          />
        </div>
      </div>

      {/* Статистические карточки */}
      <div className="monitoring-stats">
        {stats.map((stat, index) => (
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
        {loading ? (
          <div className="loading-message">
            Загрузка данных...
          </div>
        ) : (
          <table className="monitoring-table">
            <thead>
              <tr>
                <th>ID</th>
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
              {creatives.map((creative, index) => {
                const rowData = creativeToMonitoringRow(creative);
                return (
                  <tr key={index}>
                    <td className="id-value">{rowData.id_orig}</td>
                    <td>{rowData.date}</td>
                    <td className="brand-name">{rowData.brand}</td>
                    <td>{rowData.category}</td>
                    <td>{rowData.subcategory}</td>
                    <td>
                      <span className={getMediaBadgeClass(rowData.media)}>
                        {rowData.media}
                      </span>
                    </td>
                    <td className="ots-value">{rowData.ots}</td>
                    <td>
                      <span className={`status-badge ${rowData.status === 'Активен' ? 'active' : 'inactive'}`}>
                        {rowData.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="action-button"
                        onClick={() => handleDetailsClick(rowData)}
                      >
                        Подробнее
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Пагинация - вынесена за границы таблицы */}
      {!loading && creatives.length > 0 && totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination">
            <div className="pagination-info">
              Страница {currentPage} из {totalPages} (всего записей: {totalItems})
            </div>
            <button 
              className="pagination-button"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              ←
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            
            <button 
              className="pagination-button"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
          
          {/* Отладочная информация
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
            Отладка: totalPages={totalPages}, currentPage={currentPage}, totalItems={totalItems}, 
            записей на странице={creatives.length}, itemsPerPage={itemsPerPage}
          </div> */}
        </div>
      )}

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