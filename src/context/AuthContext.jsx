import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  ROLES,
  DEMO_USERS,
  ROLE_CONFIG,
} from '../utils/constants';

const AuthContext = createContext(null);

const STORAGE_KEY = 'resqlink_auth_session';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn(
        'Failed to restore ResQLink session:',
        error
      );
    }

    // No automatic login.
    // User must explicitly login/demo login.
    return null;
  });

  const [role, setRole] = useState(
    currentUser?.role || null
  );

  useEffect(() => {
    if (currentUser) {
      setRole(currentUser.role);

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(currentUser)
        );
      } catch (error) {
        console.warn(
          'Failed to save ResQLink session:',
          error
        );
      }
    } else {
      setRole(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser]);

  const getDashboardPath = (targetRole = role) => {
    return (
      ROLE_CONFIG[targetRole]?.path ||
      '/login'
    );
  };

  const login = async (
    email,
    password,
    selectedRole
  ) => {
    const normalizedEmail =
      email?.trim().toLowerCase();

    const matchedUser = DEMO_USERS.find(
      (user) =>
        user.email.toLowerCase() === normalizedEmail &&
        user.role === selectedRole &&
        user.password === password
    );

    if (!matchedUser) {
      return {
        success: false,
        error:
          'Invalid email, password, or selected role.',
      };
    }

    setCurrentUser(matchedUser);
    setRole(matchedUser.role);

    return {
      success: true,
      user: matchedUser,
      redirectPath: getDashboardPath(
        matchedUser.role
      ),
    };
  };

  const loginAsDemo = async (roleKey) => {
    const demoUser = DEMO_USERS.find(
      (user) => user.role === roleKey
    );

    if (!demoUser) {
      return {
        success: false,
        error: 'Demo account not found.',
      };
    }

    setCurrentUser(demoUser);
    setRole(demoUser.role);

    return {
      success: true,
      user: demoUser,
      redirectPath: getDashboardPath(
        demoUser.role
      ),
    };
  };

  const logout = () => {
    setCurrentUser(null);
    setRole(null);

    localStorage.removeItem(STORAGE_KEY);
  };

  const switchRole = (newRole) => {
    const matchedUser = DEMO_USERS.find(
      (user) => user.role === newRole
    );

    if (!matchedUser) {
      return '/login';
    }

    setCurrentUser(matchedUser);
    setRole(matchedUser.role);

    return getDashboardPath(matchedUser.role);
  };

  const value = {
    currentUser,
    role,

    isAuthenticated: Boolean(currentUser),

    login,
    loginAsDemo,
    logout,
    switchRole,

    getDashboardPath,

    roles: ROLES,
    roleConfig: ROLE_CONFIG,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
}