import React from 'react';
import './CreativeModal.css';
import { X, Play, Download, Share2, Eye, Calendar, Building2, Tag, Layers, Tv2, TrendingUp, Activity } from 'lucide-react';

interface CreativeData {
  date: string;
  brand: string;
  category: string;
  subcategory: string;
  media: string;
  ots: string;
  status: string;
  firstAirDate?: string;
}

interface CreativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CreativeData;
}

const getMediaBadgeClass = (media: string): string => {
  switch (media) {
    case 'ТВ':
      return 'media-type-badge tv';
    case 'Радио':
      return 'media-type-badge radio';
    case 'Онлайн видео':
      return 'media-type-badge online';
    case 'Баннерная реклама':
      return 'media-type-badge banner';
    case 'Наружная реклама':
      return 'media-type-badge outdoor';
    default:
      return 'media-type-badge';
  }
};

const getMediaIcon = (media: string) => {
  switch (media) {
    case 'ТВ':
      return <Tv2 size={24} />;
    case 'Онлайн видео':
      return <Play size={24} />;
    default:
      return <Layers size={24} />;
  }
};

const CreativeModal: React.FC<CreativeModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePreviewClick = () => {
    console.log('Открыть превью креатива');
  };

  const handleDownload = () => {
    console.log('Скачать креатив');
  };

  const handleShare = () => {
    console.log('Поделиться креативом');
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="creative-modal">
        {/* Заголовок */}
        <div className="modal-header">
          <h2 className="modal-title">Детали креатива</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Содержимое */}
        <div className="modal-content">
          <div className="modal-info-grid">
            {/* Основная информация */}
            <div className="info-row">
              <span className="info-label">
                <Building2 size={16} style={{ display: 'inline', marginRight: '8px' }} />
                Бренд:
              </span>
              <span className="info-value brand">{data.brand}</span>
            </div>

            <div className="info-row">
              <span className="info-label">
                <Tag size={16} style={{ display: 'inline', marginRight: '8px' }} />
                Категория:
              </span>
              <span className="info-value">{data.category}</span>
            </div>

            <div className="info-row">
              <span className="info-label">
                <Layers size={16} style={{ display: 'inline', marginRight: '8px' }} />
                Подкатегория:
              </span>
              <span className="info-value">{data.subcategory}</span>
            </div>

            <div className="info-row">
              <span className="info-label">
                <Tv2 size={16} style={{ display: 'inline', marginRight: '8px' }} />
                Тип медиа:
              </span>
              <span className={getMediaBadgeClass(data.media)}>
                {data.media}
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">
                <Calendar size={16} style={{ display: 'inline', marginRight: '8px' }} />
                Дата первого выхода:
              </span>
              <span className="info-value">{data.firstAirDate || data.date}</span>
            </div>

            <div className="info-row">
              <span className="info-label">
                <TrendingUp size={16} style={{ display: 'inline', marginRight: '8px' }} />
                OTS:
              </span>
              <span className="info-value ots">{data.ots}</span>
            </div>

            <div className="info-row">
              <span className="info-label">
                <Activity size={16} style={{ display: 'inline', marginRight: '8px' }} />
                Статус:
              </span>
              <span className="creative-status">
                <span className="status-indicator"></span>
                {data.status}
              </span>
            </div>
          </div>

          {/* Креативный материал */}
          <div className="creative-material">
            <div className="material-header">
              <span className="material-label">Креативный материал:</span>
            </div>
            <div className="material-preview" onClick={handlePreviewClick}>
              <div className="material-icon">
                {getMediaIcon(data.media)}
              </div>
              <div className="material-info">
                <div className="material-title">Материал для {data.media}</div>
                {/* <div className="material-subtitle">Нажмите для просмотра</div> */}
              </div>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="modal-actions">
            {/* <button className="modal-button secondary" onClick={handleShare}>
              <Share2 size={18} />
              Поделиться
            </button> */}
            <button className="modal-button secondary" onClick={handleDownload}>
              <Download size={18} />
              Скачать
            </button>
            {/* <button className="modal-button primary" onClick={handlePreviewClick}>
              <Eye size={18} />
              Просмотреть
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeModal;