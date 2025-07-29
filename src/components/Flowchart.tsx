import React, { useState, useEffect } from 'react';
import './Flowchart.css';
import './SelectStyles.css';
import { ChevronRight, Download } from 'lucide-react';
import CreativeModal from './CreativeModal';
import CustomTooltip from './CustomTooltip';
import CategorySelect from './CategorySelect';
import SubcategorySelect from './SubcategorySelect';
import BrandSelect from './BrandSelect';
import { creativeService, Creative, Brand, Category, Subcategory } from '../api';

type FlowchartProps = {
  sidebarCollapsed?: boolean;
};

interface FlowchartCreative {
  id: string;
  name: string;
  brand: string;
  mediaType: string;
  values: number[];
  ots: string;
  firstAirDate: string;
  status: string;
}

interface MediaTypeData {
  type: string;
  creatives: FlowchartCreative[];
  totals: number[];
}

interface BrandData {
  name: string;
  mediaTypes: MediaTypeData[];
  totals: number[];
  expanded: boolean;
}

// Даты колонок (последние 8 недель)
const getColumnDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 7; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - (i * 7));
    dates.push(date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }));
  }
  
  return dates;
};

const columnDates = getColumnDates();

const Flowchart: React.FC<FlowchartProps> = ({ sidebarCollapsed = false }) => {
  const [filters, setFilters] = useState({
    category: 'Все категории',
    subcategory: 'Все подкатегории',
    advertiser: 'Все рекламодатели',
    year: '2025',
    indicator: 'OTS'
  });

  const [mediaTypes, setMediaTypes] = useState({
    tv: false,
    radio: false,
    online: false,
    banner: true, // Баннерная реклама включена по умолчанию
    outdoor: false
  });

  const [data, setData] = useState<BrandData[]>([]);
  const [selectedCreative, setSelectedCreative] = useState<Creative | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleMediaTypeChange = (type: string, checked: boolean) => {
    setMediaTypes(prev => ({
      ...prev,
      [type]: checked
    }));
  };

  const toggleBrandExpansion = (brandIndex: number) => {
    setData(prev => prev.map((brand, index) => 
      index === brandIndex 
        ? { ...brand, expanded: !brand.expanded }
        : brand
    ));
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Загружаем справочные данные
      const [brandsData, categoriesData, subcategoriesData] = await Promise.all([
        creativeService.getBrands(),
        creativeService.getCategories(),
        creativeService.getSubcategories()
      ]);
      
      setBrands(brandsData);
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
      
      // Получаем ID для фильтров
      const categoryId = filters.category !== 'Все категории' 
        ? categoriesData.find(cat => cat.name === filters.category)?.id 
        : undefined;
      
      const subcategoryId = filters.subcategory !== 'Все подкатегории' && filters.subcategory !== 'Выберите категорию'
        ? subcategoriesData.find(sub => sub.name === filters.subcategory)?.id 
        : undefined;
      
      const brandId = filters.advertiser !== 'Все рекламодатели'
        ? brandsData.find(brand => brand.name === filters.advertiser)?.id
        : undefined;
      
      // Загружаем креативы с фильтрами
      const allCreatives = await creativeService.getCreativesByFilters(
        categoryId,
        subcategoryId,
        brandId,
        undefined, // week
        undefined, // period
        100, // limit
        0 // offset
      );
      
      // Группируем креативы по брендам
      const brandDataMap = new Map<string, BrandData>();
      
      // Инициализируем данные для всех брендов
      brandsData.forEach(brand => {
        const mediaTypesData: MediaTypeData[] = [];
        
        // Добавляем только выбранные медиа-типы
        if (mediaTypes.banner) {
          mediaTypesData.push({
            type: 'Баннерная реклама',
            totals: new Array(8).fill(0),
            creatives: []
          });
        }
        
        if (mediaTypes.tv) {
          mediaTypesData.push({
            type: 'ТВ',
            totals: new Array(8).fill(0),
            creatives: []
          });
        }
        
        if (mediaTypes.radio) {
          mediaTypesData.push({
            type: 'Радио',
            totals: new Array(8).fill(0),
            creatives: []
          });
        }
        
        if (mediaTypes.online) {
          mediaTypesData.push({
            type: 'Онлайн видео',
            totals: new Array(8).fill(0),
            creatives: []
          });
        }
        
        if (mediaTypes.outdoor) {
          mediaTypesData.push({
            type: 'Наружная реклама',
            totals: new Array(8).fill(0),
            creatives: []
          });
        }
        
        brandDataMap.set(brand.name, {
          name: brand.name,
          expanded: false,
          totals: new Array(8).fill(0), // 8 недель
          mediaTypes: mediaTypesData
        });
      });
      
      // Обрабатываем креативы
      allCreatives.forEach(creative => {
        const brandName = brandsData.find(b => b.id === creative.brand_id)?.name || 'Неизвестный бренд';
        const brandData = brandDataMap.get(brandName);
        
        if (brandData) {
          // Распределяем креативы по выбранным медиа-типам
          // Пока что все креативы идут в баннерную рекламу, если она выбрана
          if (mediaTypes.banner) {
            const mediaType = brandData.mediaTypes.find(mt => mt.type === 'Баннерная реклама');
            
            if (mediaType) {
              // Генерируем случайные значения для недель (временно)
              const values = Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 1);
              
              const flowchartCreative: FlowchartCreative = {
                id: creative.id_orig?.toString() || 'unknown',
                name: `Креатив #${creative.id_orig}`,
                brand: brandName,
                mediaType: 'Баннерная реклама',
                values: values,
                ots: '1,250,000', // Временно
                firstAirDate: creative.date_time || new Date().toLocaleDateString('ru-RU'),
                status: 'Активен'
              };
              
              mediaType.creatives.push(flowchartCreative);
              
              // Обновляем тоталы
              values.forEach((value, index) => {
                mediaType.totals[index] += value;
                brandData.totals[index] += value;
              });
            }
          }
          
          // Для других медиа-типов показываем заглушки
          if (mediaTypes.tv) {
            const mediaType = brandData.mediaTypes.find(mt => mt.type === 'ТВ');
            if (mediaType) {
              // Добавляем заглушку для ТВ
              const values = Array.from({ length: 8 }, () => Math.floor(Math.random() * 30) + 1);
              mediaType.totals = values;
            }
          }
          
          if (mediaTypes.radio) {
            const mediaType = brandData.mediaTypes.find(mt => mt.type === 'Радио');
            if (mediaType) {
              // Добавляем заглушку для Радио
              const values = Array.from({ length: 8 }, () => Math.floor(Math.random() * 20) + 1);
              mediaType.totals = values;
            }
          }
          
          if (mediaTypes.online) {
            const mediaType = brandData.mediaTypes.find(mt => mt.type === 'Онлайн видео');
            if (mediaType) {
              // Добавляем заглушку для Онлайн видео
              const values = Array.from({ length: 8 }, () => Math.floor(Math.random() * 40) + 1);
              mediaType.totals = values;
            }
          }
          
          if (mediaTypes.outdoor) {
            const mediaType = brandData.mediaTypes.find(mt => mt.type === 'Наружная реклама');
            if (mediaType) {
              // Добавляем заглушку для Наружной рекламы
              const values = Array.from({ length: 8 }, () => Math.floor(Math.random() * 25) + 1);
              mediaType.totals = values;
            }
          }
        }
      });
      
      // Фильтруем бренды и их медиа-типы
      const filteredData = Array.from(brandDataMap.values())
        .map(brand => {
          // Фильтруем медиа-типы внутри бренда - убираем те, у которых все значения равны 0
          const filteredMediaTypes = brand.mediaTypes.filter(mediaType => 
            mediaType.totals.some(value => value > 0) || mediaType.creatives.length > 0
          );
          
          return {
            ...brand,
            mediaTypes: filteredMediaTypes
          };
        })
        .filter(brand => {
          // Проверяем, есть ли хотя бы одно ненулевое значение в тоталах бренда
          const hasNonZeroTotals = brand.totals.some(value => value > 0);
          
          // Также проверяем, есть ли медиа-типы с ненулевыми значениями или креативами
          const hasNonZeroMediaTypes = brand.mediaTypes.some(mediaType => 
            mediaType.totals.some(value => value > 0) || mediaType.creatives.length > 0
          );
          
          return hasNonZeroTotals || hasNonZeroMediaTypes;
        });
      
      setData(filteredData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreativeClick = async (creative: FlowchartCreative) => {
    try {
      // Загружаем реальные данные креатива из API
      const idOrig = parseInt(creative.id);
      const apiCreative = await creativeService.getCreativeById(idOrig);
      
      setSelectedCreative(apiCreative);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Ошибка загрузки креатива:', error);
      alert('Ошибка загрузки креатива. Попробуйте еще раз.');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCreative(null);
  };

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    loadData();
  }, []);

  // Перезагружаем данные при изменении фильтров
  useEffect(() => {
    if (brands.length > 0 && categories.length > 0 && subcategories.length > 0) {
      loadData();
    }
  }, [filters]);

  // Перезагружаем данные при изменении медиа-типов
  useEffect(() => {
    if (brands.length > 0 && categories.length > 0 && subcategories.length > 0) {
      loadData();
    }
  }, [mediaTypes]);

  const handleExportToExcel = () => {
    console.log('Экспорт в Excel');
    // Здесь будет логика экспорта
  };

  const getCellValueClass = (value: number) => {
    if (value >= 50) return 'cell-value high-value';
    if (value >= 20) return 'cell-value medium-value';
    if (value > 0) return 'cell-value low-value';
    return 'cell-value';
  };

  return (
    <div className="flowchart-page">
      {/* <h1>Флоучарт</h1> */}
      
      {loading && (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <p>Загрузка данных...</p>
        </div>
      )}
      
      {/* Фильтры */}
      <div className="flowchart-filters">
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
          <label className="filter-label">Год</label>
          <select 
            className="filter-select"
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
          >
            <option>2025</option>
            <option>2024</option>
            <option>2023</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Показатель</label>
          <select 
            className="filter-select"
            value={filters.indicator}
            onChange={(e) => handleFilterChange('indicator', e.target.value)}
          >
            <option>OTS</option>
            <option>GRP</option>
            <option>Reach</option>
          </select>
        </div>
      </div>

      {/* Медиа типы и экспорт */}
      <div className="media-types">
        <div className="media-checkboxes">
          <div className="media-checkbox">
            <input 
              type="checkbox" 
              id="tv" 
              checked={mediaTypes.tv}
              onChange={(e) => handleMediaTypeChange('tv', e.target.checked)}
            />
            <label htmlFor="tv">ТВ</label>
          </div>
          
          <div className="media-checkbox">
            <input 
              type="checkbox" 
              id="radio" 
              checked={mediaTypes.radio}
              onChange={(e) => handleMediaTypeChange('radio', e.target.checked)}
            />
            <label htmlFor="radio">Радио</label>
          </div>
          
          <div className="media-checkbox">
            <input 
              type="checkbox" 
              id="online" 
              checked={mediaTypes.online}
              onChange={(e) => handleMediaTypeChange('online', e.target.checked)}
            />
            <label htmlFor="online">Онлайн видео</label>
          </div>
          
          <div className="media-checkbox">
            <input 
              type="checkbox" 
              id="banner" 
              checked={mediaTypes.banner}
              onChange={(e) => handleMediaTypeChange('banner', e.target.checked)}
            />
            <label htmlFor="banner">Баннерная реклама</label>
          </div>
          
          <div className="media-checkbox">
            <input 
              type="checkbox" 
              id="outdoor" 
              checked={mediaTypes.outdoor}
              onChange={(e) => handleMediaTypeChange('outdoor', e.target.checked)}
            />
            <label htmlFor="outdoor">Наружная реклама</label>
          </div>
        </div>
        
        <button className="export-button" onClick={handleExportToExcel}>
          <Download size={18} />
          Выгрузить в Excel
        </button>
      </div>

      {/* Таблица флоучарта */}
      <div className="flowchart-table-container">
        {Object.values(mediaTypes).some(Boolean) ? (
          data.length > 0 ? (
            <table className="flowchart-table">
            <thead>
              <tr>
                <th>Бренд</th>
                {columnDates.map(date => (
                  <th key={date}>{date}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((brand, brandIndex) => (
                <React.Fragment key={brand.name}>
                  {/* Строка бренда */}
                  <tr>
                    <td className="brand-cell">
                      <button 
                        className={`brand-expand ${brand.expanded ? 'expanded' : ''}`}
                        onClick={() => toggleBrandExpansion(brandIndex)}
                      >
                        <ChevronRight size={20} />
                      </button>
                      {brand.name}
                    </td>
                    {brand.totals.map((value, index) => (
                      <td key={index}>
                        <span className={getCellValueClass(value)}>
                          {value}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Развернутые строки медиа типов */}
                  {brand.expanded && brand.mediaTypes.map((mediaType, mediaIndex) => (
                    <React.Fragment key={`${brand.name}-${mediaType.type}`}>
                      <tr className="expanded-row media-type-row">
                        <td>{mediaType.type}</td>
                        {mediaType.totals.map((value, index) => (
                          <td key={index}>
                            <span className={getCellValueClass(value)}>
                              {value}
                            </span>
                          </td>
                        ))}
                      </tr>
                      {/* Креативы */}
                      {mediaType.creatives && mediaType.creatives.length > 0 && mediaType.creatives.map((creative) => (
                        <tr className="expanded-row creative-row" key={creative.id}>
                          <td className="creative-cell" onClick={() => handleCreativeClick(creative)}>
                            {creative.name}
                          </td>
                          {creative.values.map((value, idx) => (
                            <td key={idx}>
                              <span className={getCellValueClass(value)}>
                                {value}
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          ) : (
            <div className="no-data-message">
              <p>Нет данных для отображения с выбранными фильтрами</p>
            </div>
          )
        ) : (
          <div className="no-media-types-message">
            <p>Выберите хотя бы один тип медиа для отображения данных</p>
          </div>
        )}
      </div>
      {selectedCreative && (
        <CreativeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data={{
            date: selectedCreative.date_time || new Date().toLocaleDateString('ru-RU'),
            brand: brands.find(b => b.id === selectedCreative.brand_id)?.name || 'Неизвестный бренд',
            category: categories.find(c => c.id === selectedCreative.category_id)?.name || 'Неизвестная категория',
            subcategory: subcategories.find(s => s.id === selectedCreative.subcategory_id)?.name || 'Неизвестная подкатегория',
            media: 'Баннерная реклама',
            ots: '1,250,000',
            status: 'Активен',
            firstAirDate: selectedCreative.date_time || new Date().toLocaleDateString('ru-RU'),
            id_orig: selectedCreative.id_orig?.toString(),
            file_link: selectedCreative.file_link,
            date_time: selectedCreative.date_time
          }}
        />
      )}
    </div>
  );
};

export default Flowchart;