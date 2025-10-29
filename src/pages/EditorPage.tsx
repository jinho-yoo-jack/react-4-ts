import {useState, useEffect} from 'react';
import {useNavigate, useParams, useLocation} from 'react-router-dom';
import {Save, X, Code, Eye} from 'lucide-react';
import {useEditorStore} from '../stores/editorStore';
import type {FileFormat} from '../types/editor.types';
import './EditorPage.scss';

export const EditorPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {entityId, featureId} = useParams<{ entityId?: string; featureId?: string }>();
    const {files: items, addFile, updateFile} = useEditorStore();

    const [editorContent, setEditorContent] = useState('');
    const [editorMode, setEditorMode] = useState<FileFormat>('json');
    const [showPreview, setShowPreview] = useState(true);

    // Determine if we're creating or editing based on URL path
    const isCreatingEntity = location.pathname === '/entities/new';
    const isEditingEntity = location.pathname.includes('/edit') && entityId && !featureId;
    const isCreatingFeature = location.pathname.includes('/features/new') && entityId;
    const isEditingFeature = location.pathname.includes('/edit') && featureId;

    // Get current item (entity or feature)
    const currentItem = isEditingEntity
        ? items.find(item => item.id === entityId && item.type === 'entity')
        : isEditingFeature
            ? items.find(item => item.id === featureId && item.type === 'feature')
            : null;

    const selectedEntity = entityId ? items.find(item => item.id === entityId && item.type === 'entity') : null;

    const editorType = (isCreatingEntity || isEditingEntity) ? 'entity' : 'feature';

    useEffect(() => {
        if (currentItem) {
            setEditorContent(currentItem.content);
            setEditorMode(currentItem.format);
        } else {
            setEditorContent('');
            setEditorMode('json');
        }
    }, [currentItem]);

    const handleSave = () => {
        if (currentItem) {
            // Update existing item
            updateFile(currentItem.id, {
                content: editorContent,
                format: editorMode,
                updatedAt: new Date()
            });
            alert('저장되었습니다!');
        } else {
            // Create new item
            const newItem = {
                name: 'new_item',
                type: editorType,
                format: editorMode,
                content: editorContent,
                ...(editorType === 'feature' && selectedEntity ? {entities: [selectedEntity.name]} : {})
            };
            addFile(newItem as any);
            alert('생성되었습니다!');
        }

        // Navigate back
        if (editorType === 'entity') {
            navigate('/');
        } else if (selectedEntity) {
            navigate(`/entities/${selectedEntity.id}/features`);
        } else {
            navigate('/');
        }
    };

    const handleClose = () => {
        if (editorType === 'entity') {
            navigate('/');
        } else if (selectedEntity) {
            navigate(`/entities/${selectedEntity.id}/features`);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="editor-page">
            {/* Header */}
            <header className="page-header">
                <div className="header-container">
                    <div className="header-content">
                        <div className="header-left">
                            <div className="logo">
                                <Code/>
                            </div>
                            <div className="header-info">
                                <h1>
                                    {currentItem ? `${editorType === 'entity' ? '엔티티' : '피처'} 수정` : `새로운 ${editorType === 'entity' ? '엔티티' : '피처'} 추가`}
                                </h1>
                                {currentItem && currentItem.name ? <p>{currentItem.name}</p>
                                    : <input type="text"
                                             placeholder={`새로운 ${editorType === 'entity' ? '엔티티' : '피처'} 추가`}/>}
                                {/*{currentItem && (*/}
                                {/*    <p>{currentItem.name}</p>*/}
                                {/*)}*/}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Editor View */}
            <div className="main-content">
                <div className="editor-container">
                    {/* Editor Header */}
                    <div className="editor-header">
                        <div className="header-left">
                            <button onClick={handleClose} className="close-button">
                                <X/>
                            </button>
                            <h2>
                                {currentItem ? `${editorType === 'entity' ? '엔티티' : '피처'} 수정: ${currentItem.name}` : `새로운 ${editorType === 'entity' ? '엔티티' : '피처'} 추가`}
                            </h2>
                        </div>
                        <div className="header-right">
                            <div className="format-toggle">
                                <button
                                    onClick={() => setEditorMode('json')}
                                    className={editorMode === 'json' ? 'active' : ''}
                                >
                                    JSON
                                </button>
                                <button
                                    onClick={() => setEditorMode('yaml')}
                                    className={editorMode === 'yaml' ? 'active' : ''}
                                >
                                    YAML
                                </button>
                            </div>
                            <button onClick={() => setShowPreview(!showPreview)}
                                    className="preview-toggle">
                                <Eye/>
                                <span>프리뷰</span>
                            </button>
                            <button onClick={handleSave} className="save-button">
                                <Save/>
                                저장
                            </button>
                        </div>
                    </div>

                    {/* Editor Content */}
                    <div
                        className={`editor-content ${showPreview ? 'with-preview' : 'without-preview'}`}>
                        {/* Code Editor */}
                        <div className={`code-editor-section ${showPreview ? 'with-border' : ''}`}>
                            <h3 className="section-header">
                                <Code/>
                                코드 에디터
                            </h3>
                            <textarea
                                className="code-textarea"
                                value={editorContent}
                                onChange={(e) => setEditorContent(e.target.value)}
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
                            <div className="preview-section">
                                <h3 className="section-header">
                                    <Eye/>
                                    프리뷰
                                </h3>
                                <div className="preview-content">
                                    {editorContent ? (
                                        <pre>{editorContent}</pre>
                                    ) : (
                                        <div className="empty-preview">
                                            <p>내용을 입력하면 여기에 표시됩니다</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Helper Info */}
                <div className="helper-info">
                    <h4>💡 도움말</h4>
                    <ul>
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
                                <li>현재 선택된 Entity: <strong>{selectedEntity?.name || '없음'}</strong>
                                </li>
                            </>
                        )}
                        <li>JSON 또는 YAML 형식으로 정의할 수 있습니다</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
