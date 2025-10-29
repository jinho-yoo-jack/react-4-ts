import { useEditorStore } from '../stores/editorStore';
import { FileItemCard } from './FileItemCard';
import './FileList.scss';

export const FileList = () => {
  const getFilteredFiles = useEditorStore((state) => state.getFilteredFiles);
  const filteredFiles = getFilteredFiles();

  if (filteredFiles.length === 0) {
    return (
      <div className="file-list-empty">
        <p>No files found</p>
        <p className="empty-hint">Try adjusting your search or create a new file</p>
      </div>
    );
  }

  return (
    <div className="file-list">
      {filteredFiles.map((file) => (
        <FileItemCard key={file.id} file={file} />
      ))}
    </div>
  );
};
