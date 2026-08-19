import React from 'react';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  Info,
  X,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmergency } from '../../context/EmergencyContext';

export default function NotificationCenterPage() {
  const navigate = useNavigate();

  const {
    recentNotifications = [],
    soundEnabled,
    setSoundEnabled,
  } = useEmergency();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#070a0f] text-slate-100">
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-red-400" />
                <h1 className="text-lg font-bold text-white">
                  Notification Center
                </h1>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Emergency alerts, dispatch updates and system notifications
              </p>
            </div>
          </div>

          {/* Sound */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-xs text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
          >
            Sound: {soundEnabled ? 'On' : 'Off'}
          </button>
        </div>

        {/* Notifications */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">

          <div className="border-b border-white/[0.06] px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Recent Notifications
            </p>
          </div>

          {recentNotifications.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04]">
                <Bell className="h-6 w-6 text-slate-600" />
              </div>

              <h2 className="text-sm font-semibold text-slate-300">
                No notifications
              </h2>

              <p className="mt-1 text-xs text-slate-600">
                You're all caught up.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.05]">
              {recentNotifications.map((notification, index) => (
                <div
                  key={notification.id || index}
                  className={`group flex gap-4 px-5 py-4 transition hover:bg-white/[0.025] ${
                    !notification.read
                      ? 'bg-red-500/[0.025]'
                      : ''
                  }`}
                >
                  {/* Icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/[0.08]">
                    {notification.type === 'emergency' ? (
                      <ShieldAlert className="h-5 w-5 text-red-400" />
                    ) : notification.type === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    ) : notification.type === 'warning' ? (
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                    ) : (
                      <Info className="h-5 w-5 text-blue-400" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold text-slate-200">
                        {notification.title ||
                          notification.message ||
                          'Notification'}
                      </h3>

                      {!notification.read && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                      )}
                    </div>

                    {notification.message &&
                      notification.title && (
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {notification.message}
                        </p>
                      )}

                    {notification.timestamp && (
                      <p className="mt-2 text-[10px] text-slate-700">
                        {notification.timestamp}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}