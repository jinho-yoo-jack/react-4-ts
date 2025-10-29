import {useState} from 'react';
import {Search, Plus, Edit2, Trash2, Save, X, FileText, Box, Code, Eye, ChevronRight, ArrowLeft} from 'lucide-react';
import type {FileItem} from '../types/editor.types';

type View = 'entityList' | 'featureList' | 'editor';
type EditorType = 'entity' | 'feature';

export const FeatureEntityEditorNew = () => {
    const [view, setView] = useState<View>('entityList');
    const [selectedEntity, setSelectedEntity] = useState<FileItem | null>(null);
    const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);
    const [editorType, setEditorType] = useState<EditorType>('entity');
    const [searchQuery, setSearchQuery] = useState('');
    const [editorMode, setEditorMode] = useState<'json' | 'yaml'>('json');
    const [showPreview, setShowPreview] = useState(true);

    // Sample data
    const [items, setItems] = useState<FileItem[]>([
        {
            id: '1',
            name: 'user_profile',
            type: 'entity',
            description: '사용자 프로필 엔티티',
            format: 'json',
            createdAt: new Date('2025-10-25'),
            updatedAt: new Date('2025-10-25'),
            content: `{
  "name": "user_profile",
  "type": "entity",
  "fields": [
    {
      "name": "user_id",
      "type": "string",
      "primary_key": true
    },
    {
      "name": "email",
      "type": "string",
      "required": true
    },
    {
      "name": "created_at",
      "type": "timestamp"
    }
  ]
}`,
            fields: [
                {name: 'user_id', type: 'string', required: true},
                {name: 'email', type: 'string', required: true},
                {name: 'created_at', type: 'timestamp'}
            ]
        },
        {
            id: '2',
            name: 'purchase_amount',
            type: 'feature',
            description: '구매 금액 피처',
            format: 'yaml',
            createdAt: new Date('2025-10-26'),
            updatedAt: new Date('2025-10-26'),
            content: `name: purchase_amount
type: feature
entity: user_profile
value_type: float
description: "사용자의 총 구매 금액"
aggregation:
  function: sum
  window: 30d
source:
  table: transactions
  column: amount`,
            entities: ['user_profile']
        },
        {
            id: '3',
            name: 'order_history',
            type: 'entity',
            description: '주문 이력 엔티티',
            format: 'json',
            createdAt: new Date('2025-10-24'),
            updatedAt: new Date('2025-10-24'),
            content: `{
  "name": "order_history",
  "type": "entity",
  "fields": [
    {
      "name": "order_id",
      "type": "string",
      "primary_key": true
    },
    {
      "name": "user_id",
      "type": "string",
      "foreign_key": "user_profile.user_id"
    },
    {
      "name": "total_amount",
      "type": "float"
    }
  ]
}`,
            fields: [
                {name: 'order_id', type: 'string', required: true},
                {name: 'user_id', type: 'string'},
                {name: 'total_amount', type: 'float'}
            ]
        },
        {
            id: '4',
            name: 'user_activity_score',
            type: 'feature',
            description: '사용자 활동 점수',
            format: 'yaml',
            createdAt: new Date('2025-10-27'),
            updatedAt: new Date('2025-10-27'),
            content: `name: user_activity_score
type: feature
entity: user_profile
value_type: integer
description: "사용자의 활동 점수"`,
            entities: ['user_profile']
        }
    ]);

    const [editorContent, setEditorContent] = useState('');

    // Get all entities
    const entities = items.filter(item => item.type === 'entity');

    // Get features for selected entity
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

    const handleSelectEntity = (entity: FileItem) => {
        setSelectedEntity(entity);
        setSearchQuery('');
        setView('featureList');
    };

    const handleBackToEntities = () => {
        setSelectedEntity(null);
        setSearchQuery('');
        setView('entityList');
    };

    const handleEditEntity = (entity: FileItem) => {
        setSelectedItem(entity);
        setEditorContent(entity.content);
        setEditorMode(entity.format);
        setEditorType('entity');
        setView('editor');
    };

    const handleEditFeature = (feature: FileItem) => {
        setSelectedItem(feature);
        setEditorContent(feature.content);
        setEditorMode(feature.format);
        setEditorType('feature');
        setView('editor');
    };

    const handleDelete = (id: string) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const handleSave = () => {
        if (selectedItem) {
            setItems(items.map(item =>
                item.id === selectedItem.id
                    ? {...item, content: editorContent, updatedAt: new Date()}
                    : item
            ));
            alert('저장되었습니다!');
            if (editorType === 'entity') {
                setView('entityList');
            } else {
                setView('featureList');
            }
        } else {
            // Create new item
            const newItem: FileItem = {
                id: Date.now().toString(),
                name: 'new_item',
                type: editorType,
                format: editorMode,
                content: editorContent,
                createdAt: new Date(),
                updatedAt: new Date(),
                ...(editorType === 'feature' && selectedEntity ? {entities: [selectedEntity.name]} : {})
            };
            setItems([...items, newItem]);
            alert('생성되었습니다!');
            if (editorType === 'entity') {
                setView('entityList');
            } else {
                setView('featureList');
            }
        }
    };

    const handleCreateEntity = () => {
        setSelectedItem(null);
        setEditorContent('');
        setEditorMode('json');
        setEditorType('entity');
        setView('editor');
    };

    const handleCreateFeature = () => {
        setSelectedItem(null);
        setEditorContent('');
        setEditorMode('json');
        setEditorType('feature');
        setView('editor');
    };

    const handleCloseEditor = () => {
        if (editorType === 'entity') {
            setView('entityList');
        } else {
            setView('featureList');
        }
    };

    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    return (
        <div style={{minHeight: '100vh', backgroundColor: '#f8fafc'}}>
            {/* Header */}
            <header style={{
                backgroundColor: 'white',
                borderBottom: '1px solid #e2e8f0',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <div style={{maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem'}}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Code style={{width: '24px', height: '24px', color: 'white'}}/>
                            </div>
                            <div>
                                <h1 style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a', margin: 0}}>
                                    Feature & Entity Editor
                                </h1>
                                {view === 'entityList' && (
                                    <p style={{fontSize: '0.875rem', color: '#64748b', margin: 0}}>
                                        엔티티를 선택하여 관련 피처를 관리하세요
                                    </p>
                                )}
                                {view === 'featureList' && selectedEntity && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.875rem',
                                        color: '#64748b',
                                        margin: 0
                                    }}>
                                        <span>엔티티</span>
                                        <ChevronRight style={{width: '14px', height: '14px'}}/>
                                        <span style={{color: '#3b82f6', fontWeight: 600}}>{selectedEntity.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                            {view === 'entityList' && (
                                <>
                                    <span style={{fontSize: '0.875rem', color: '#475569'}}>{entities.length}개 엔티티</span>
                                    <button
                                        onClick={handleCreateEntity}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.5rem 1rem',
                                            backgroundColor: '#3b82f6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                                    >
                                        <Plus style={{width: '16px', height: '16px'}}/>
                                        엔티티 추가
                                    </button>
                                </>
                            )}
                            {view === 'featureList' && selectedEntity && (
                                <>
                  <span style={{fontSize: '0.875rem', color: '#475569'}}>
                    {getFeaturesForEntity(selectedEntity.name).length}개 피처
                  </span>
                                    <button
                                        onClick={handleCreateFeature}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.5rem 1rem',
                                            backgroundColor: '#3b82f6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                                    >
                                        <Plus style={{width: '16px', height: '16px'}}/>
                                        피처 추가
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Entity List View */}
            {view === 'entityList' && (
                <div style={{maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem'}}>
                    {/* Search Bar */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid #e2e8f0',
                        padding: '1.5rem',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                            <div style={{
                                flex: '1 1 0',
                                minWidth: 0,
                                position: 'relative',
                                display: 'flex',
                                gap: '0.5rem'
                            }}>
                                <div style={{position: 'relative', flex: 1}}>
                                    <Search style={{
                                        position: 'absolute',
                                        left: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: '20px',
                                        height: '20px',
                                        color: '#94a3b8'
                                    }}/>
                                    <input
                                        type="text"
                                        placeholder="엔티티 이름이나 설명으로 검색..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                // 검색은 이미 실시간으로 되고 있음
                                            }
                                        }}
                                        style={{
                                            width: '100%',
                                            paddingLeft: '2.5rem',
                                            paddingRight: '1rem',
                                            paddingTop: '0.75rem',
                                            paddingBottom: '0.75rem',
                                            border: '1px solid #cbd5e1',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            outline: 'none',
                                            backgroundColor: 'white',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                                <button
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s',
                                        whiteSpace: 'nowrap',
                                        flexShrink: 0
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                                >
                                    검색
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Entity Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                        gap: '1rem'
                    }}>
                        {filteredEntities.map(entity => (
                            <div
                                key={entity.id}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '12px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    border: '1px solid #e2e8f0',
                                    padding: '1.5rem',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleSelectEntity(entity)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                                    e.currentTarget.style.borderColor = '#3b82f6';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    marginBottom: '1rem'
                                }}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#dbeafe',
                                            color: '#3b82f6'
                                        }}>
                                            <Box style={{width: '20px', height: '20px'}}/>
                                        </div>
                                        <div>
                                            <h3 style={{
                                                fontWeight: 600,
                                                color: '#0f172a',
                                                margin: 0,
                                                marginBottom: '0.25rem'
                                            }}>
                                                {entity.name}
                                            </h3>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '0.125rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem',
                                                fontWeight: 500,
                                                backgroundColor: '#dbeafe',
                                                color: '#2563eb'
                                            }}>
                        Entity
                      </span>
                                        </div>
                                    </div>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditEntity(entity);
                                            }}
                                            style={{
                                                padding: '0.5rem',
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                borderRadius: '8px',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            title="수정"
                                        >
                                            <Edit2 style={{width: '16px', height: '16px', color: '#475569'}}/>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(entity.id);
                                            }}
                                            style={{
                                                padding: '0.5rem',
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                borderRadius: '8px',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            title="삭제"
                                        >
                                            <Trash2 style={{width: '16px', height: '16px', color: '#ef4444'}}/>
                                        </button>
                                    </div>
                                </div>
                                <p style={{fontSize: '0.875rem', color: '#475569', marginBottom: '0.75rem'}}>
                                    {entity.description || 'No description'}
                                </p>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    fontSize: '0.75rem',
                                    color: '#64748b'
                                }}>
                  <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#22c55e'
                    }}/>
                      {entity.format.toUpperCase()}
                  </span>
                                    <span>{getFeaturesForEntity(entity.name).length}개 피처</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredEntities.length === 0 && (
                        <div style={{textAlign: 'center', padding: '4rem 0'}}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                backgroundColor: '#f1f5f9',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem'
                            }}>
                                <Search style={{width: '32px', height: '32px', color: '#94a3b8'}}/>
                            </div>
                            <h3 style={{
                                fontSize: '1.125rem',
                                fontWeight: 600,
                                color: '#0f172a',
                                marginBottom: '0.5rem'
                            }}>
                                검색 결과가 없습니다
                            </h3>
                            <p style={{color: '#64748b'}}>다른 검색어를 시도해보세요</p>
                        </div>
                    )}
                </div>
            )}

            {/* Feature List View */}
            {view === 'featureList' && selectedEntity && (
                <div style={{maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem'}}>
                    {/* Back Button & Entity Info */}
                    <div style={{marginBottom: '1.5rem'}}>
                        <button
                            onClick={handleBackToEntities}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: 'white',
                                color: '#475569',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                marginBottom: '1rem'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8fafc';
                                e.currentTarget.style.borderColor = '#cbd5e1';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.borderColor = '#e2e8f0';
                            }}
                        >
                            <ArrowLeft style={{width: '16px', height: '16px'}}/>
                            엔티티 목록으로
                        </button>

                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            border: '1px solid #e2e8f0',
                            padding: '1.5rem'
                        }}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#dbeafe',
                                    color: '#3b82f6'
                                }}>
                                    <Box style={{width: '24px', height: '24px'}}/>
                                </div>
                                <div>
                                    <h2 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        color: '#0f172a',
                                        margin: 0,
                                        marginBottom: '0.25rem'
                                    }}>
                                        {selectedEntity.name}
                                    </h2>
                                    <p style={{fontSize: '0.875rem', color: '#64748b', margin: 0}}>
                                        {selectedEntity.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                        gap: '1rem'
                    }}>
                        {getFeaturesForEntity(selectedEntity.name).map(feature => (
                            <div
                                key={feature.id}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '12px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    border: '1px solid #e2e8f0',
                                    padding: '1.5rem',
                                    transition: 'box-shadow 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    marginBottom: '1rem'
                                }}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#f3e8ff',
                                            color: '#9333ea'
                                        }}>
                                            <FileText style={{width: '20px', height: '20px'}}/>
                                        </div>
                                        <div>
                                            <h3 style={{
                                                fontWeight: 600,
                                                color: '#0f172a',
                                                margin: 0,
                                                marginBottom: '0.25rem'
                                            }}>
                                                {feature.name}
                                            </h3>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '0.125rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem',
                                                fontWeight: 500,
                                                backgroundColor: '#f3e8ff',
                                                color: '#7c3aed'
                                            }}>
                        Feature
                      </span>
                                        </div>
                                    </div>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                                        <button
                                            onClick={() => handleEditFeature(feature)}
                                            style={{
                                                padding: '0.5rem',
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                borderRadius: '8px',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            title="수정"
                                        >
                                            <Edit2 style={{width: '16px', height: '16px', color: '#475569'}}/>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(feature.id)}
                                            style={{
                                                padding: '0.5rem',
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                borderRadius: '8px',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            title="삭제"
                                        >
                                            <Trash2 style={{width: '16px', height: '16px', color: '#ef4444'}}/>
                                        </button>
                                    </div>
                                </div>
                                <p style={{fontSize: '0.875rem', color: '#475569', marginBottom: '0.75rem'}}>
                                    {feature.description || 'No description'}
                                </p>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    fontSize: '0.75rem',
                                    color: '#64748b'
                                }}>
                  <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: feature.format === 'json' ? '#22c55e' : '#eab308'
                    }}/>
                      {feature.format.toUpperCase()}
                  </span>
                                    <span>수정: {formatDate(feature.updatedAt)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {getFeaturesForEntity(selectedEntity.name).length === 0 && (
                        <div style={{textAlign: 'center', padding: '4rem 0'}}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                backgroundColor: '#f1f5f9',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem'
                            }}>
                                <FileText style={{width: '32px', height: '32px', color: '#94a3b8'}}/>
                            </div>
                            <h3 style={{
                                fontSize: '1.125rem',
                                fontWeight: 600,
                                color: '#0f172a',
                                marginBottom: '0.5rem'
                            }}>
                                정의된 피처가 없습니다
                            </h3>
                            <p style={{color: '#64748b', marginBottom: '1.5rem'}}>새로운 피처를 추가해보세요</p>
                            <button
                                onClick={handleCreateFeature}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                            >
                                <Plus style={{width: '16px', height: '16px'}}/>
                                피처 추가
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Editor View */}
            {view === 'editor' && (
                <div style={{maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem'}}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid #e2e8f0',
                        overflow: 'hidden'
                    }}>
                        {/* Editor Header */}
                        <div style={{
                            borderBottom: '1px solid #e2e8f0',
                            padding: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                <button
                                    onClick={handleCloseEditor}
                                    style={{
                                        padding: '0.5rem',
                                        border: 'none',
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <X style={{width: '20px', height: '20px', color: '#475569'}}/>
                                </button>
                                <h2 style={{fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', margin: 0}}>
                                    {selectedItem ? `${editorType === 'entity' ? '엔티티' : '피처'} 수정: ${selectedItem.name}` : `새로운 ${editorType === 'entity' ? '엔티티' : '피처'} 추가`}
                                </h2>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.375rem',
                                    backgroundColor: '#f1f5f9',
                                    borderRadius: '8px'
                                }}>
                                    <button
                                        onClick={() => setEditorMode('json')}
                                        style={{
                                            padding: '0.25rem 0.75rem',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            backgroundColor: editorMode === 'json' ? 'white' : 'transparent',
                                            color: editorMode === 'json' ? '#0f172a' : '#475569',
                                            boxShadow: editorMode === 'json' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                                        }}
                                    >
                                        JSON
                                    </button>
                                    <button
                                        onClick={() => setEditorMode('yaml')}
                                        style={{
                                            padding: '0.25rem 0.75rem',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            backgroundColor: editorMode === 'yaml' ? 'white' : 'transparent',
                                            color: editorMode === 'yaml' ? '#0f172a' : '#475569',
                                            boxShadow: editorMode === 'yaml' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                                        }}
                                    >
                                        YAML
                                    </button>
                                </div>
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.375rem 0.75rem',
                                        border: 'none',
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <Eye style={{width: '16px', height: '16px', color: '#475569'}}/>
                                    <span style={{fontSize: '0.875rem', fontWeight: 500, color: '#334155'}}>프리뷰</span>
                                </button>
                                <button
                                    onClick={handleSave}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 1rem',
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                                >
                                    <Save style={{width: '16px', height: '16px'}}/>
                                    저장
                                </button>
                            </div>
                        </div>

                        {/* Editor Content */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr',
                            borderTop: '1px solid #e2e8f0'
                        }}>
                            {/* Code Editor */}
                            <div style={{padding: '1.5rem', borderRight: showPreview ? '1px solid #e2e8f0' : 'none'}}>
                                <h3 style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: '#334155',
                                    marginBottom: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <Code style={{width: '16px', height: '16px'}}/>
                                    코드 에디터
                                </h3>
                                <textarea
                                    value={editorContent}
                                    onChange={(e) => setEditorContent(e.target.value)}
                                    style={{
                                        width: '100%',
                                        height: '500px',
                                        padding: '1rem',
                                        fontFamily: 'Monaco, Menlo, monospace',
                                        fontSize: '0.875rem',
                                        backgroundColor: '#0f172a',
                                        color: '#22c55e',
                                        borderRadius: '8px',
                                        border: '1px solid #1e293b',
                                        outline: 'none',
                                        resize: 'vertical'
                                    }}
                                    placeholder={editorMode === 'json'
                                        ? editorType === 'entity'
                                            ? '{\n  "name": "my_entity",\n  "type": "entity",\n  "fields": [...]\n}'
                                            : '{\n  "name": "my_feature",\n  "type": "feature",\n  "entity": "' + (selectedEntity?.name || 'entity_name') + '",\n  ...\n}'
                                        : editorType === 'entity'
                                            ? 'name: my_entity\ntype: entity\nfields:\n  - ...'
                                            : 'name: my_feature\ntype: feature\nentity: ' + (selectedEntity?.name || 'entity_name') + '\n...'
                                    }
                                    spellCheck={false}
                                />
                            </div>

                            {/* Preview */}
                            {showPreview && (
                                <div style={{padding: '1.5rem', backgroundColor: '#f8fafc'}}>
                                    <h3 style={{
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        color: '#334155',
                                        marginBottom: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <Eye style={{width: '16px', height: '16px'}}/>
                                        프리뷰
                                    </h3>
                                    <div style={{
                                        backgroundColor: 'white',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        padding: '1rem',
                                        height: '500px',
                                        overflowY: 'auto'
                                    }}>
                                        {editorContent ? (
                                            <pre style={{
                                                fontSize: '0.875rem',
                                                color: '#334155',
                                                whiteSpace: 'pre-wrap',
                                                fontFamily: 'Monaco, Menlo, monospace',
                                                margin: 0
                                            }}>
                        {editorContent}
                      </pre>
                                        ) : (
                                            <div style={{
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>
                                                    내용을 입력하면 여기에 표시됩니다
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Helper Info */}
                    <div style={{
                        marginTop: '1.5rem',
                        backgroundColor: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '12px',
                        padding: '1rem'
                    }}>
                        <h4 style={{fontWeight: 600, color: '#1e3a8a', marginBottom: '0.5rem'}}>💡 도움말</h4>
                        <ul style={{fontSize: '0.875rem', color: '#1e40af', margin: 0, paddingLeft: '1.5rem'}}>
                            {editorType === 'entity' ? (
                                <>
                                    <li>Entity는 데이터의 기본 구조와 스키마를 정의합니다</li>
                                    <li>각 Entity는 여러 개의 Field를 가질 수 있습니다</li>
                                    <li>Entity를 먼저 정의한 후 Feature를 추가할 수 있습니다</li>
                                </>
                            ) : (
                                <>
                                    <li>Feature는 모델 학습에 사용되는 데이터 특성을 정의합니다</li>
                                    <li>Feature는 반드시 하나의 Entity에 속해야 합니다</li>
                                    <li>현재 선택된 Entity: <strong>{selectedEntity?.name || '없음'}</strong></li>
                                </>
                            )}
                            <li>JSON 또는 YAML 형식으로 정의할 수 있습니다</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};
