import { useUser, useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';

export const useAuthState = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateAuthState = async () => {
      if (!isLoaded) return;

      if (isSignedIn && user) {
        try {
          // Get the JWT token for API calls
          const token = await getToken();
          localStorage.setItem('clerk-token', token);

          // Get user role from public metadata
          const role = user.publicMetadata?.role || 'user';
          setUserRole(role);
        } catch (error) {
          console.error('Error getting auth token:', error);
          setUserRole('user'); // Default to user role
        }
      } else {
        // User is not signed in
        localStorage.removeItem('clerk-token');
        setUserRole(null);
      }
      
      setIsLoading(false);
    };

    updateAuthState();
  }, [isSignedIn, user, isLoaded, getToken]);

  const isAdmin = userRole === 'admin';
  const isUser = userRole === 'user';
  const isGuest = !isSignedIn;

  return {
    isSignedIn,
    user,
    userRole,
    isLoading,
    isAdmin,
    isUser,
    isGuest,
    userId: user?.id
  };
}; 