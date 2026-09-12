import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  navigate: () => {},
});

export const useRouter = () => useContext(RouterContext);

export const RouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Normalize path from window.location.pathname
  const getInitialPath = () => {
    if (typeof window === 'undefined') return '/';
    // If hash routing is present e.g. #/shop, support it, otherwise use pathname
    if (window.location.hash.startsWith('#/')) {
      return window.location.hash.slice(1);
    }
    return window.location.pathname || '/';
  };

  const [path, setPath] = useState<string>(getInitialPath());

  useEffect(() => {
    const handlePopState = () => {
      const current = window.location.hash.startsWith('#/')
        ? window.location.hash.slice(1)
        : window.location.pathname;
      setPath(current || '/');
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    if (to === path) return;
    try {
      window.history.pushState({}, '', to);
    } catch {
      // In restricted iframe environments where pushState might fail, fallback to hash
      window.location.hash = '#' + to;
    }
    setPath(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const Link: React.FC<{
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  id?: string;
}> = ({ to, children, className = '', onClick, id }) => {
  const { navigate } = useRouter();

  return (
    <a
      id={id}
      href={to}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
};
