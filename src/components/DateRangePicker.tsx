import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import './DateRangePicker.css';

interface DateRangePickerProps {
  selectedWeek: {
    startDate: Date;
    endDate: Date;
    displayText: string;
  };
  onWeekChange: (startDate: Date, endDate: Date) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ selectedWeek, onWeekChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredWeek, setHoveredWeek] = useState<Date | null>(null);
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<Date | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- Новый множественный выбор по клику ---
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Проверяем, что клик не внутри компонента
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false);
        setShowMonthSelector(false);
        setShowYearSelector(false);
        // Сбрасываем выделение
        setIsSelecting(false);
        setSelectionStart(null);
        setSelectionEnd(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setShowMonthSelector(false);
        setShowYearSelector(false);
        // Сбрасываем выделение
        setIsSelecting(false);
        setSelectionStart(null);
        setSelectionEnd(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Получение недели для даты (понедельник - воскресенье)
  const getWeekForDate = (date: Date): Date[] => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Понедельник = 1
    startOfWeek.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      week.push(new Date(startOfWeek.getTime() + i * 24 * 60 * 60 * 1000));
    }
    return week;
  };

  // Проверка, является ли неделя выбранной
  const isWeekSelected = (weekStart: Date): boolean => {
    const week = getWeekForDate(weekStart);
    const weekEnd = new Date(week[6]);
    weekEnd.setHours(23, 59, 59, 999);
    
    return week[0] <= selectedWeek.endDate && weekEnd >= selectedWeek.startDate;
  };

  // Проверка, является ли неделя текущей наведенной
  const isWeekHovered = (weekStart: Date): boolean => {
    if (!hoveredWeek) return false;
    const week = getWeekForDate(weekStart);
    const weekEnd = new Date(week[6]);
    weekEnd.setHours(23, 59, 59, 999);
    
    return week[0] <= hoveredWeek && weekEnd >= hoveredWeek;
  };

  // Проверка, входит ли неделя в диапазон выделения
  const isWeekInSelection = (weekStart: Date): boolean => {
    if (!selectionStart || !selectionEnd) return false;
    
    // Получаем все недели между начальной и конечной
    const start = selectionStart < selectionEnd ? selectionStart : selectionEnd;
    const end = selectionStart > selectionEnd ? selectionStart : selectionEnd;
    
    // Проверяем, находится ли неделя в диапазоне
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    return weekStart <= end && weekEnd >= start;
  };

  // Проверка, входит ли неделя в выбранный диапазон
  const isWeekInRange = (weekStart: Date): boolean => {
    if (!rangeStart || !rangeEnd) return false;
    const start = rangeStart < rangeEnd ? rangeStart : rangeEnd;
    const end = rangeStart > rangeEnd ? rangeStart : rangeEnd;
    return weekStart >= start && weekStart <= end;
  };

  // Подсветка диапазона при наведении (в процессе выделения)
  const isWeekInTempRange = (weekStart: Date): boolean => {
    if (rangeStart && !rangeEnd && hoveredWeek && hoveredWeek !== rangeStart) {
      const start = rangeStart < hoveredWeek ? rangeStart : hoveredWeek;
      const end = rangeStart > hoveredWeek ? rangeStart : hoveredWeek;
      return weekStart >= start && weekStart <= end;
    }
    return false;
  };

  // Обработка выделения недель мышью
  const handleWeekMouseDown = (weekStart: Date) => {
    setIsSelecting(true);
    setSelectionStart(weekStart);
    setSelectionEnd(weekStart);
  };

  const handleWeekMouseEnter = (weekStart: Date) => {
    if (isSelecting && selectionStart) {
      setSelectionEnd(weekStart);
    }
    setHoveredWeek(weekStart);
  };

  const handleWeekMouseUp = (weekStart: Date) => {
    if (isSelecting && selectionStart) {
      setIsSelecting(false);
      setSelectionEnd(weekStart);
      
      // Определяем диапазон недель
      const start = selectionStart < weekStart ? selectionStart : weekStart;
      const end = selectionStart > weekStart ? selectionStart : weekStart;
      
      // Вызываем onWeekChange с диапазоном
      onWeekChange(start, end);
      
      // Сбрасываем состояние выделения
      setSelectionStart(null);
      setSelectionEnd(null);
    }
  };

  // Обработка клика по неделе
  const handleWeekClick = (weekStart: Date) => {
    // Если диапазон не выбран — это первый клик
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(weekStart);
      setRangeEnd(null);
      onWeekChange(weekStart, weekStart);
    } else if (rangeStart && !rangeEnd) {
      // Второй клик — выделяем диапазон
      setRangeEnd(weekStart);
      onWeekChange(rangeStart, weekStart);
    }
  };

  // Обработка выбора недели
  const handleWeekSelect = (weekStart: Date) => {
    const week = getWeekForDate(weekStart);
    onWeekChange(week[0], week[6]);
    setIsOpen(false);
  };

  // Навигация по месяцам
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Обработка выбора месяца
  const handleMonthSelect = (monthIndex: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), monthIndex, 1));
    setShowMonthSelector(false);
  };

  // Обработка выбора года
  const handleYearSelect = (year: number) => {
    setCurrentDate(prev => new Date(year, prev.getMonth(), 1));
    setShowYearSelector(false);
  };

  // Возврат к текущей неделе
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    const week = getWeekForDate(today);
    onWeekChange(week[0], week[6]);
    // Убрали setIsOpen(false) - календарь остается открытым
  };

  // Генерация списка лет (текущий год ± 10 лет)
  const generateYearList = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  // Генерация календаря
  const generateCalendar = () => {
    const year: number = currentDate.getFullYear();
    const month: number = currentDate.getMonth();
    const firstDay: Date = new Date(year, month, 1);
    const lastDay: Date = new Date(year, month + 1, 0);
    const startDate: Date = new Date(firstDay);
    const dayOfWeek: number = firstDay.getDay();
    const diff: number = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Понедельник = 0
    startDate.setDate(startDate.getDate() - diff);

    const calendar: Date[][] = [];
    let currentDateInLoop: Date = new Date(startDate);

    for (let week = 0; week < 6; week++) {
      const weekDays: Date[] = [];
      for (let day = 0; day < 7; day++) {
        weekDays.push(new Date(currentDateInLoop));
        currentDateInLoop.setDate(currentDateInLoop.getDate() + 1);
      }
      calendar.push(weekDays);
    }

    return calendar;
  };

  const calendar = generateCalendar();

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const dayNames = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

  return (
    <div className="date-range-picker" ref={dropdownRef}>
      <button
        className="date-range-button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <span className="date-range-display">{selectedWeek.displayText}</span>
        <ChevronDown className={`chevron-down ${isOpen ? 'rotated' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="date-range-dropdown"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="calendar-header">
            <button 
              className="nav-button" 
              onClick={(e) => {
                e.stopPropagation();
                goToPreviousMonth();
              }}
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="month-year-selector">
              <div 
                className="month-selector" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMonthSelector(!showMonthSelector);
                }}
              >
                {monthNames[currentDate.getMonth()]}
                <ChevronDown size={12} />
                {showMonthSelector && (
                  <div 
                    className="month-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {monthNames.map((month, index) => (
                      <div
                        key={index}
                        className={`month-option ${index === currentDate.getMonth() ? 'selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMonthSelect(index);
                        }}
                      >
                        {month}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div 
                className="year-selector" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowYearSelector(!showYearSelector);
                }}
              >
                {currentDate.getFullYear()}
                <ChevronDown size={12} />
                {showYearSelector && (
                  <div 
                    className="year-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {generateYearList().map(year => (
                      <div
                        key={year}
                        className={`year-option ${year === currentDate.getFullYear() ? 'selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleYearSelect(year);
                        }}
                      >
                        {year}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <button 
              className="nav-button" 
              onClick={(e) => {
                e.stopPropagation();
                goToNextMonth();
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div 
            className="today-button-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="today-button" 
              onClick={(e) => {
                e.stopPropagation();
                goToToday();
              }}
            >
              Сегодня
            </button>
          </div>

          <div className="calendar-grid">
            <div className="calendar-days-header">
              {dayNames.map(day => (
                <div key={day} className="day-header">{day}</div>
              ))}
            </div>

            <div className="calendar-weeks">
              {calendar.map((week, weekIndex) => (
                <div
                  key={weekIndex}
                  className={`calendar-week ${
                    isWeekSelected(week[0]) ? 'selected-week' : ''
                  } ${
                    isWeekHovered(week[0]) ? 'hovered-week' : ''
                  } ${
                    isWeekInSelection(week[0]) ? 'selected-range' : ''
                  } ${
                    isWeekInRange(week[0]) ? 'in-range' : ''
                  } ${
                    isWeekInTempRange(week[0]) ? 'temp-range' : ''
                  }`}
                  onMouseDown={() => handleWeekMouseDown(week[0])}
                  onMouseEnter={() => handleWeekMouseEnter(week[0])}
                  onMouseUp={() => handleWeekMouseUp(week[0])}
                  onClick={() => handleWeekClick(week[0])}
                >
                  {week.map((date, dayIndex) => {
                    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                    const isToday = date.toDateString() === new Date().toDateString();
                    
                    return (
                      <div
                        key={dayIndex}
                        className={`calendar-day ${
                          !isCurrentMonth ? 'other-month' : ''
                        } ${
                          isToday ? 'today' : ''
                        }`}
                      >
                        {date.getDate()}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;