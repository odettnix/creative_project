import { apiClient } from './client';
import { 
  Category, 
  Subcategory, 
  Brand, 
  Creative, 
  WeeklyDynamics, 
  TopCategory, 
  TopSubcategory, 
  CreativeFilters, 
  CreativeCount,
  TopCategoryItem,
  TopSubcategoryItem
} from './config';
import { API_CONFIG } from './config';

export class CreativeService {
  // Получить все категории
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>(
      API_CONFIG.ENDPOINTS.CREATIVE.GET_CATEGORIES
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch categories');
  }

  // Получить все подкатегории
  async getSubcategories(): Promise<Subcategory[]> {
    const response = await apiClient.get<Subcategory[]>(
      API_CONFIG.ENDPOINTS.CREATIVE.GET_SUBCATEGORIES
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch subcategories');
  }

  // Получить подкатегории по id категории
  async getSubcategoriesByCategory(categoryId: number): Promise<Subcategory[]> {
    const response = await apiClient.get<Subcategory[]>(
      API_CONFIG.ENDPOINTS.CREATIVE.GET_SUBCATEGORIES_BY_CATEGORY,
      { category_id: categoryId }
    );
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch subcategories by category');
  }

  // Получить все бренды
  async getBrands(): Promise<Brand[]> {
    const response = await apiClient.get<Brand[]>(
      API_CONFIG.ENDPOINTS.CREATIVE.GET_BRANDS
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch brands');
  }

  // Получить бренды по фильтру имени
  async getBrandsByFilter(name: string): Promise<Brand[]> {
    const response = await apiClient.get<Brand[]>(
      API_CONFIG.ENDPOINTS.CREATIVE.GET_BRANDS_FILTER,
      { name }
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch brands by filter');
  }

  // Получить креативы за последнюю неделю
  async getCreativesLastWeek(limit: number = 20, offset: number = 0): Promise<Creative[]> {
    const response = await apiClient.get<Creative[]>(
      API_CONFIG.ENDPOINTS.CREATIVE.GET_LAST_WEEK,
      { limit, offset }
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch last week creatives');
  }

  // Получить креативы за выбранную неделю
  async getCreativesByPeriod(week: string, limit: number = 20, offset: number = 0): Promise<Creative[]> {
    const response = await apiClient.get<Creative[]>(
      API_CONFIG.ENDPOINTS.CREATIVE.GET_BY_PERIOD,
      { week, limit, offset }
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch creatives by period');
  }

  // Получить динамику выходов по неделям
  async getWeeklyDynamics(categoryId?: number, subcategoryId?: number): Promise<WeeklyDynamics[]> {
    const params: Record<string, any> = {};
    
    if (categoryId !== undefined) {
      params.category_id = categoryId;
    }
    
    if (subcategoryId !== undefined) {
      params.subcategory_id = subcategoryId;
    }
    
    const response = await apiClient.get<WeeklyDynamics[]>(
      API_CONFIG.ENDPOINTS.CREATIVE.GET_DYNAMICS,
      params
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch weekly dynamics');
  }

  // Получить топ категорию
  async getTopCategory(): Promise<TopCategory> {
    const response = await apiClient.get<TopCategory>(
      API_CONFIG.ENDPOINTS.CREATIVE.GET_TOP_CATEGORY
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch top category');
  }

  // Получить топ подкатегорию
  async getTopSubcategory(): Promise<TopSubcategory> {
    const response = await apiClient.get<TopSubcategory>(
      API_CONFIG.ENDPOINTS.CREATIVE.GET_TOP_SUBCATEGORY
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch top subcategory');
  }

  // Получить топ 5 категорий
  async getTopCategories(): Promise<TopCategoryItem[]> {
    const response = await apiClient.get<TopCategoryItem[]>(
      API_CONFIG.ENDPOINTS.CREATIVE.GET_TOP_CATEGORIES
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch top categories');
  }

  // Получить топ 5 подкатегорий
  async getTopSubcategories(): Promise<TopSubcategoryItem[]> {
    const response = await apiClient.get<TopSubcategoryItem[]>(
      API_CONFIG.ENDPOINTS.CREATIVE.GET_TOP_SUBCATEGORIES
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch top subcategories');
  }

  // Получить креативы по фильтрам
  async getCreativesByFilters(
    categoryId?: number,
    subcategoryId?: number,
    brandId?: number,
    week?: string,
    period?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<Creative[]> {
    const params: Record<string, any> = { limit, offset };
    
    if (categoryId !== undefined && categoryId !== null) {
      params.category_id = categoryId;
    }
    
    if (subcategoryId !== undefined && subcategoryId !== null) {
      params.subcategory_id = subcategoryId;
    }
    
    if (brandId !== undefined && brandId !== null) {
      params.brand_id = brandId;
    }
    
    if (week) {
      params.week = week;
    }
    
    if (period) {
      params.period = period;
    }
    
    const response = await apiClient.get<Creative[]>(
      API_CONFIG.ENDPOINTS.CREATIVE.GET_BY_FILTERS,
      params
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch creatives by filters');
  }

  // Получить общее количество креативов
  async getCreativesCount(filters?: Partial<CreativeFilters>): Promise<CreativeCount> {
    const response = await apiClient.get<CreativeCount>(
      API_CONFIG.ENDPOINTS.CREATIVE.GET_COUNT,
      filters
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch creatives count');
  }

  // Получить общее количество креативов с фильтрами
  async getCreativesCountWithFilters(
    categoryId?: number,
    subcategoryId?: number,
    brandId?: number,
    week?: string,
    period?: string
  ): Promise<number> {
    const params: Record<string, any> = {};
    
    if (categoryId !== undefined && categoryId !== null) {
      params.category_id = categoryId;
    }
    
    if (subcategoryId !== undefined && subcategoryId !== null) {
      params.subcategory_id = subcategoryId;
    }
    
    if (brandId !== undefined && brandId !== null) {
      params.brand_id = brandId;
    }
    
    if (week) {
      params.week = week;
    }
    
    if (period) {
      params.period = period;
    }
    
    const response = await apiClient.get<{ total_count: number }>(
      API_CONFIG.ENDPOINTS.CREATIVE.GET_COUNT,
      params
    );
    
    if (response.success && response.data) {
      return response.data.total_count;
    }
    
    throw new Error(response.error || 'Failed to fetch creatives count');
  }

  // Получить креатив по id_orig
  async getCreativeById(idOrig: number): Promise<Creative> {
    const response = await apiClient.get<Creative>(
      API_CONFIG.ENDPOINTS.CREATIVE.GET_BY_ID,
      { id_orig: idOrig }
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to fetch creative by id');
  }

  // Получить креативы для мониторинга (с фильтрами)
  async getMonitoringData(filters: {
    category?: string;
    subcategory?: string;
    advertiser?: string;
    mediaType?: string;
    week?: string;
  }): Promise<Creative[]> {
    // Преобразуем строковые фильтры в ID (если нужно)
    let categoryId: number | undefined;
    let subcategoryId: number | undefined;
    let brandId: number | undefined;

    if (filters.category && filters.category !== 'Все категории') {
      // Здесь можно добавить логику для получения ID категории по названию
      // Пока оставляем как есть
    }

    if (filters.subcategory && filters.subcategory !== 'Все подкатегории') {
      // Здесь можно добавить логику для получения ID подкатегории по названию
      // Пока оставляем как есть
    }

    if (filters.advertiser && filters.advertiser !== 'Все рекламодатели') {
      // Здесь можно добавить логику для получения ID бренда по названию
      // Пока оставляем как есть
    }

    return this.getCreativesByFilters(
      categoryId,
      subcategoryId,
      brandId,
      filters.week,
      undefined, // period
      100, // limit
      0 // offset
    );
  }

  // Получить статистику для мониторинга
  async getMonitoringStats(): Promise<{
    tv: number;
    radio: number;
    online: number;
    banner: number;
    outdoor: number;
  }> {
    // Поскольку у нас только баннерная реклама, возвращаем статистику только для неё
    const creatives = await this.getCreativesLastWeek(100);
    
    const stats = {
      tv: 0,
      radio: 0,
      online: 0,
      banner: creatives.length, // Все креативы считаются баннерной рекламой
      outdoor: 0,
    };

    return stats;
  }
}

// Создаем экземпляр сервиса
export const creativeService = new CreativeService(); 