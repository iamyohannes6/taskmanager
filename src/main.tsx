import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isProgressVisible: boolean;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive: boolean) => void;
          hideProgress: () => void;
          setParams: (params: {
            text?: string;
            color?: string;
            text_color?: string;
            is_active?: boolean;
            is_visible?: boolean;
          }) => void;
        };
        BackButton: {
          isVisible: boolean;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
        };
        onEvent: (eventType: string, callback: () => void) => void;
        offEvent: (eventType: string, callback: () => void) => void;
        sendData: (data: any) => void;
        close: () => void;
      };
    };
  }
}

// Initialize Telegram WebApp
window.Telegram.WebApp.ready();

// Set up MainButton
window.Telegram.WebApp.MainButton.setParams({
  text: 'New Task',
  color: '#3b82f6',
  text_color: '#ffffff',
  is_visible: true,
  is_active: true,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
) 