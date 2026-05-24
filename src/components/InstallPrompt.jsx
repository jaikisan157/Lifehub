import React, { useState, useEffect } from 'react';

// Captures the browser's beforeinstallprompt event and shows a beautiful custom install banner
export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
      return;
    }

    // Check if user previously dismissed
    const wasDismissed = sessionStorage.getItem('lifehub-install-dismissed');
    if (wasDismissed) {
      setDismissed(true);
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!wasDismissed) {
        // Small delay so user sees the app first
        setTimeout(() => setShowBanner(true), 2000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setShowBanner(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    sessionStorage.setItem('lifehub-install-dismissed', 'true');
  };

  // Floating install button (always visible if prompt is available but banner was dismissed)
  const showFloatingBtn = dismissed && deferredPrompt && !isInstalled;

  if (isInstalled) return null;

  return (
    <>
      {/* Full Install Banner */}
      {showBanner && (
        <div className="install-banner" id="install-banner">
          <div className="install-banner-content">
            <div className="install-banner-icon">📲</div>
            <div className="install-banner-text">
              <div className="install-banner-title">Install LifeHub</div>
              <div className="install-banner-sub">Add to your home screen for the best experience</div>
            </div>
            <div className="install-banner-actions">
              <button className="btn btn-primary btn-sm" onClick={handleInstall} id="install-btn">
                Install
              </button>
              <button className="btn btn-soft btn-sm" onClick={handleDismiss} id="install-dismiss">
                Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Small floating install button if banner was dismissed */}
      {showFloatingBtn && (
        <button
          className="install-float-btn"
          onClick={handleInstall}
          id="install-float-btn"
          title="Install LifeHub"
        >
          📲
        </button>
      )}
    </>
  );
}
