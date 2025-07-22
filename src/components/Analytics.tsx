import React, { useState } from 'react';
import './Analytics.css';
import { TrendingUp, BarChart3, PieChart, Activity, Target } from 'lucide-react';
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

// Данные для топ категорий
const topCategoriesData = [
  { category: 'Банки', creatives: 185000, color: '#8b5cf6' },
  { category: 'Автомобили', creatives: 160000, color: '#22c55e' },
  { category: 'Еда и напитки', creatives: 95000, color: '#f59e0b' },
  { category: 'Телекоммуникации', creatives: 115000, color: '#06b6d4' },
  { category: 'Красота и здоровье', creatives: 88000, color: '#fb7185' }
];

// Данные для топ подкатегорий
const topSubcategoriesData = [
  { subcategory: 'Кредиты', creatives: 95000, color: '#f59e0b' },
  { subcategory: 'Легковые авто', creatives: 88000, color: '#06b6d4' },
  { subcategory: 'Безалкогольные напитки', creatives: 75000, color: '#fb7185' },
  { subcategory: 'Мобильная связь', creatives: 65000, color: '#ef4444' },
  { subcategory: 'Косметика', creatives: 58000, color: '#fbbf24' }
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

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
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

      {/* Фильтры */}
      <div className="dashboard-filters">
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
            <option>Красота и здоровье</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Подкатегория</label>
          <select 
            className="filter-select"
            value={filters.subcategory}
            onChange={(e) => handleFilterChange('subcategory', e.target.value)}
          >
            <option>Все подкатегории</option>
            <option>Кредиты</option>
            <option>Депозиты</option>
            <option>Ипотека</option>
            <option>Легковые авто</option>
            <option>Безалкогольные напитки</option>
          </select>
        </div>
      </div>

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
              <BarChart data={topCategoriesData} layout="vertical" margin={{ left: 20, right: 20 }}>
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
                  {topCategoriesData.map((entry, index) => (
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
            <BarChart data={topSubcategoriesData}>
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
                {topSubcategoriesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

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