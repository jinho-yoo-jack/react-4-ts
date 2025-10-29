import {FiEdit, FiTrash2, FiFile, FiBox} from 'react-icons/fi';
import type {FileItem} from "../types/editor.types";
import {useEditorStore} from '../stores/editorStore';
import './FileItemCard.scss';

interface FileItemCardProps {
    file: FileItem;
}

export const FileItemCard = ({file}: FileItemCardProps) => {
    const {selectFile, openEditor, deleteFile} = useEditorStore();

    const handleEdit = () => {
        selectFile(file);
        openEditor();
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete "${file.name}"?`)) {
            deleteFile(file.id);
        }
    };

    const getFileIcon = () => {
        return file.type === 'feature' ? <FiBox className="file-icon feature"/> :
            <FiFile className="file-icon entity"/>;
    };

    const getFileDetails = () => {
        if (file.type === 'feature' && file.entities) {
            return `${file.entities.length} ${file.entities.length === 1 ? 'entity' : 'entities'}`;
        }
        if (file.type === 'entity' && file.fields) {
            return `${file.fields.length} ${file.fields.length === 1 ? 'field' : 'fields'}`;
        }
        return '';
    };

    return (
        <div className="file-item-card">
            <div className="file-item-header">
                <div className="file-item-info">
                    {getFileIcon()}
                    <div className="file-item-text">
                        <div className="file-item-title">
                            <span className="file-name">{file.name}.{file.format}</span>
                            <span className="file-type-badge">{file.type}</span>
                        </div>
                        <div className="file-item-description">
                            {file.description || 'No description'} • {getFileDetails()}
                        </div>
                    </div>
                </div>
                <div className="file-item-actions">
                    <button className="action-button edit" onClick={handleEdit} title="Edit">
                        <FiEdit/>
                    </button>
                    <button className="action-button delete" onClick={handleDelete} title="Delete">
                        <FiTrash2/>
                    </button>
                </div>
            </div>
        </div>
    );
};
