import { EditorHeader } from './EditorHeader';
import { FileList } from './FileList';
import { FileEditorModal } from './FileEditorModal';
import './FeatureEntityEditor.scss';

export const FeatureEntityEditor = () => {
  return (
    <div className="feature-entity-editor">
      <EditorHeader />
      <FileList />
      <FileEditorModal />
    </div>
  );
};
