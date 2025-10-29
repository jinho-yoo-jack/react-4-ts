import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowLeft, Box, FileText, Code, ChevronRight } from 'lucide-react';
import { useEditorStore } from '../stores/editorStore';
import './FeatureListPage.scss';

export const FeatureListPage = () => {
  const navigate = useNavigate();
  const { entityId } = useParams<{ entityId: string }>();
  const { files: items, deleteFile } = useEditorStore();

  // Find selected entity
  const selectedEntity = items.find(item => item.id === entityId && item.type === 'entity');

  // Get features for selected entity
  const getFeaturesForEntity = () => {
    if (!selectedEntity) return [];
    return items.filter(item =>
      item.type === 'feature' &&
      item.entities?.includes(selectedEntity.name)
    );
  };

  const features = getFeaturesForEntity();

  const handleBackToEntities = () => {
    navigate('/');
  };

  const handleEditFeature = (feature: any) => {
    navigate(`/features/${feature.id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      deleteFile(id);
    }
  };

  const handleCreateFeature = () => {
    navigate(`/entities/${entityId}/features/new`);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  if (!selectedEntity) {
    return (
      <div className="feature-list-page">
        <div className="not-found">
          <div className="not-found-content">
            <h2>엔티티를 찾을 수 없습니다</h2>
            <button onClick={handleBackToEntities}>엔티티 목록으로</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feature-list-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-container">
          <div className="header-content">
            <div className="header-left">
              <div className="logo">
                <Code />
              </div>
              <div className="header-info">
                <h1>Feature & Entity Editor</h1>
                <div className="breadcrumb">
                  <span>엔티티</span>
                  <ChevronRight />
                  <span className="entity-name">{selectedEntity.name}</span>
                </div>
              </div>
            </div>
            <div className="header-right">
              <span className="feature-count">{features.length}개 피처</span>
              <button onClick={handleCreateFeature} className="add-feature-button">
                <Plus />
                피처 추가
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Feature List View */}
      <div className="main-content">
        {/* Back Button & Entity Info */}
        <div className="navigation-section">
          <button onClick={handleBackToEntities} className="back-button">
            <ArrowLeft />
            엔티티 목록으로
          </button>

          <div className="entity-info-card">
            <div className="entity-info-content">
              <div className="icon-wrapper">
                <Box />
              </div>
              <div className="entity-details">
                <h2>{selectedEntity.name}</h2>
                <p>{selectedEntity.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="feature-grid">
          {features.map(feature => (
            <div key={feature.id} className="feature-card">
              <div className="card-header">
                <div className="card-left">
                  <div className="icon-wrapper">
                    <FileText />
                  </div>
                  <div className="card-info">
                    <h3>{feature.name}</h3>
                    <span className="feature-badge">Feature</span>
                  </div>
                </div>
                <div className="card-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEditFeature(feature)}
                    title="수정"
                  >
                    <Edit2 />
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(feature.id)}
                    title="삭제"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
              <p className="card-description">
                {feature.description || 'No description'}
              </p>
              <div className="card-footer">
                <span className="format-badge">
                  <div className={`status-dot ${feature.format}`} />
                  {feature.format.toUpperCase()}
                </span>
                <span>수정: {formatDate(feature.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>

        {features.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <FileText />
            </div>
            <h3>정의된 피처가 없습니다</h3>
            <p>새로운 피처를 추가해보세요</p>
            <button onClick={handleCreateFeature} className="add-feature-button">
              <Plus />
              피처 추가
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
