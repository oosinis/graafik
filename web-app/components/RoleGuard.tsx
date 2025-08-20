'use client';

// Auth0 temporarily disabled; stub implementation
const useUser = () => ({ user: null as any, isLoading: false });
import { useUserRoles } from '@/hooks/useUserRoles';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function RoleGuard({ 
  allowedRoles, 
  children, 
  fallback,
  redirectTo = '/unauthorized'
}: RoleGuardProps) {
  const { user, isLoading: userLoading } = useUser();
  const { hasAnyRole, isLoading: rolesLoading, error } = useUserRoles();
  const router = useRouter();

  const isLoading = userLoading || rolesLoading;
  const hasAccess = hasAnyRole(allowedRoles);

  useEffect(() => {
    // If not loading and user doesn't have access, redirect
    if (!isLoading && user && !hasAccess && !error) {
      router.push(redirectTo);
    }
  }, [isLoading, user, hasAccess, error, router, redirectTo]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600">Unable to verify permissions: {error}</p>
        </div>
      </div>
    );
  }

  // If no user, don't render anything (middleware should handle this)
  if (!user) {
    return null;
  }

  // If user doesn't have required roles
  if (!hasAccess) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to view this page.</p>
          <p className="text-sm text-gray-500 mt-2">
            Required roles: {allowedRoles.join(', ')}
          </p>
        </div>
      </div>
    );
  }

  // User has access, render the page
  return <>{children}</>;
}