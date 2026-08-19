import React, { useState } from 'react';
import {
  Pill,
  Building2,
  Ambulance,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Minus,
  ArrowRight,
  ShieldAlert,
  Send,
  Package,
  Activity,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { StatusBadge } from '../../components/common/StatusBadge';

export function PharmacyDashboard() {
  const { currentUser } = useAuth();
  const {
    pharmacyInventory,
    pharmacyOrders,
    updatePharmacyStock,
    addNotification,
  } = useEmergency();

  const [newDrugModalOpen, setNewDrugModalOpen] = useState(false);

  const totalMedicines = pharmacyInventory.reduce((acc, curr) => acc + curr.stock, 0);
  const lowStockItems = pharmacyInventory.filter((p) => p.status === 'LOW_STOCK');

  const handleStockAdjust = async (id, delta) => {
    await updatePharmacyStock(id, delta);
  };

  const handleFulfillOrder = (orderId) => {
    addNotification(
      'info',
      'Pharmacy Order Fulfilled',
      `Order ${orderId} packed and dispatched via emergency medical courier.`
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        {/* Pharmacy Header */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Pill className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Apollo 24/7 Emergency Pharmacy</h2>
                <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                  CRITICAL DRUG VAULT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Head Pharmacist: <strong className="text-slate-200">{currentUser?.name}</strong> • Lake View Road, Madurai
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                pharmacyInventory.forEach((p) => updatePharmacyStock(p.id, 10));
                addNotification('info', 'Inventory Restocked', 'All emergency medications replenished by +10 units.');
              }}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30 flex items-center gap-1.5 transition-all"
            >
              <Package className="h-4 w-4" />
              <span>Bulk Restock All (+10)</span>
            </button>
          </div>
        </div>

        {/* Pharmacy Key Metrics (Section 18) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Units in Stock</span>
            <p className="text-3xl font-black text-white">{totalMedicines}</p>
            <p className="text-[11px] text-teal-400 font-semibold">24/7 Controlled Storage</p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Adrenaline (Epi)</span>
            <p className="text-3xl font-black text-teal-400">
              {pharmacyInventory.find((p) => p.name.includes('Adrenaline'))?.stock || 48} Units
            </p>
            <p className="text-[11px] text-emerald-400 font-semibold">OPTIMAL STOCK</p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Oxygen Cylinders</span>
            <p className="text-3xl font-black text-sky-400">
              {pharmacyInventory.find((p) => p.name.includes('Oxygen'))?.stock || 12} Cylinders
            </p>
            <p className="text-[11px] text-sky-400 font-semibold">READY FOR DISPATCH</p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Orders</span>
            <p className="text-3xl font-black text-amber-400">{pharmacyOrders.length}</p>
            <p className="text-[11px] text-amber-400 font-semibold">Hospital & Paramedic Req</p>
          </div>
        </div>

        {/* Critical Medicine Inventory Grid */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-black text-white">Emergency Medication Stock Inventory</h3>
              <p className="text-xs text-slate-400">Critical ICU, Cardiac, Trauma & Toxicology drugs</p>
            </div>
            <span className="text-xs font-bold text-teal-400">{pharmacyInventory.length} Monitored Formulations</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pharmacyInventory.map((item) => {
              const isLow = item.status === 'LOW_STOCK';

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    isLow
                      ? 'bg-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-950/30'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {item.category}
                      </span>
                      <h4 className="font-bold text-white text-sm mt-0.5">{item.name}</h4>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isLow
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      }`}
                    >
                      {item.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <p className="text-2xl font-black text-white">
                      {item.stock} <span className="text-xs font-normal text-slate-400">{item.unit}</span>
                    </p>
                    <span className="text-[10px] text-slate-500">Min Alert: {item.criticalThreshold}</span>
                  </div>

                  {/* Stock Adjuster */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => handleStockAdjust(item.id, -1)}
                      disabled={item.stock <= 0}
                      className="flex-1 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 flex items-center justify-center disabled:opacity-30"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleStockAdjust(item.id, 1)}
                      className="flex-1 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow flex items-center justify-center"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Emergency Orders from Hospitals & Ambulances */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="h-4 w-4 text-teal-400" />
              Incoming Emergency Medication Orders
            </h3>
            <span className="text-xs text-slate-400">{pharmacyOrders.length} Active Orders</span>
          </div>

          <div className="space-y-3">
            {pharmacyOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{ord.hospitalName}</span>
                    <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                      {ord.urgency}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">#{ord.id}</span>
                  </div>
                  <p className="text-slate-300 font-medium">
                    Items:{' '}
                    {ord.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                  </p>
                  <p className="text-[11px] text-slate-400">Ordered by {ord.orderedBy}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleFulfillOrder(ord.id)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30 flex items-center gap-1.5 transition-all"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Fulfill & Send</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
