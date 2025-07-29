import React, { useState } from 'react';
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
  id_orig?: string;
  file_link?: string;
  date_time?: string;
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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImageClick = () => {
    if (data.file_link) {
      setIsImageModalOpen(true);
    }
  };

  const handleImageModalClose = () => {
    setIsImageModalOpen(false);
  };

  const handleImageModalOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleImageModalClose();
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
                <Calendar size={16} style={{ display: 'inline', marginRight: '8px' }} />
                Дата последнего выхода:
              </span>
              <span className="info-value">
                {data.date_time && data.date_time !== 'null' && data.date_time !== '' ? (
                  <>
                    {new Date(data.date_time).toLocaleDateString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {/* <br /> */}
                    {/* <small style={{ color: '#6b7280', fontSize: '12px' }}>
                      Raw: {data.date_time}
                    </small> */}
                  </>
                ) : (
                  <>
                    Н/Д
                    <br />
                    <small style={{ color: '#6b7280', fontSize: '12px' }}>
                      Raw: {data.date_time || 'undefined'}
                    </small>
                  </>
                )}
              </span>
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
              <span className={`creative-status ${data.status === 'Активен' ? 'active' : 'inactive'}`}>
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
            
            {data.file_link ? (
              <div className="material-preview">
                <div className="creative-image-container" onClick={handleImageClick}>
                  <img 
                    src={data.file_link} 
                    alt={`Креатив ${data.brand}`}
                    className="creative-image"
                    onError={(e) => {
                      // Если изображение не загрузилось, показываем иконку
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.classList.add('image-error');
                      }
                    }}
                  />
                  <div className="image-overlay">
                    <Eye size={20} />
                    <span>Нажмите для увеличения</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="material-preview" onClick={handlePreviewClick}>
                <div className="material-icon">
                  {getMediaIcon(data.media)}
                </div>
                <div className="material-info">
                  <div className="material-title">Материал для {data.media}</div>
                  <div className="material-subtitle">Изображение недоступно</div>
                </div>
              </div>
            )}
          </div>

          {/* Кнопки действий */}
         
        </div>
      </div>

      {/* Модальное окно с полным изображением */}
      {isImageModalOpen && data.file_link && (
        <div className="image-modal-overlay" onClick={handleImageModalOverlayClick}>
          <div className="image-modal">
            <div className="image-modal-header">
              <h3>Креатив {data.brand}</h3>
              <button className="image-modal-close" onClick={handleImageModalClose}>
                <X size={20} />
              </button>
            </div>
            <div className="image-modal-content">
              <img 
                src={data.file_link} 
                alt={`Креатив ${data.brand}`}
                className="full-size-image"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreativeModal;