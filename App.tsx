
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LayoutShell from './components/layout/LayoutShell';
import ErrorBoundary from './components/ErrorBoundary';
import { UserRole } from './types';

const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./features/auth/Login'));
const Register = lazy(() => import('./features/auth/Register'));
const HospitalDashboard = lazy(() => import('./pages/HospitalDashboard'));
const SOSDetail = lazy(() => import('./pages/SOSDetail'));
const BloodBankDashboard = lazy(() => import('./pages/BloodBankDashboard'));
const DonorDashboard = lazy(() => import('./pages/DonorDashboard'));
const PatientDashboard = lazy(() => import('./pages/PatientDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const BrandAssets = lazy(() => import('./pages/BrandAssets'));

const AboutUs = lazy(() => import('./pages/legal/AboutUs'));
const Vision = lazy(() => import('./pages/legal/Vision'));
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/legal/TermsOfService'));
const AuditCharter = lazy(() => import('./pages/legal/AuditCharter'));
const Compliance = lazy(() => import('./pages/legal/Compliance'));
const Contact = lazy(() => import('./pages/legal/Contact'));

const LoadingFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
    <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mb-6"></div>
    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Establishing Secure Network Connection</p>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <HashRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/brand" element={<BrandAssets />} />

              {/* Legal/Institutional Content */}
              <Route path="/about" element={<AboutUs />} />
              <Route path="/vision" element={<Vision />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/audit-charter" element={<AuditCharter />} />
              <Route path="/compliance" element={<Compliance />} />
              <Route path="/contact" element={<Contact />} />

              {/* Authenticated Routes with Layout Packaging */}
              <Route element={<ProtectedRoute allowedRoles={Object.values(UserRole)} />}>
                <Route element={<LayoutShell />}>
                  {/* Shared SOS Details - Access restricted by logic inside component */}
                  <Route path="/sos/:id" element={<SOSDetail />} />

                  {/* Hospital Terminal: Strict Isolation */}
                  <Route element={<ProtectedRoute allowedRoles={[UserRole.HOSPITAL]} />}>
                    <Route path="/hospital" element={<HospitalDashboard />} />
                    <Route path="/hospital/request" element={<HospitalDashboard />} />
                    <Route path="/hospital/sos" element={<HospitalDashboard />} />
                    <Route path="/hospital/patients" element={<HospitalDashboard />} />
                  </Route>

                  {/* Admin Governance: Strict Isolation */}
                  <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/orgs" element={<AdminDashboard />} />
                    <Route path="/admin/donors" element={<AdminDashboard />} />
                    <Route path="/admin/sos" element={<AdminDashboard />} />
                    <Route path="/admin/audit" element={<AdminDashboard />} />
                    <Route path="/admin/health" element={<AdminDashboard />} />
                    <Route path="/admin/override" element={<AdminDashboard />} />
                  </Route>

                  {/* Blood Bank Logistics: Strict Isolation */}
                  <Route element={<ProtectedRoute allowedRoles={[UserRole.BLOOD_BANK]} />}>
                    <Route path="/bloodbank" element={<BloodBankDashboard />} />
                    <Route path="/bloodbank/sos" element={<BloodBankDashboard />} />
                    <Route path="/bloodbank/inventory" element={<BloodBankDashboard />} />
                    <Route path="/bloodbank/donors" element={<BloodBankDashboard />} />
                    <Route path="/bloodbank/dispatch" element={<BloodBankDashboard />} />
                  </Route>

                  {/* Donor & Patient Terminals: Strict Isolation */}
                  <Route element={<ProtectedRoute allowedRoles={[UserRole.DONOR]} />}>
                    <Route path="/donor" element={<DonorDashboard />} />
                    <Route path="/donor/requests" element={<DonorDashboard />} />
                    <Route path="/donor/history" element={<DonorDashboard />} />
                    <Route path="/donor/profile" element={<DonorDashboard />} />
                  </Route>

                  <Route element={<ProtectedRoute allowedRoles={[UserRole.PATIENT]} />}>
                    <Route path="/patient" element={<PatientDashboard />} />
                  </Route>
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </HashRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
