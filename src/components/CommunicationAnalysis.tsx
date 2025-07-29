import React, { useState } from 'react';
import './CommunicationAnalysis.css';
import './SelectStyles.css';
import { TrendingUp, BarChart3, PieChart, X, Play } from 'lucide-react';
import CategorySelect from './CategorySelect';
import SubcategorySelect from './SubcategorySelect';
import BrandSelect from './BrandSelect';
import CreativeSelect from './CreativeSelect';
import CreativeModal from './CreativeModal';
import { creativeService, Creative, Brand, Category, Subcategory } from '../api';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid,  
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend,
  Area,
  AreaChart,
  Tooltip
} from 'recharts';
import CustomTooltip from './CustomTooltip';


type AnalyticsProps = {
  sidebarCollapsed?: boolean;
};

const radarData: RadarData[] = [
  { label: 'Вовлеченность', selected: 85, average: 70 },
  { label: 'Аффективность', selected: 75, average: 65 },
  { label: 'Познание', selected: 90, average: 80 },
  { label: 'Позитивность', selected: 70, average: 75 },
  { label: 'Просоциальность', selected: 80, average: 70 }
];

const lineChartData = [
  { month: 'Январь', value: 15 },
  { month: 'Февраль', value: 18 },
  { month: 'Март', value: 22 },
  { month: 'Апрель', value: 19 },
  { month: 'Май', value: 25 },
  { month: 'Июнь', value: 23 },
  { month: 'Июль', value: 27 },
  { month: 'Август', value: 24 },
  { month: 'Сентябрь', value: 29 },
  { month: 'Октябрь', value: 26 },
  { month: 'Ноябрь', value: 31 },
  { month: 'Декабрь', value: 28 }
];

const barChartData = [
  { month: 'Январь', имиджевая: 80, продуктовая: 70 },
  { month: 'Февраль', имиджевая: 85, продуктовая: 75 },
  { month: 'Март', имиджевая: 75, продуктовая: 80 },
  { month: 'Апрель', имиджевая: 90, продуктовая: 85 },
  { month: 'Май', имиджевая: 85, продуктовая: 90 },
  { month: 'Июнь', имиджевая: 95, продуктовая: 85 },
  { month: 'Июль', имиджевая: 88, продуктовая: 92 },
  { month: 'Август', имиджевая: 92, продуктовая: 88 },
  { month: 'Сентябрь', имиджевая: 85, продуктовая: 95 },
  { month: 'Октябрь', имиджевая: 90, продуктовая: 90 },
  { month: 'Ноябрь', имиджевая: 87, продуктовая: 93 },
  { month: 'Декабрь', имиджевая: 93, продуктовая: 89 }
];

const discountData = [
  { month: 'Январь', discount: 8 },
  { month: 'Февраль', discount: 12 },
  { month: 'Март', discount: 15 },
  { month: 'Апрель', discount: 10 },
  { month: 'Май', discount: 18 },
  { month: 'Июнь', discount: 14 },
  { month: 'Июль', discount: 20 },
  { month: 'Август', discount: 16 },
  { month: 'Сентябрь', discount: 22 },
  { month: 'Октябрь', discount: 19 },
  { month: 'Ноябрь', discount: 25 },
  { month: 'Декабрь', discount: 21 }
];

interface RadarData {
  label: string;
  selected: number;
  average: number;
}

const Analytics: React.FC<AnalyticsProps> = ({ sidebarCollapsed = false }) => {
  const [filters, setFilters] = useState({
    category: 'Все категории',
    subcategory: 'Все подкатегории',
    advertiser: 'Все рекламодатели',
    creative: 'Все креативы'
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCreative, setSelectedCreative] = useState<Creative | null>(null);
  const [isCreativeModalOpen, setIsCreativeModalOpen] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const loadReferenceData = async () => {
    try {
      const [brandsData, categoriesData, subcategoriesData] = await Promise.all([
        creativeService.getBrands(),
        creativeService.getCategories(),
        creativeService.getSubcategories()
      ]);
      
      setBrands(brandsData);
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
    } catch (error) {
      console.error('Ошибка загрузки справочных данных:', error);
    }
  };

  const getBrandName = (brandId: number): string => {
    const brand = brands.find(b => b.id === brandId);
    return brand?.name || 'Неизвестный бренд';
  };

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Неизвестная категория';
  };

  const getSubcategoryName = (subcategoryId: number): string => {
    const subcategory = subcategories.find(s => s.id === subcategoryId);
    return subcategory?.name || 'Неизвестная подкатегория';
  };

  const handleShowCreative = async () => {
    // Проверяем, выбран ли креатив
    if (filters.creative === 'Все креативы') {
      alert('Пожалуйста, выберите креатив для просмотра');
      return;
    }

    try {
      // Извлекаем id_orig из выбранного креатива
      const idOrig = parseInt(filters.creative.replace('ID: ', ''));
      
      if (isNaN(idOrig)) {
        alert('Ошибка: неверный ID креатива');
        return;
      }

      // Загружаем креатив из БД
      const creativeData = await creativeService.getCreativeById(idOrig);
      
      setSelectedCreative(creativeData);
      setIsCreativeModalOpen(true);
    } catch (error) {
      console.error('Ошибка загрузки креатива:', error);
      alert('Ошибка загрузки креатива. Попробуйте еще раз.');
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleCloseCreativeModal = () => {
    setIsCreativeModalOpen(false);
    setSelectedCreative(null);
  };

  // Загружаем справочные данные при монтировании компонента
  React.useEffect(() => {
    loadReferenceData();
  }, []);



 

  return (
    <div className="analytics-page">
     
      
      {/* Фильтры */}
      <div className="analytics-filters">
        <CategorySelect
            value={filters.category}
          onChange={(value) => handleFilterChange('category', value)}
          placeholder="Выберите категорию"
        />
        
        <SubcategorySelect
            value={filters.subcategory}
          onChange={(value) => handleFilterChange('subcategory', value)}
          selectedCategory={filters.category}
          placeholder="Все подкатегории"
        />
        
        <BrandSelect
            value={filters.advertiser}
          onChange={(value) => handleFilterChange('advertiser', value)}
          placeholder="Выберите рекламодателя"
        />
        
        <CreativeSelect
          value={filters.creative}
          onChange={(value) => handleFilterChange('creative', value)}
          placeholder="Все креативы"
        />
      </div>

      {/* Основная сетка */}
      <div className="analytics-grid">
        {/* Коммуникационные особенности */}
        <div className="analytics-card">
          <h3><TrendingUp size={20} />Коммуникационные особенности</h3>
          <div className="radar-container">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <Tooltip content={<CustomTooltip />} />
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis 
                  dataKey="label" 
                  tick={{ fontSize: 12, fill: '#374151' }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                />
                <Radar
                  name="Выбранный бренд"
                  dataKey="selected"
                  stroke="#6c63ff"
                  fill="#6c63ff"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Radar
                  name="Среднее по подкатегории"
                  dataKey="average"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Креативные особенности */}
        <div className="analytics-card">
          <h3><PieChart size={20} />Креативные особенности</h3>
          
          <div className="creative-features">
            <h4>Креативное сообщение:</h4>
            <p className="feature-text">
              Эмоциональное воздействие через использование ярких образов и динамичной музыки.
            </p>
            
            <h4>Потенциальная целевая аудитория:</h4>
            <p className="feature-text">
              Активные пользователи 25-45 лет, средний и выше средний доход.
            </p>
            
            <div className="feature-highlight">
              <strong>Креативный подход:</strong> Использование современных визуальных решений
            </div>
            
            <button className="show-creative-btn" onClick={handleShowCreative}>
              Показать креатив
            </button>
          </div>
        </div>
      </div>

      {/* Графики */}
      <div className="analytics-charts">
        {/* График долей промо в коммуникации */}
        <div className="analytics-card">
          <h3><BarChart3 size={20} />Доля промо в коммуникации</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.2}
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Тип коммуникации */}
        <div className="analytics-card">
          <h3><TrendingUp size={20} />Тип коммуникации</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="имиджевая" 
                  fill="#6c63ff" 
                  name="Имиджевая"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="продуктовая" 
                  fill="#22c55e" 
                  name="Продуктовая"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Средний уровень скидки */}
        <div className="analytics-card">
          <h3><PieChart size={20} />Средний уровень скидки</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={discountData}>
              <Tooltip content={<CustomTooltip />} />
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                
                <Line
                  type="monotone"
                  dataKey="discount"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

              {/* Модальное окно просмотра креатива */}
        {isCreativeModalOpen && selectedCreative && (
          <CreativeModal
            isOpen={isCreativeModalOpen}
            onClose={handleCloseCreativeModal}
                          data={{
                date: selectedCreative.date_time || new Date().toLocaleDateString('ru-RU'),
                brand: selectedCreative.brand_id ? getBrandName(selectedCreative.brand_id) : 'Неизвестный бренд',
                category: selectedCreative.category_id ? getCategoryName(selectedCreative.category_id) : 'Неизвестная категория',
                subcategory: selectedCreative.subcategory_id ? getSubcategoryName(selectedCreative.subcategory_id) : 'Неизвестная подкатегория',
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

export default Analytics;