import React from 'react';
import './Help.css';
import { HelpCircle } from 'lucide-react';

const Help: React.FC<{ sidebarCollapsed?: boolean }> = ({ sidebarCollapsed = false }) => (
  <div className={`help-page${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
    <div className="help-hero">
      <HelpCircle size={48} className="help-hero-icon" />
      <h1>Центр поддержки</h1>
      <p className="help-hero-desc">Здесь вы найдёте ответы на частые вопросы и сможете связаться с нашей командой.</p>
    </div>
    <div className="help-content">
      <section className="help-faq">
        <h2>Часто задаваемые вопросы</h2>
        <div className="faq-list">
          <div className="faq-item">
            <div className="faq-q">Как экспортировать данные?</div>
            <div className="faq-a">Перейдите на страницу экспорта, выберите нужные фильтры и нажмите «Выгрузить в Excel».</div>
          </div>
          <div className="faq-item">
            <div className="faq-q">Как посмотреть подробности по креативу?</div>
            <div className="faq-a">В таблице мониторинга или флоучарта кликните по названию креатива.</div>
          </div>
          <div className="faq-item">
            <div className="faq-q">Как работает фильтрация?</div>
            <div className="faq-a">Выберите значения в фильтрах — данные обновятся автоматически.</div>
          </div>
        </div>
      </section>
      <section className="help-contact">
        <h2>Связаться с поддержкой</h2>
        <div className="contact-card">
          <p>Если у вас остались вопросы, напишите нам на <a href="mailto:support@creativearena.ru">support@creativearena.ru</a> или воспользуйтесь формой обратной связи.</p>
          <a href="mailto:support@creativearena.ru" className="contact-btn">Написать в поддержку</a>
        </div>
      </section>
    </div>
  </div>
);

export default Help; 