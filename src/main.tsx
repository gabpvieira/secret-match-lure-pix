import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 📱 Filtro Mobile-Only - Redireciona desktop para Tinder oficial
(function() {
  'use strict';
  
  // Múltiplas camadas de detecção
  const ua = (navigator.userAgent || navigator.vendor || (window as any).opera || '').toLowerCase();
  const platform = navigator.platform || '';
  
  // Detecção por User Agent
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua);
  
  // Detecção por capacidades touch
  const hasTouch = (
    'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 || 
    (navigator as any).msMaxTouchPoints > 0
  );
  
  // Detecção por dimensões de tela
  const screenWidth = window.screen?.width || window.innerWidth || 0;
  const screenHeight = window.screen?.height || window.innerHeight || 0;
  const isLargeScreen = screenWidth > 1024 || screenHeight > 768;
  
  // Detecção por plataforma
  const isDesktopPlatform = /win|mac|linux/i.test(platform) && !/arm|mobile/i.test(platform);
  
  // Lógica de decisão: É DESKTOP se...
  const isDesktop = (
    (!isMobileUA && isLargeScreen && !hasTouch) || // Sem indicadores mobile
    (isDesktopPlatform && isLargeScreen && !hasTouch) || // Plataforma desktop explícita
    (screenWidth >= 1440 && !hasTouch) // Tela muito grande sem touch
  );
  
  // Redirecionamento imediato
  if (isDesktop) {
    try {
      window.location.replace('https://tinder.com/pt');
    } catch (e) {
      window.location.href = 'https://tinder.com/pt';
    }
  }
})();

createRoot(document.getElementById("root")!).render(<App />);
