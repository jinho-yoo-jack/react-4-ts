import { useState, useEffect } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import { useEditorStore } from '../stores/editorStore';
import type { FileFormat, FileType } from '../types/editor.types';
import './FileEditorModal.scss';

export const FileEditorModal = () => {
  const { isEditorOpen, selectedFile, closeEditor, addFile, updateFile } = useEditorStore();

  const [name, setName] = useState('');
  const [type, setType] = useState<FileType>('feature');
  const [format, setFormat] = useState<FileFormat>('json');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (selectedFile) {
      setName(selectedFile.name);
      setType(selectedFile.type);
      setFormat(selectedFile.format);
      setContent(selectedFile.content);
      setDescription(selectedFile.description || '');
    } else {
      // Reset for new file
      setName('');
      setType('feature');
      setFormat('json');
      setContent('');
      setDescription('');
    }
  }, [selectedFile, isEditorOpen]);

  const handleSave = () => {
    if (!name.trim() || !content.trim()) {
      alert('Name and content are required');
      return;
    }

    // Parse content to extract entities/fields
    let parsedData: any = {};
    try {
      if (format === 'json') {
        parsedData = JSON.parse(content);
      }
      // For YAML, we'd need a parser library, for now just save as is
    } catch (error) {
      alert('Invalid JSON format');
      return;
    }

    const fileData = {
      name,
      type,
      format,
      content,
      description: description || parsedData.description,
      entities: type === 'feature' ? parsedData.entities : undefined,
      fields: type === 'entity' ? parsedData.fields : undefined,
    };

    if (selectedFile) {
      updateFile(selectedFile.id, fileData);
    } else {
      addFile(fileData);
    }

    closeEditor();
  };

  const handleFormatChange = (newFormat: FileFormat) => {
    setFormat(newFormat);
    // Optionally convert content between formats
  };

  if (!isEditorOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeEditor}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{selectedFile ? 'Edit File' : 'New File'}</h2>
          <button className="close-button" onClick={closeEditor}>
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label>File Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., feature-user"
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as FileType)}>
                <option value="feature">Feature</option>
                <option value="entity">Entity</option>
              </select>
            </div>

            <div className="form-group">
              <label>Format</label>
              <div className="format-toggle">
                <button
                  className={format === 'json' ? 'active' : ''}
                  onClick={() => handleFormatChange('json')}
                >
                  JSON
                </button>
                <button
                  className={format === 'yaml' ? 'active' : ''}
                  onClick={() => handleFormatChange('yaml')}
                >
                  YAML
                </button>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this file"
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                format === 'json'
                  ? '{\n  "name": "Example",\n  "description": "...",\n  ...\n}'
                  : 'name: Example\ndescription: ...'
              }
              rows={15}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="button-secondary" onClick={closeEditor}>
            Cancel
          </button>
          <button className="button-primary" onClick={handleSave}>
            <FiSave />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};
