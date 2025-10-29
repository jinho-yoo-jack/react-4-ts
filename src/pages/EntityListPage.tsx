import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2, Code, Box } from 'lucide-react';
import { useEditorStore } from '../stores/editorStore';
import './EntityListPage.scss';

export const EntityListPage = () => {
  const navigate = useNavigate();
  const { files: items, deleteFile } = useEditorStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Get all entities
  const entities = items.filter(item => item.type === 'entity');

  // Get features for entity
  const getFeaturesForEntity = (entityName: string) => {
    return items.filter(item =>
      item.type === 'feature' &&
      item.entities?.includes(entityName)
    );
  };

  const filteredEntities = entities.filter(entity => {
    return entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (entity.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
  });

  const handleSelectEntity = (entity: any) => {
    navigate(`/entities/${entity.id}/features`);
  };

  const handleEditEntity = (entity: any) => {
    navigate(`/entities/${entity.id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      deleteFile(id);
    }
  };

  const handleCreateEntity = () => {
    navigate('/entities/new');
  };

  return (
    <div className="entity-list-page">
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
                <p>엔티티를 선택하여 관련 피처를 관리하세요</p>
              </div>
            </div>
            <div className="header-right">
              <span className="entity-count">{entities.length}개 엔티티</span>
              <button onClick={handleCreateEntity} className="add-entity-button">
                <Plus />
                엔티티 추가
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Entity List View */}
      <div className="main-content">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <div className="input-with-icon">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="엔티티 이름이나 설명으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="search-button">검색</button>
            </div>
          </div>
        </div>

        {/* Entity Grid */}
        <div className="entity-grid">
          {filteredEntities.map(entity => (
            <div
              key={entity.id}
              className="entity-card"
              onClick={() => handleSelectEntity(entity)}
            >
              <div className="card-header">
                <div className="card-left">
                  <div className="icon-wrapper">
                    <Box />
                  </div>
                  <div className="card-info">
                    <h3>{entity.name}</h3>
                    <span className="entity-badge">Entity</span>
                  </div>
                </div>
                <div className="card-actions">
                  <button
                    className="edit-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditEntity(entity);
                    }}
                    title="수정"
                  >
                    <Edit2 />
                  </button>
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(entity.id);
                    }}
                    title="삭제"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
              <p className="card-description">
                {entity.description || 'No description'}
              </p>
              <div className="card-footer">
                <span className="format-badge">
                  <div className="status-dot" />
                  {entity.format.toUpperCase()}
                </span>
                <span>{getFeaturesForEntity(entity.name).length}개 피처</span>
              </div>
            </div>
          ))}
        </div>

        {filteredEntities.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <Search />
            </div>
            <h3>검색 결과가 없습니다</h3>
            <p>다른 검색어를 시도해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
};
