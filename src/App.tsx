import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EntityListPage } from './pages/EntityListPage';
import { FeatureListPage } from './pages/FeatureListPage';
import { EditorPage } from './pages/EditorPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<EntityListPage />} />
                <Route path="/entities/:entityId/features" element={<FeatureListPage />} />
                <Route path="/entities/new" element={<EditorPage />} />
                <Route path="/entities/:entityId/edit" element={<EditorPage />} />
                <Route path="/entities/:entityId/features/new" element={<EditorPage />} />
                <Route path="/features/:featureId/edit" element={<EditorPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
