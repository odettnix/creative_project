import React from 'react';
import './MainDashboard.css';
import { BarChart3, Trophy, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import CustomTooltip from './CustomTooltip';

const cards = [
  {
    icon: <BarChart3 className="dashboard-card-icon" style={{color: '#6c63ff'}} />,
    value: '567,234',
    label: 'Всего креативов',
  },
  {
    icon: <span className="dashboard-badge-new" style={{background: '#ff8a65'}}>NEW</span>,
    value: '1,847',
    label: 'Новых за неделю',
  },
  {
    icon: <Trophy className="dashboard-card-icon" style={{color: '#ffc94c'}} />,
    value: 'Банки',
    label: 'Топ категория',
  },
  {
    icon: <TrendingUp className="dashboard-card-icon" style={{color: '#4ad991'}} />,
    value: 'Онлайн видео',
    label: 'Лидер по количеству новых креативов',
  },
];

const data = [
  { name: 'ТВ', value: 35.2, color: '#a084fa' },
  { name: 'Радио', value: 15, color: '#4ad991' },
  { name: 'Онлайн видео', value: 20, color: '#00e0ff' },
  { name: 'Баннерная реклама', value: 18, color: '#ffb84c' },
  { name: 'Наружная реклама', value: 11.8, color: '#ffc94c' },
];

const actions = [
  {
    icon: <BarChart3 className="dashboard-action-icon" style={{color: '#6c63ff'}} />,
    title: 'Мониторинг креативов',
    desc: 'Просмотр и фильтрация рекламных материалов',
  },
  {
    icon: <Trophy className="dashboard-action-icon" style={{color: '#ff8a65'}} />,
    title: 'Анализ коммуникации',
    desc: 'Анализ эффективности коммуникаций',
  },
  {
    icon: <TrendingUp className="dashboard-action-icon" style={{color: '#5b3fd6'}} />,
    title: 'Аналитика',
    desc: 'Графики и статистика по выходам',
  },
  {
    icon: <BarChart3 className="dashboard-action-icon" style={{color: '#4ad991'}} />,
    title: 'Флоучарт',
    desc: 'Детальная карта активности брендов',
  },
];

const MainDashboard: React.FC<{ sidebarCollapsed?: boolean }> = ({ sidebarCollapsed = false }) => {
  return (
    <main className="main-dashboard light-blocks">
      <div className="dashboard-cards-row">
        {cards.map((card, idx) => (
          <div className="dashboard-card light" key={idx}>
            {card.icon}
            <div>
              <div className="dashboard-card-value">{card.value}</div>
              <div className="dashboard-card-label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-graph-block light">
        <div className="dashboard-graph-title">Распределение по медиа за неделю</div>
        <div className="dashboard-graph-chart">
          <ResponsiveContainer width="100%" height={320} minWidth={400} minHeight={320}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={110}
                paddingAngle={2}
                label={false}
              >
                {data.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{ color: '#23244a', fontSize: '1rem', marginTop: 16 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="dashboard-actions-title">Быстрые действия</div>
      <div className="dashboard-actions-row light">
        {actions.map((action, idx) => (
          <div className="dashboard-action-card light" key={idx}>
            {action.icon}
            <div>
              <div className="dashboard-action-title">{action.title}</div>
              <div className="dashboard-action-desc">{action.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default MainDashboard;