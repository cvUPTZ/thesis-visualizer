// File: src/App.tsx
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/contexts/AuthContext';
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import LandingPage from '@/pages/LandingPage';
import AdminPanel from '@/pages/AdminPanel';
import CreateThesis from '@/pages/CreateThesis';
import { ThesisEditor } from '@/components/ThesisEditor';
import { Skeleton } from '@/components/ui/skeleton';
import withAuthorization from '@/components/ProtectedRoute';
import { AuthLoader } from '@/components/auth/AuthLoader';

const App = () => {
    const { loading, isAuthenticated } = useAuth();

    // Show loading state only during initial auth check
    if (loading) {
        return <AuthLoader />;
    }

    const ProtectedRoute = withAuthorization(({ children }) => <>{children}</>);
    const AdminRoute = withAuthorization(({ children }) => <>{children}</>);

    return (
        <div className="min-h-screen bg-background">
            <Suspense fallback={<AuthLoader />}>
                <main>
                    <Toaster />
                    <Routes>
                        {/* Public routes */}
                        <Route path="/welcome" element={<LandingPage />} />
                        <Route path="/auth" element={<Auth />} />
                        
                        {/* Protected routes */}
                        <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                        <Route
                            path="/thesis/:thesisId"
                            element={
                                <ProtectedRoute>
                                    <ThesisEditor />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/create-thesis"
                            element={
                                <ProtectedRoute>
                                    <CreateThesis />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/*"
                            element={
                                <AdminRoute requiredRole="admin">
                                    <AdminPanel />
                                </AdminRoute>
                            }
                        />
                    </Routes>
                </main>
            </Suspense>
        </div>
    );
};

export default App;