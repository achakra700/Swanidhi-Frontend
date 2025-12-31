
import React, { useState, useMemo } from 'react';
import { useBloodInventory } from '../../hooks/useInventory';
import { BloodInventory } from '../../types';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import { TableSkeleton } from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';

interface InventoryTableProps {
  onEdit: (item: BloodInventory) => void;
  onDelete: (item: BloodInventory) => void;
  onAddNew?: () => void;
}

type SortConfig = {
  key: keyof BloodInventory;
  direction: 'asc' | 'desc';
} | null;

const InventoryTable: React.FC<InventoryTableProps> = ({ onEdit, onDelete, onAddNew }) => {
  const { data: inventory, isLoading } = useBloodInventory();
  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'type', direction: 'asc' });

  const handleSort = (key: keyof BloodInventory) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const processedData = useMemo(() => {
    if (!inventory) return [];

    let result = [...inventory];

    // Tactical Filter
    if (filter) {
      result = result.filter(item => 
        item.type.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Advanced Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortConfig.direction === 'asc' 
            ? valA.localeCompare(valB) 
            : valB.localeCompare(valA);
        }
        
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        }
        
        return 0;
      });
    }

    return result;
  }, [inventory, filter, sortConfig]);

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="space-y-8">
      {/* Control Strip */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <input
              type="text"
              placeholder="Search Blood Group (e.g. O-)"
              className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 px-14 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-950 transition-all uppercase placeholder:normal-case placeholder:text-slate-400"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-950 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {onAddNew && (
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={onAddNew} 
              className="rounded-2xl h-14 px-8"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Add Entry
            </Button>
          )}
        </div>
        <div className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
            <span>{processedData.filter(i => i.units >= 10).length} Stable Nodes</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-red-50 border border-red-100 rounded-xl">
            <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></span>
            <span className="text-red-700">{processedData.filter(i => i.units < 10).length} Critical Deficit</span>
          </div>
        </div>
      </div>

      {/* Grid Terminal */}
      <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-white">
                <th 
                  className="px-12 py-8 text-[11px] font-extrabold uppercase tracking-[0.45em] cursor-pointer hover:bg-black transition-colors duration-300"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center gap-4">
                    Signal Type
                    {sortConfig?.key === 'type' && (
                      <svg className={`w-3 h-3 transition-transform duration-500 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  className="px-12 py-8 text-[11px] font-extrabold uppercase tracking-[0.45em] cursor-pointer hover:bg-black transition-colors duration-300"
                  onClick={() => handleSort('units')}
                >
                  <div className="flex items-center gap-4">
                    Available Inventory
                    {sortConfig?.key === 'units' && (
                      <svg className={`w-3 h-3 transition-transform duration-500 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-12 py-8 text-[11px] font-extrabold uppercase tracking-[0.45em]">Logistics Status</th>
                <th className="px-12 py-8 text-[11px] font-extrabold uppercase tracking-[0.45em] text-right">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedData.length > 0 ? (
                processedData.map((item) => {
                  const isLowStock = item.units < 10;
                  return (
                    <tr key={item.type} className="group hover:bg-slate-50/70 transition-colors duration-300 cursor-default">
                      <td className="px-12 py-10">
                        <div className="flex items-center gap-8">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-lg transition-all duration-500 ${
                            isLowStock 
                            ? 'bg-red-600 text-white shadow-red-100' 
                            : 'bg-slate-900 text-white group-hover:bg-blue-600 shadow-slate-100'
                          }`}>
                            {item.type}
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-[12px] font-extrabold text-slate-950 uppercase tracking-tight">Group Identifier</p>
                            <p className="text-[10px] font-mono text-slate-500 font-semibold uppercase">NODE-SEC-{item.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-12 py-10">
                        <div className="flex items-center gap-4">
                          <div className="flex items-baseline gap-3">
                            <span className={`text-4xl font-extrabold tracking-tighter transition-colors duration-500 ${isLowStock ? 'text-red-600' : 'text-slate-950'}`}>
                              {item.units.toString().padStart(2, '0')}
                            </span>
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Units (U)</span>
                          </div>
                          {isLowStock && (
                            <div className="flex items-center justify-center w-8 h-8 bg-red-50 rounded-full animate-pulse-soft">
                              <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-12 py-10">
                        <StatusBadge 
                          status={isLowStock ? 'CRITICAL' : 'STABLE'} 
                          className="transition-transform duration-500 group-hover:scale-105 origin-left" 
                        />
                      </td>
                      <td className="px-12 py-10 text-right">
                        <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => onEdit(item)}
                            className="py-3.5 px-8 rounded-xl border-slate-200 text-slate-500 font-bold hover:text-slate-950"
                          >
                            Audit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="danger" 
                            onClick={() => onDelete(item)}
                            className="py-3.5 px-8 rounded-xl font-bold"
                          >
                            Purge
                          </Button>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 font-semibold group-hover:hidden transition-opacity duration-300">
                          {isLowStock ? 'ALERT-AUTH-4.2' : 'AUTH-REQD-4.2'}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="p-0">
                    <EmptyState 
                      title="No Inventory Records" 
                      description="Initialize your node reserve by adding new batch records to the national grid." 
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;
