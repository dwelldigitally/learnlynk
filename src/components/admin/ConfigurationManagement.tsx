import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigurationSidebar } from './ConfigurationSidebar';

export const ConfigurationManagement = () => {
  return (
    <div className="flex h-full">
      <ConfigurationSidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/configuration/setup" replace />} />
        </Routes>
      </div>
    </div>
  );
};