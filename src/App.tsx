import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { NavigationHeader } from './components/NavigationHeader';
import { DriverAppContainer } from './components/driver/DriverAppContainer';
import { GateAppContainer } from './components/gate/GateAppContainer';
import { ManagementAppContainer } from './components/management/ManagementAppContainer';
import { WhatsAppContainer } from './components/whatsapp/WhatsAppContainer';

const MainAppRouter: React.FC = () => {
  const { activeApp } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <NavigationHeader />

      <div className="flex-1">
        {activeApp === 'driver' && <DriverAppContainer />}
        {activeApp === 'gate' && <GateAppContainer />}
        {activeApp === 'management' && <ManagementAppContainer />}
        {activeApp === 'whatsapp' && <WhatsAppContainer />}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppRouter />
    </AppProvider>
  );
}
