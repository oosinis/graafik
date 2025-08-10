// hooks/useUserRoles.ts
import { useUser } from '@auth0/nextjs-auth0';
import { useState, useEffect } from 'react';

interface UseUserRolesReturn {
  roles: string[];
  hasRole: (role: string) => boolean;
  hasAnyRole: (roleList: string[]) => boolean;
  hasAllRoles: (roleList: string[]) => boolean;
  isLoading: boolean;
  error: string | null;
}

export const useUserRoles = (): UseUserRolesReturn => {
  const { user, isLoading: userLoading } = useUser();
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (userLoading) return;
    
    if (!user?.sub) {
      setRoles([]);
      setIsLoading(false);
      return;
    }
    
    const fetchRoles = async () => {
      try {
        setError(null);
        // Pass user ID as query parameter to our API route
        const response = await fetch(`/api/user/roles?userId=${encodeURIComponent(user.sub)}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || `HTTP ${response.status}: Failed to fetch roles`);
        }
        
        const data = await response.json();
        setRoles(data.roles || []);
      } catch (err) {
        console.error('Error fetching roles:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user roles');
        setRoles([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRoles();
  }, [user?.sub, userLoading]);
  
  const hasRole = (role: string): boolean => {
    return roles.includes(role);
  };
  
  const hasAnyRole = (roleList: string[]): boolean => {
    return roleList.some(role => roles.includes(role));
  };
  
  const hasAllRoles = (roleList: string[]): boolean => {
    return roleList.every(role => roles.includes(role));
  };
  
  return {
    roles,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isLoading: userLoading || isLoading,
    error
  };
};