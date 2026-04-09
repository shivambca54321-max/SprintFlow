import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { Auth } from './pages/Auth';
import EditorPage from './pages/EditorPage';
import Portfolio from './pages/Portfolio';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/editor/:id" element={<EditorPage />} />
      <Route path="/portfolio" element={<Portfolio />} />
    </Routes>
  );
};

export default App;