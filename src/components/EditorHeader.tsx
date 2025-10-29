import { FiSearch, FiPlus } from 'react-icons/fi';
import { useEditorStore } from '../stores/editorStore';
import './EditorHeader.scss';

export const EditorHeader = () => {
  const { searchQuery, setSearchQuery, openEditor } = useEditorStore();

  const handleAddNew = () => {
    openEditor();
  };

  return (
    <div className="editor-header">
      <h1 className="editor-title">Feature & Entity Editor</h1>
      <div className="editor-controls">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="add-button" onClick={handleAddNew}>
          <FiPlus />
          <span>New File</span>
        </button>
      </div>
    </div>
  );
};
