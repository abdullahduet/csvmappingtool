import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { store } from './redux/store';

// Layouts
import MainLayout from './layouts/MainLayout';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';

import LoadingScreen from './components/common/LoadingScreen';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const MapperPage = lazy(() => import('./pages/MapperPage'));
const ConverterPage = lazy(() => import('./pages/ConverterPage'));
const GeneratorPage = lazy(() => import('./pages/GeneratorPage'));
const AdvancedCSVEditorPage = lazy(() => import('./pages/AdvancedCSVEditorPage'));
const ValidatorPage = lazy(() => import('./pages/ValidatorPage'));
const VisualizerPage = lazy(() => import('./pages/VisualizerPage'));
const Login = lazy(() => import('./pages/Login'));
const FeaturePage = lazy(() => import('./pages/FeaturePage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));


function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={
                <MainLayout>
                  <Home />
                </MainLayout>
              } />

              <Route path="/csv/map" element={
                <MainLayout>
                  <MapperPage />
                </MainLayout>
              } />

              <Route path="/csv/convert" element={
                <MainLayout>
                  <ConverterPage />
                </MainLayout>
              } />

              <Route path="/csv/generate" element={
                <MainLayout>
                  <GeneratorPage />
                </MainLayout>
              } />

              <Route path="/csv/advanced-generate" element={
                <MainLayout>
                  <AdvancedCSVEditorPage />
                </MainLayout>
              } />

              <Route path="/csv/validate" element={
                <MainLayout>
                  <ValidatorPage />
                </MainLayout>
              } />

              <Route path="/csv/visualize" element={
                <MainLayout>
                  <VisualizerPage />
                </MainLayout>
              } />

              <Route path="/login" element={
                <MainLayout>
                  <Login />
                </MainLayout>
              } />

              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/features/:featureId" element={
                <MainLayout>
                  <FeaturePage />
                </MainLayout>
              } />

              <Route path="/privacy-policy" element={
                <MainLayout>
                  <PrivacyPolicy />
                </MainLayout>
              } />

              <Route path="/terms-of-service" element={
                <MainLayout>
                  <TermsOfService />
                </MainLayout>
              } />

              <Route path="*" element={
                <MainLayout>
                  <NotFound />
                </MainLayout>
              } />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  );
}

export default App;