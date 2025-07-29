// Конфигурация API
export const API_CONFIG = {
  // Базовый URL API
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  
  // Таймаут запросов (в миллисекундах)
  TIMEOUT: 10000,
  
  // Заголовки по умолчанию
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Настройки для разных окружений
  ENDPOINTS: {
    // Креативы
    CREATIVE: {
      GET_CATEGORIES: '/categories/',
      GET_SUBCATEGORIES: '/subcategories/',
      GET_SUBCATEGORIES_BY_CATEGORY: '/subcategories/by-category',
      GET_BRANDS: '/brands/',
      GET_BRANDS_FILTER: '/brands/filter',
      GET_TOP_CATEGORIES: '/creative/top-categories',
      GET_TOP_SUBCATEGORIES: '/creative/top-subcategories',
      GET_LAST_WEEK: '/creative/last-week',
      GET_BY_PERIOD: '/creative/by-period',
      GET_DYNAMICS: '/creative/dynamics',
      GET_TOP_CATEGORY: '/creative/top-category',
      GET_TOP_SUBCATEGORY: '/creative/top-subcategory',
      GET_BY_FILTERS: '/creative/filter',
      GET_COUNT: '/creative/count',
      GET_BY_ID: '/creative/by-id',
    },
    
    // Мониторинг
    MONITORING: {
      GET_STATS: '/monitoring/stats',
      GET_DATA: '/monitoring/data',
      GET_FILTERS: '/monitoring/filters',
    },
    
    // Аналитика
    ANALYTICS: {
      GET_DASHBOARD: '/analytics/dashboard',
      GET_REPORTS: '/analytics/reports',
      GET_METRICS: '/analytics/metrics',
    },
    
    // Коммуникационный анализ
    COMMUNICATION: {
      GET_ANALYSIS: '/communication/analysis',
      GET_TRENDS: '/communication/trends',
    },
    
    // Экспорт
    EXPORT: {
      EXPORT_DATA: '/export/data',
      EXPORT_REPORT: '/export/report',
    },
    
    // Профиль
    PROFILE: {
      GET_PROFILE: '/profile',
      UPDATE_PROFILE: '/profile/update',
    },
  },
};

// Типы для API ответов
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Типы для креативов
export interface Category {
  id: number;
  name: string;
}

export interface Subcategory {
  id: number;
  name: string;
  category_id: number;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Creative {
  id_orig?: number;
  domain?: string;
  link?: string;
  ad_link?: string;
  file_link?: string;
  block?: string;
  comment?: string;
  date_time?: string; // datetime из API приходит как строка
  date_monday?: string;
  date_first_show_on_week?: string;
  date_first_show?: string;
  week?: string;
  parser_profile?: string;
  file_name?: string;
  confidence?: number;
  details?: string;
  creativity?: string;
  casc1?: number;
  casc2?: number;
  casc3?: number;
  casc4?: number;
  casc5?: number;
  casc6?: number;
  casc7?: number;
  casc8?: number;
  casc9?: number;
  casc10?: number;
  casc11?: number;
  casc12?: number;
  casc13?: number;
  casc14?: number;
  casc15?: number;
  casc16?: number;
  show_counter?: number;
  resource_type?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_medium?: string;
  utm_source?: string;
  depth?: number;
  site_type?: string;
  top_offset?: number;
  width?: number;
  height?: number;
  square?: number;
  category_id?: number;
  subcategory_id?: number;
  brand_id?: number;
}

export interface WeeklyDynamics {
  week: string;
  count: number;
}

export interface TopCategory {
  category: string;
  count: number;
}

export interface TopSubcategory {
  subcategory: string;
  count: number;
}

export interface TopCategoryItem {
  category_id: number;
  count: number;
}

export interface TopSubcategoryItem {
  subcategory_id: number;
  count: number;
}

export interface CreativeFilters {
  category_id?: number;
  subcategory_id?: number;
  week?: string;
  limit?: number;
  offset?: number;
}

export interface CreativeCount {
  total_count: number;
}

// Типы для мониторинга
export interface MonitoringStats {
  tv: number;
  radio: number;
  online: number;
  banner: number;
  outdoor: number;
}

export interface MonitoringData {
  date: string;
  brand: string;
  category: string;
  subcategory: string;
  media: string;
  ots: string;
  status: string;
}

export interface MonitoringFilters {
  categories: string[];
  subcategories: string[];
  mediaTypes: string[];
}

// Типы для аналитики
export interface AnalyticsDashboard {
  totalCreatives: number;
  activeCampaigns: number;
  totalReach: number;
  growthRate: number;
}

// Типы для экспорта
export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  dateRange: {
    start: string;
    end: string;
  };
  filters?: Record<string, any>;
} 