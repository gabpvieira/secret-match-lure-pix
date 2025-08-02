import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Rola para o topo da página sempre que a rota mudar
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Scroll instantâneo para melhor UX
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;