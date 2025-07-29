import React, { useState, useEffect } from 'react';
import './Analytics.css';
import { TrendingUp, BarChart3, PieChart, Activity, Target } from 'lucide-react';
import CategorySelect from './CategorySelect';
import SubcategorySelect from './SubcategorySelect';
import { creativeService, TopCategoryItem, TopSubcategoryItem, Category, Subcategory } from '../api';
import { 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  ComposedChart,
  Legend,
  Cell
} from 'recharts';
import CustomTooltip from './CustomTooltip';

type DashboardProps = {
  sidebarCollapsed?: boolean;
};

// Данные для динамики выходов
const dynamicsData = [
  { month: 'Нед 1', creatives: 45000 },
  { month: 'Нед 2', creatives: 50000 },
  { month: 'Нед 3', creatives: 48000 },
  { month: 'Нед 4', creatives: 58000 },
  { month: 'Нед 5', creatives: 62000 },
  { month: 'Нед 6', creatives: 68000 },
  { month: 'Нед 7', creatives: 71000 },
  { month: 'Нед 8', creatives: 69000 },
  { month: 'Нед 9', creatives: 73000 },
  { month: 'Нед 10', creatives: 75000 },
  { month: 'Нед 11', creatives: 76000 },
  { month: 'Нед 12', creatives: 78000 }
];

// Данные для прогноза на ближайший месяц
const forecastData = [
  { date: '2025-01-01', actual: 220, forecast: null },
  { date: '2025-01-07', actual: 240, forecast: null },
  { date: '2025-01-14', actual: 260, forecast: null },
  { date: '2025-01-21', actual: 280, forecast: null },
  { date: '2025-01-28', actual: 300, forecast: 300 },
  { date: '2025-02-04', actual: null, forecast: 320 },
  { date: '2025-02-11', actual: null, forecast: 335 },
  { date: '2025-02-18', actual: null, forecast: 345 },
  { date: '2025-02-25', actual: null, forecast: 360 }
];

// Данные для сезонности активности
const seasonalData = [
  { month: 'Янв', index: 0.8 },
  { month: 'Фев', index: 0.9 },
  { month: 'Мар', index: 1.1 },
  { month: 'Апр', index: 1.2 },
  { month: 'Май', index: 1.0 },
  { month: 'Июн', index: 0.9 },
  { month: 'Июл', index: 0.8 },
  { month: 'Авг', index: 1.3 },
  { month: 'Сен', index: 1.4 },
  { month: 'Окт', index: 1.4 },
  { month: 'Ноя', index: 1.5 },
  { month: 'Дек', index: 1.5 }
];

const Dashboard: React.FC<DashboardProps> = ({ sidebarCollapsed = false }) => {
  const [filters, setFilters] = useState({
    category: 'Все категории',
    subcategory: 'Все подкатегории'
  });

  const [topCategories, setTopCategories] = useState<TopCategoryItem[]>([]);
  const [topSubcategories, setTopSubcategories] = useState<TopSubcategoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [topCategoriesData, topSubcategoriesData, categoriesData, subcategoriesData] = await Promise.all([
        creativeService.getTopCategories(),
        creativeService.getTopSubcategories(),
        creativeService.getCategories(),
        creativeService.getSubcategories(),
      ]);
      
      setTopCategories(topCategoriesData);
      setTopSubcategories(topSubcategoriesData);
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Преобразование данных из API в формат для графиков
  const getTopCategoriesData = () => {
    return topCategories.map(item => {
      const category = categories.find(cat => cat.id === item.category_id);
      return {
        category: category?.name || `Категория ${item.category_id}`,
        creatives: item.count,
        color: getCategoryColor(item.category_id)
      };
    });
  };

  const getTopSubcategoriesData = () => {
    return topSubcategories.map(item => {
      const subcategory = subcategories.find(sub => sub.id === item.subcategory_id);
      return {
        subcategory: subcategory?.name || `Подкатегория ${item.subcategory_id}`,
        creatives: item.count,
        color: getSubcategoryColor(item.subcategory_id)
      };
    });
  };

  // Функции для генерации цветов
  const getCategoryColor = (categoryId: number): string => {
    const colors = ['#8b5cf6', '#22c55e', '#f59e0b', '#06b6d4', '#fb7185'];
    return colors[categoryId % colors.length];
  };

  const getSubcategoryColor = (subcategoryId: number): string => {
    const colors = ['#f59e0b', '#06b6d4', '#fb7185', '#ef4444', '#fbbf24'];
    return colors[subcategoryId % colors.length];
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="dashboard-tooltip">
          <div className="tooltip-header">
            <span className="tooltip-label">{label}</span>
          </div>
          <div className="tooltip-content">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="tooltip-item">
                <div 
                  className="tooltip-dot" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="tooltip-name">{entry.name}</span>
                <div className="tooltip-value" style={{ color: entry.color }}>
                  {entry.value?.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="dashboard-tooltip">
          <div className="tooltip-header">
            <span className="tooltip-label">{data.category || data.subcategory}</span>
          </div>
          <div className="tooltip-content">
            <div className="tooltip-item">
              <div 
                className="tooltip-dot" 
                style={{ backgroundColor: data.color }}
              />
              <span className="tooltip-name">Креативы</span>
              <div className="tooltip-value" style={{ color: data.color }}>
                {data.creatives?.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomForecastTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="dashboard-tooltip">
          <div className="tooltip-header">
            <span className="tooltip-label">{label}</span>
          </div>
          <div className="tooltip-content">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="tooltip-item">
                <div 
                  className="tooltip-dot" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="tooltip-name">{entry.name}</span>
                <div className="tooltip-value" style={{ color: entry.color }}>
                  {entry.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-page">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Фильтры */}
      <div className="dashboard-filters">
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
      </div>

      {loading ? (
        <div className="loading-message">
          Загрузка данных...
        </div>
      ) : (
        <>
      {/* Основная сетка */}
      <div className="dashboard-grid">
        {/* Динамика выходов */}
        <div className="dashboard-card">
          <h3><TrendingUp size={20} />Динамика выходов</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  axisLine={{ stroke: '#374151', opacity: 0.2 }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  axisLine={{ stroke: '#374151', opacity: 0.2 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="creatives"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                  strokeWidth={3}
                  name="Выходы креативов"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Топ категории */}
        <div className="dashboard-card">
          <h3><BarChart3 size={20} />Топ категории</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getTopCategoriesData()} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis 
                  type="number"
                  domain={[0, 'dataMax']}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  axisLine={{ stroke: '#374151', opacity: 0.2 }}
                />
                <YAxis 
                  type="category"
                  dataKey="category"
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  axisLine={{ stroke: '#374151', opacity: 0.2 }}
                  width={120}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="creatives" 
                  radius={[0, 4, 4, 0]}
                  name="Креативы"
                >
                      {getTopCategoriesData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Топ подкатегории (отдельная карточка) */}
      <div className="dashboard-card" style={{ marginBottom: '24px' }}>
        <h3><PieChart size={20} />Топ подкатегории</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getTopSubcategoriesData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="subcategory" 
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                axisLine={{ stroke: '#374151', opacity: 0.2 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                axisLine={{ stroke: '#374151', opacity: 0.2 }}
              />
              <Tooltip content={<CustomTooltip />}  />
              <Bar 
                dataKey="creatives" 
                radius={[4, 4, 0, 0]}
                name="Креативы"
              >
                    {getTopSubcategoriesData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
        </>
      )}

      {/* Анализ трендов */}
      <div className="dashboard-card dashboard-full-width">
        <h3><Activity size={20} />Анализ трендов</h3>
        <div className="trends-container">
          {/* Прогноз на ближайший месяц */}
          <div className="trend-card">
            <h4><Target size={16} />Прогноз на ближайший месяц</h4>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    axisLine={{ stroke: '#374151', opacity: 0.2 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    axisLine={{ stroke: '#374151', opacity: 0.2 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    fill="#8b5cf6"
                    fillOpacity={0.3}
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Фактические данные"
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#22c55e"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                    name="Прогноз"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="trend-description">
              Ожидается увеличение активности на 8-12% в связи с приближающимися 
              праздниками. Наибольший рост прогнозируется в ТВ и онлайн-видео.
            </p>
          </div>

          {/* Сезонность активности */}
          <div className="trend-card">
            <h4><Activity size={16} />Сезонность активности</h4>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={seasonalData} className="seasonal-chart">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    axisLine={{ stroke: '#374151', opacity: 0.2 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    axisLine={{ stroke: '#374151', opacity: 0.2 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="index"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.3}
                    strokeWidth={3}
                    name="Индекс сезонности"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="trend-description">
              Пики активности: март-апрель (+26%), сентябрь-октябрь (+30%), декабрь (+40%). 
              Минимальная активность: июнь-август (-15%).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;