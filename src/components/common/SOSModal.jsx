import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Phone,
  ShieldAlert,
  Siren,
  X,
} from "lucide-react";

import { useEmergency } from "../../context/EmergencyContext";

export default function SOSModal() {
  const {
    isSOSModalOpen,
    closeSOSModal,
    createSOS,
    activeSOS,
    isCreatingSOS,
  } = useEmergency();

  const [reason, setReason] = useState("Medical Emergency");
  const [description, setDescription] = useState("");

  if (!isSOSModalOpen) {
    return null;
  }

  const handleSOS = async () => {
    try {
      const patientName =
        localStorage.getItem("patientName") ||
        "Emergency Patient";

      const patientId =
        localStorage.getItem("patientId") ||
        "PATIENT-UNKNOWN";

      const patientPhone =
        localStorage.getItem("patientPhone") ||
        "Not Available";

      await createSOS({
        patientName,
        patientId,
        patientPhone,
        reason,
        description,
      });

      closeSOSModal();
    } catch (error) {
      console.error("Unable to create SOS:", error);

      alert(
        "Unable to activate SOS. Please try again."
      );
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black/70
        backdrop-blur-md
        p-4
      "
      onClick={closeSOSModal}
    >
      <div
        className="
          relative w-full max-w-lg
          overflow-hidden
          rounded-3xl
          border border-white/10
          bg-slate-950
          shadow-2xl
        "
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="relative overflow-hidden bg-red-600 px-6 py-7 text-white">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

          <button
            type="button"
            onClick={closeSOSModal}
            className="
              absolute right-4 top-4
              rounded-xl p-2
              text-white/80
              transition
              hover:bg-white/10
              hover:text-white
            "
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <Siren className="h-7 w-7 animate-pulse" />
            </div>

            <div>
              <h2 className="text-2xl font-black">
                Emergency SOS
              </h2>

              <p className="mt-1 text-sm text-red-100">
                Request immediate medical assistance
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">
          {/* Warning */}
          <div className="flex gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

            <div>
              <p className="text-sm font-bold text-red-300">
                Important
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-300">
                Your current location will be captured and the
                emergency request will be sent to the ResQLINK
                control room.
              </p>
            </div>
          </div>

          {/* Emergency Reason */}
          <div>
            <label className="mb-2 block text-sm font-bold text-white">
              Emergency Type
            </label>

            <select
              value={reason}
              onChange={(event) =>
                setReason(event.target.value)
              }
              className="
                w-full rounded-xl
                border border-white/10
                bg-slate-900
                px-4 py-3
                text-sm text-white
                outline-none
                focus:border-red-500
              "
            >
              <option>Medical Emergency</option>
              <option>Accident</option>
              <option>Critical Condition</option>
              <option>Ambulance Required</option>
              <option>Other Emergency</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-bold text-white">
              Additional Information
              <span className="ml-1 text-xs font-normal text-slate-500">
                Optional
              </span>
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={3}
              placeholder="Describe the emergency..."
              className="
                w-full resize-none rounded-xl
                border border-white/10
                bg-slate-900
                px-4 py-3
                text-sm text-white
                placeholder:text-slate-600
                outline-none
                focus:border-red-500
              "
            />
          </div>

          {/* What happens */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
              <MapPin className="mx-auto mb-2 h-5 w-5 text-red-400" />
              <p className="text-[11px] font-semibold text-slate-300">
                GPS Location
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
              <ShieldAlert className="mx-auto mb-2 h-5 w-5 text-orange-400" />
              <p className="text-[11px] font-semibold text-slate-300">
                Control Room
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
              <Phone className="mx-auto mb-2 h-5 w-5 text-emerald-400" />
              <p className="text-[11px] font-semibold text-slate-300">
                Assistance
              </p>
            </div>
          </div>

          {/* SOS Button */}
          <button
            type="button"
            onClick={handleSOS}
            disabled={isCreatingSOS || Boolean(activeSOS)}
            className="
              flex w-full
              items-center justify-center
              gap-3
              rounded-2xl
              bg-red-600
              px-5 py-4
              text-sm font-black
              uppercase tracking-wider
              text-white
              shadow-lg shadow-red-900/30
              transition
              hover:bg-red-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {isCreatingSOS ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Activating SOS...
              </>
            ) : activeSOS ? (
              <>
                <CheckCircle2 className="h-5 w-5" />
                SOS Already Active
              </>
            ) : (
              <>
                <Siren className="h-5 w-5" />
                Activate Emergency SOS
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-slate-500">
            Only activate SOS when emergency assistance is required.
          </p>
        </div>
      </div>
    </div>
  );
}