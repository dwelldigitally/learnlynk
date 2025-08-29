import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminHome from '@/components/admin/AdminHome';
import { LeadManagement } from '@/components/admin/LeadManagement';
import StudentManagement from '@/components/admin/StudentManagement';
import { ConfigurationManagement } from '@/components/admin/ConfigurationManagement';
import AnalyticsReporting from '@/components/admin/AnalyticsReporting';
import { CampaignManagement } from '@/components/admin/CampaignManagement';
import CommunicationHub from '@/components/admin/CommunicationHub';
import EventManagement from '@/components/admin/EventManagement';
import { StudentPortalsDashboard } from '@/components/admin/StudentPortalsDashboard';

export function AdminRoutes() {
  return (
    <Routes>
      {/* Default admin route */}
      <Route index element={<AdminHome />} />
      <Route path="home" element={<AdminHome />} />
      
      {/* Leads & Marketing Section */}
      <Route path="leads" element={<LeadManagement />} />
      <Route path="campaigns" element={<CampaignManagement />} />
      <Route path="communication" element={<CommunicationHub />} />
      
      {/* Students & Applications Section */}
      <Route path="students" element={<StudentManagement />} />
      <Route path="applications" element={<StudentManagement />} />
      
      {/* Data Management Section */}
      <Route path="events" element={<EventManagement />} />
      <Route path="programs/*" element={<Navigate to="/admin/configuration" replace />} />
      <Route path="workflows/*" element={<Navigate to="/admin/configuration" replace />} />
      <Route path="requirements/*" element={<Navigate to="/admin/configuration" replace />} />
      
      {/* Setup & Configuration Section */}
      <Route path="setup" element={<AdminHome />} />
      <Route path="portals" element={<StudentPortalsDashboard />} />
      
      {/* System Configuration Section */}
      <Route path="configuration/*" element={<ConfigurationManagement />} />
      
      {/* Analytics & Reports Section */}
      <Route path="analytics" element={<AnalyticsReporting />} />
      <Route path="reports" element={<AnalyticsReporting />} />
      
      {/* Catch-all redirect to home */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}