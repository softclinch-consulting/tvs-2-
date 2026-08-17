import React from 'react';
import { useApp, AppMode } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Smartphone,
  ScanLine,
  LayoutDashboard,
  MessageSquare,
  RotateCcw,
  AlertTriangle,
  Truck,
  ShieldCheck,
  ChevronRight,
  Factory,
  Building2,
  Users,
  Database
} from 'lucide-react';

export const NavigationHeader: React.FC = () => {
  const {
    activeApp,
    setActiveApp,
    currentRole,
    setCurrentRole,
    currentScenarioStep,
    runGuidedScenarioStep,
    resetDemoData,
    selectedJobCard,
    selectedOrder
  } = useApp();

  const appTabs: { id: AppMode; label: string; icon: React.ReactNode; screens: string; badge?: string }[] = [
    {
      id: 'driver',
      label: 'Flutter Mobile App',
      icon: <Smartphone className="w-4 h-4" />,
      screens: 'Sales / Driver / Customer',
      badge: 'Flutter UI'
    },
    {
      id: 'gate',
      label: 'Gate Receiving Unit',
      icon: <ScanLine className="w-4 h-4" />,
      screens: '14 Screens',
      badge: 'Gate Scanner'
    },
    {
      id: 'management',
      label: 'TVS TREAD Web Portal',
      icon: <LayoutDashboard className="w-4 h-4" />,
      screens: '25 Screens • SAP B1',
      badge: 'Web Suite'
    },
    {
      id: 'whatsapp',
      label: 'Inaiwazhi WhatsApp',
      icon: <MessageSquare className="w-4 h-4" />,
      screens: 'SMS & OTP Flow',
      badge: 'Live OTP'
    }
  ];

  const roleOptions: { id: UserRole; label: string; module: string }[] = [
    { id: 'ADMIN', label: 'Admin', module: 'Web Full Control' },
    { id: 'SALES_EMPLOYEE', label: 'Sales Exec', module: 'Mobile Orders' },
    { id: 'INSPECTION_TEAM', label: 'Inspection', module: 'Fitness & QC' },
    { id: 'PRODUCTION_TEAM', label: 'Production', module: '7 Stages' },
    { id: 'ACCOUNTS', label: 'Accounts', module: 'Payments & SAP' },
    { id: 'CUSTOMER', label: 'Customer', module: 'Status & Complaints' }
  ];

  const scenarioSteps = [
    { step: 1, label: '1. Order Placed', desc: 'TVS-CHN-000124' },
    { step: 2, label: '2. 20 Tyres Tagged', desc: 'Serials + MC Color' },
    { step: 3, label: '3. Inaiwazhi OTP', desc: 'OTP 849201' },
    { step: 4, label: '4. In Transit', desc: 'Truck TN38 AB 1234' },
    { step: 5, label: '5. Gate Physical Scan', desc: 'Unloading Bay 2' },
    { step: 6, label: '6. Mismatch 20 vs 18', desc: 'MIS-0045', critical: true },
    { step: 7, label: '7. Investigation & CMP', desc: 'CCTV & Complaints' },
    { step: 8, label: '8. 7-Stage Production', desc: 'Buffing -> PDI' },
    { step: 9, label: '9. QC & SAP Sync', desc: 'SAP B1 Middleware' }
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-lg sticky top-0 z-50">
      {/* Top Application Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20 border border-blue-400/30">
            <Factory className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold tracking-tight text-slate-100 text-sm sm:text-base">
                TVS TREAD
              </span>
              <span className="text-[11px] text-blue-300 font-medium hidden sm:inline">
                Sundaram Industries Pvt Ltd
              </span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded border border-indigo-500/30 uppercase">
                SoftClinch System
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
                SAP B1 Middleware Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              FastAPI / Django REST API • Flutter Mobile Apps • React Enterprise Web Suite
            </p>
          </div>
        </div>

        {/* Role Selector & Navigation Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Active Role Selector */}
          <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800 text-xs">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400 text-[11px] mr-1 hidden sm:inline">Role:</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="bg-slate-800 text-slate-200 text-xs rounded px-2 py-0.5 font-medium border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {roleOptions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label} ({r.module})
                </option>
              ))}
            </select>
          </div>

          {/* Module Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 overflow-x-auto max-w-full">
            {appTabs.map((tab) => {
              const isActive = activeApp === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveApp(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-normal ${
                      isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {tab.badge || tab.screens}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={resetDemoData}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
            title="Reset dataset to initial state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Interactive Guided Scenario Bar */}
      <div className="bg-slate-950/90 border-t border-slate-800/80 px-4 py-1.5 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-slate-300 min-w-[980px]">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] shrink-0 flex items-center gap-1 mr-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            TVS Flow:
          </span>

          <div className="flex items-center gap-1 flex-1">
            {scenarioSteps.map((s, idx) => {
              const isSelected = currentScenarioStep === s.step;
              return (
                <React.Fragment key={s.step}>
                  <button
                    onClick={() => runGuidedScenarioStep(s.step)}
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium transition ${
                      isSelected
                        ? s.critical
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/20 ring-1 ring-amber-400'
                          : 'bg-blue-500 text-white font-bold ring-1 ring-blue-400'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    {s.critical && <AlertTriangle className="w-3 h-3 text-amber-950" />}
                    <span>{s.label}</span>
                  </button>
                  {idx < scenarioSteps.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="shrink-0 text-[11px] bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-slate-300 flex items-center gap-2">
            <span className="text-slate-500">Active Order:</span>
            <span className="font-bold text-blue-400">{selectedOrder?.orderNo || 'TVS-CHN-000124'}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">
              Pick: <strong className="text-slate-200">{selectedJobCard?.pickupQty || 20}</strong> | Rec:{' '}
              <strong className="text-emerald-400">{selectedJobCard?.receivedQty || 18}</strong> | Miss:{' '}
              <strong className="text-red-400">{selectedJobCard?.missingQty || 2}</strong>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
