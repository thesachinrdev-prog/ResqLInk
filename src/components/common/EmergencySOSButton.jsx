import React from "react";
import { AlertTriangle, Siren } from "lucide-react";
import { useEmergency } from "../../context/EmergencyContext";

export default function EmergencySOSButton() {
  const { openSOSModal, hasActiveSOS } = useEmergency();

  return (
    <button
      type="button"
      onClick={openSOSModal}
      className={`
        group relative flex items-center gap-3
        rounded-2xl px-6 py-4
        font-bold text-white
        shadow-lg transition-all duration-300
        ${
          hasActiveSOS
            ? "bg-red-800 ring-4 ring-red-300/40"
            : "bg-red-600 hover:bg-red-700 hover:scale-[1.02]"
        }
      `}
    >
      <span
        className="
          absolute -inset-1
          rounded-2xl
          bg-red-500/20
          blur-xl
          opacity-0
          transition
          group-hover:opacity-100
        "
      />

      <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
        {hasActiveSOS ? (
          <Siren className="h-6 w-6 animate-pulse" />
        ) : (
          <AlertTriangle className="h-6 w-6" />
        )}
      </span>

      <span className="relative flex flex-col items-start">
        <span className="text-sm font-black uppercase tracking-wider">
          {hasActiveSOS ? "SOS Active" : "Emergency SOS"}
        </span>

        <span className="text-xs font-medium text-red-100">
          {hasActiveSOS
            ? "Control room notified"
            : "Get immediate assistance"}
        </span>
      </span>
    </button>
  );
}