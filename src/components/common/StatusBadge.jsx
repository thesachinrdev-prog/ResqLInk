import React from 'react';
import { EMERGENCY_STATUS, SEVERITY_LEVELS } from '../../utils/constants';

export function StatusBadge({ status, size = 'md' }) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-semibold px-2.5 py-1',
    lg: 'text-sm font-bold px-3 py-1.5',
  };

  const getStyle = () => {
    switch (status) {
      case EMERGENCY_STATUS.PENDING:
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse';
      case EMERGENCY_STATUS.DISPATCHED:
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
      case EMERGENCY_STATUS.EN_ROUTE:
        return 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40';
      case EMERGENCY_STATUS.ON_SCENE:
        return 'bg-purple-500/20 text-purple-300 border border-purple-500/40';
      case EMERGENCY_STATUS.TRANSPORTING:
        return 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40';
      case EMERGENCY_STATUS.ARRIVED:
        return 'bg-teal-500/20 text-teal-300 border border-teal-500/40';
      case EMERGENCY_STATUS.RESOLVED:
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case EMERGENCY_STATUS.CANCELLED:
        return 'bg-slate-700/40 text-slate-400 border border-slate-700';
      case 'AVAILABLE':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case 'BUSY':
      case 'ON_CALL':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
      case 'OFFLINE':
        return 'bg-slate-700/40 text-slate-400 border border-slate-700';
      case 'IN_TRANSIT':
      case 'PROCESSING':
        return 'bg-sky-500/15 text-sky-400 border border-sky-500/30';
      case 'APPROVED':
      case 'DELIVERED':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  const formatLabel = (val) => {
    if (!val) return 'UNKNOWN';
    return val.replace(/_/g, ' ');
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full uppercase tracking-wider ${sizeClasses[size] || sizeClasses.md} ${getStyle()}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
      {formatLabel(status)}
    </span>
  );
}

export function SeverityBadge({ severity }) {
  const getStyle = () => {
    switch (severity) {
      case SEVERITY_LEVELS.CRITICAL:
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case SEVERITY_LEVELS.HIGH:
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case SEVERITY_LEVELS.MEDIUM:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case SEVERITY_LEVELS.LOW:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${getStyle()}`}
    >
      {severity || 'NORMAL'}
    </span>
  );
}
