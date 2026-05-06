import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import SplashPage from './pages/SplashPage.jsx';
import IntakeFlow from './pages/IntakeFlow.jsx';
import BriefPage from './pages/BriefPage.jsx';
import DemoList from './pages/DemoList.jsx';
import MobileNotice from './pages/MobileNotice.jsx';

const AppShell = ({ children }) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (isMobile) return <MobileNotice />;
  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/start" element={<AppShell><IntakeFlow /></AppShell>} />
      <Route path="/brief/:caseId" element={<AppShell><BriefPage /></AppShell>} />
      {/* Demo routes skip AppShell's mobile gate — shareable for non-technical readers. */}
      <Route path="/demo" element={<DemoList />} />
      <Route path="/demo/:demoId" element={<BriefPage isDemo />} />
      <Route path="/mobile-notice" element={<MobileNotice />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
