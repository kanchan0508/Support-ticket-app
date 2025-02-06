import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (currentUser) {
      // Set role based on email
      if (currentUser.email === 'agent@support.com') {
        setUserRole('agent');
      } else if (currentUser.email === 'customer@support.com') {
        setUserRole('customer');
      }
    } else {
      setUserRole(null);
    }
  }, [currentUser]);

  const isAgent = userRole === 'agent';
  const isCustomer = userRole === 'customer';

  return (
    <UserContext.Provider value={{ userRole, isAgent, isCustomer }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;