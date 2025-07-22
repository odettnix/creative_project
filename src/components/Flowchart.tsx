import React, { useState } from 'react';
import './Flowchart.css';
import { ChevronRight, Download } from 'lucide-react';
import CreativeModal from './CreativeModal'; // Импортируем уже созданный компонент
import CustomTooltip from './CustomTooltip';

type FlowchartProps = {
  sidebarCollapsed?: boolean;
};

interface Creative {
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
  creatives: Creative[];
  totals: number[];
}

interface BrandData {
  name: string;
  mediaTypes: MediaTypeData[];
  totals: number[];
  expanded: boolean;
}

// Даты колонок
const columnDates = [
  '08.01.2025',
  '13.01.2025', 
  '20.01.2025',
  '27.01.2025',
  '03.02.2025',
  '10.02.2025',
  '17.02.2025',
  '24.02.2025'
];

// Моковые данные
const mockData: BrandData[] = [
  {
    name: 'Сбербанк',
    expanded: false,
    totals: [95, 42, 66, 28, 29, 69, 22, 87],
    mediaTypes: [
      {
        type: 'Наружная реклама',
        totals: [33, 38, 38, 37, 8, 33, 11, 13],
        creatives: [
          {
            id: 'cr139',
            name: 'Креатив #139',
            brand: 'Сбербанк',
            mediaType: 'Наружная реклама',
            values: [9, 0, 1, 0, 4, 3, 7, 9],
            ots: '1 034 035',
            firstAirDate: '22.07.2025',
            status: 'Активен'
          }
        ]
      },
      {
        type: 'Баннерная реклама', 
        totals: [39, 7, 28, 34, 16, 11, 49, 32],
        creatives: [
          {
            id: 'cr844',
            name: 'Креатив #844',
            brand: 'Сбербанк',
            mediaType: 'Баннерная реклама',
            values: [6, 6, 7, 5, 9, 0, 8, 7],
            ots: '856 240',
            firstAirDate: '15.07.2025',
            status: 'Активен'
          },
          {
            id: 'cr498',
            name: 'Креатив #498',
            brand: 'Сбербанк', 
            mediaType: 'Баннерная реклама',
            values: [2, 1, 8, 7, 6, 0, 7, 4],
            ots: '723 891',
            firstAirDate: '18.07.2025',
            status: 'Активен'
          },
          {
            id: 'cr607',
            name: 'Креатив #607',
            brand: 'Сбербанк',
            mediaType: 'Баннерная реклама', 
            values: [4, 8, 8, 7, 4, 9, 7, 0],
            ots: '634 572',
            firstAirDate: '20.07.2025',
            status: 'Активен'
          }
        ]
      },
      {
        type: 'Онлайн видео',
        totals: [19, 47, 24, 12, 26, 12, 46, 44],
        creatives: [
          {
            id: 'cr242',
            name: 'Креатив #242',
            brand: 'Сбербанк',
            mediaType: 'Онлайн видео',
            values: [9, 4, 0, 5, 0, 0, 7, 4],
            ots: '892 345',
            firstAirDate: '12.07.2025',
            status: 'Активен'
          }
        ]
      },
      {
        type: 'Радио',
        totals: [19, 22, 20, 34, 34, 7, 40, 43],
        creatives: [
          {
            id: 'cr326',
            name: 'Креатив #326',
            brand: 'Сбербанк',
            mediaType: 'Радио',
            values: [9, 9, 6, 8, 1, 5, 1, 2],
            ots: '567 823',
            firstAirDate: '25.07.2025',
            status: 'Активен'
          },
          {
            id: 'cr530',
            name: 'Креатив #530',
            brand: 'Сбербанк',
            mediaType: 'Радио',
            values: [5, 8, 5, 4, 0, 9, 5, 3],
            ots: '445 612',
            firstAirDate: '28.07.2025',
            status: 'Активен'
          }
        ]
      },
      {
        type: 'ТВ',
        totals: [35, 28, 18, 36, 36, 45, 43, 21],
        creatives: [
          {
            id: 'cr482',
            name: 'Креатив #482',
            brand: 'Сбербанк',
            mediaType: 'ТВ',
            values: [1, 3, 7, 1, 9, 5, 3, 3],
            ots: '1 245 678',
            firstAirDate: '10.07.2025',
            status: 'Активен'
          },
          {
            id: 'cr15',
            name: 'Креатив #15',
            brand: 'Сбербанк',
            mediaType: 'ТВ',
            values: [1, 6, 8, 7, 9, 5, 3, 2],
            ots: '1 134 890',
            firstAirDate: '14.07.2025',
            status: 'Активен'
          }
        ]
      }
    ]
  },
  {
    name: 'Toyota',
    expanded: false,
    totals: [48, 39, 14, 79, 54, 20, 13, 67],
    mediaTypes: [
      {
        type: 'ТВ',
        totals: [25, 20, 8, 45, 30, 12, 8, 35],
        creatives: [
          {
            id: 'cr201',
            name: 'Креатив #201',
            brand: 'Toyota',
            mediaType: 'ТВ',
            values: [12, 10, 4, 22, 15, 6, 4, 18],
            ots: '2 345 567',
            firstAirDate: '05.07.2025',
            status: 'Активен'
          }
        ]
      },
      {
        type: 'Онлайн видео', 
        totals: [15, 12, 4, 25, 18, 6, 3, 22],
        creatives: [
          {
            id: 'cr189',
            name: 'Креатив #189',
            brand: 'Toyota',
            mediaType: 'Онлайн видео',
            values: [8, 6, 2, 13, 9, 3, 2, 11],
            ots: '1 789 234',
            firstAirDate: '08.07.2025', 
            status: 'Активен'
          }
        ]
      },
      {
        type: 'Радио',
        totals: [8, 7, 2, 9, 6, 2, 2, 10],
        creatives: [
          {
            id: 'cr267',
            name: 'Креатив #267',
            brand: 'Toyota',
            mediaType: 'Радио',
            values: [4, 4, 1, 5, 3, 1, 1, 5],
            ots: '654 321',
            firstAirDate: '11.07.2025',
            status: 'Активен'
          }
        ]
      }
    ]
  },
  {
    name: 'Coca-Cola',
    expanded: false,
    totals: [63, 52, 96, 97, 96, 85, 96, 58],
    mediaTypes: [
      {
        type: 'ТВ',
        totals: [35, 28, 48, 49, 48, 42, 48, 29],
        creatives: []
      },
      {
        type: 'Онлайн видео',
        totals: [20, 18, 30, 30, 30, 28, 30, 18],
        creatives: []
      },
      {
        type: 'Наружная реклама',
        totals: [8, 6, 18, 18, 18, 15, 18, 11],
        creatives: []
      }
    ]
  },
  {
    name: 'МТС',
    expanded: false,
    totals: [30, 7, 33, 23, 96, 74, 38, 97],
    mediaTypes: [
      {
        type: 'Баннерная реклама',
        totals: [15, 4, 17, 12, 48, 37, 19, 49],
        creatives: []
      },
      {
        type: 'ТВ',
        totals: [10, 2, 11, 8, 32, 25, 13, 32],
        creatives: []
      },
      {
        type: 'Радио',
        totals: [5, 1, 5, 3, 16, 12, 6, 16],
        creatives: []
      }
    ]
  },
  {
    name: 'Pepsi',
    expanded: false,
    totals: [13, 16, 33, 12, 1, 26, 37, 77],
    mediaTypes: [
      {
        type: 'ТВ',
        totals: [8, 10, 20, 7, 1, 16, 22, 46],
        creatives: []
      },
      {
        type: 'Онлайн видео',
        totals: [3, 4, 8, 3, 0, 6, 9, 19],
        creatives: []
      },
      {
        type: 'Наружная реклама',
        totals: [2, 2, 5, 2, 0, 4, 6, 12],
        creatives: []
      }
    ]
  }
];

const Flowchart: React.FC<FlowchartProps> = ({ sidebarCollapsed = false }) => {
  const [filters, setFilters] = useState({
    category: 'Выберите категорию',
    subcategory: 'Выберите подкатегорию',
    year: '2025',
    indicator: 'OTS'
  });

  const [mediaTypes, setMediaTypes] = useState({
    tv: true,
    radio: true,
    online: true,
    banner: true,
    outdoor: true
  });

  const [data, setData] = useState<BrandData[]>(mockData);
  const [selectedCreative, setSelectedCreative] = useState<Creative | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleCreativeClick = (creative: Creative) => {
    // Конвертируем Creative в формат CreativeData для модального окна
    const creativeData = {
      date: creative.firstAirDate,
      brand: creative.brand,
      category: 'Банки', // Можно сделать динамическим
      subcategory: 'Кредиты', // Можно сделать динамическим
      media: creative.mediaType,
      ots: creative.ots,
      status: creative.status,
      firstAirDate: creative.firstAirDate
    };
    setSelectedCreative(creative);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCreative(null);
  };

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
      <h1>Флоучарт</h1>
      
      {/* Фильтры */}
      <div className="flowchart-filters">
        <div className="filter-group">
          <label className="filter-label">Категория</label>
          <select 
            className="filter-select"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option>Выберите категорию</option>
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
            <option>Выберите подкатегорию</option>
            <option>Кредиты</option>
            <option>Легковые авто</option>
            <option>Безалкогольные напитки</option>
          </select>
        </div>
        
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
      </div>
      {selectedCreative && (
        <CreativeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data={{
            date: selectedCreative.firstAirDate,
            brand: selectedCreative.brand,
            category: 'Банки',
            subcategory: 'Кредиты',
            media: selectedCreative.mediaType,
            ots: selectedCreative.ots,
            status: selectedCreative.status,
            firstAirDate: selectedCreative.firstAirDate
          }}
        />
      )}
    </div>
  );
};

export default Flowchart;