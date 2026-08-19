import React from 'react';
import {
  User,
  Ambulance,
  Radio,
  Building2,
  Droplet,
  Pill,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';

export function QuickRoleSwitcher() {
  const { role, loginAsDemo } = useAuth();

  const roleItems = [
    { role: ROLES.PATIENT, label: 'Patient / SOS', icon: User, color: 'text-red-400 hover:border-red-500' },
    { role: ROLES.DRIVER, label: 'Ambulance Driver', icon: Ambulance, color: 'text-sky-400 hover:border-sky-500' },
    { role: ROLES.CONTROL_ROOM, label: 'Control Room (911)', icon: Radio, color: 'text-amber-400 hover:border-amber-500' },
    { role: ROLES.HOSPITAL, label: 'Hospital ER', icon: Building2, color: 'text-emerald-400 hover:border-emerald-500' },
    { role: ROLES.BLOOD_BANK, label: 'Blood Bank', icon: Droplet, color: 'text-rose-400 hover:border-rose-500' },
    { role: ROLES.PHARMACY, label: '24/7 Pharmacy', icon: Pill, color: 'text-teal-400 hover:border-teal-500' },
    { role: ROLES.ADMIN, label: 'System Admin', icon: Shield, color: 'text-purple-400 hover:border-purple-500' },
  ];

  return (
    <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap shrink-0">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Role Viewport:</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {roleItems.map((item) => {
            const Icon = item.icon;
            const isActive = role === item.role;
            return (
              <button
                key={item.role}
                onClick={() => loginAsDemo(item.role)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 border-white/40 text-white shadow-md ring-1 ring-white/20'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 ' + item.color
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
