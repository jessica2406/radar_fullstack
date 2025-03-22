import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import VideoUpload from './VideoUpload';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/upload" element={<VideoUpload />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;