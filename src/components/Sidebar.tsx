import React from 'react';
import './Sidebar.css';
import { GanttChart, User, LayoutDashboard, Monitor, BarChart3, GitBranch, Download, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

type LucideIcon = React.ComponentType<{ className?: string }>;

const menu: { icon: LucideIcon; label: string; to: string }[] = [
  { icon: LayoutDashboard, label: 'Дашборд', to: '/' },
  { icon: Monitor, label: 'Мониторинг', to: '/monitoring' },
  { icon: GanttChart, label: 'Анализ коммуникации', to: '/communication-analysis' },
  { icon: BarChart3, label: 'Аналитика', to: '/analytics' },
  { icon: GitBranch, label: 'Флоучарт', to: '/flowchart' },
  { icon: Download, label: 'Экспорт', to: '/export' },
  // { icon: HelpCircle, label: 'Помощь', to: '/help' },
];


const bottomMenu: { icon: LucideIcon; label: string; to: string }[] = [
  { icon: HelpCircle, label: 'Помощь', to: '/help' },
  { icon: User, label: 'Профиль', to: '/profile' },
];

type SidebarProps = {
  collapsed?: boolean;
  setCollapsed?: (v: boolean) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, setCollapsed }) => {
  const handleBottomItemClick = (label: string) => {
    console.log(`Clicked: ${label}`);
    // Здесь можно добавить логику для открытия модальных окон помощи или профиля
  };

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
     

      <div className="sidebar-header">
        <div className="sidebar-logo">
          {collapsed ? 'A' : 'ARENA'}
        </div>
        <button className="sidebar-toggle" onClick={() => setCollapsed?.(!collapsed)}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menu.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.label} data-tooltip={item.label}>
                <NavLink 
                  to={item.to} 
                  className={({ isActive }) => isActive ? 'active' : ''}
                  end={item.to === '/'}
                >
                  <IconComponent className="sidebar-icon"/>
                  <span className="sidebar-text">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-bottom">
        {bottomMenu.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink 
              to={item.to} 
              className="sidebar-help" 
              key={item.label} 
              data-tooltip={item.label}
              onClick={() => handleBottomItemClick(item.label)}
            >
              <IconComponent className="sidebar-icon" />
              <span className="sidebar-text">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;