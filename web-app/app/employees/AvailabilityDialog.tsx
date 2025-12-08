"use client";

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { Employee } from '@/models/Employee';

interface AvailabilityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onSave: (availability: AvailabilityData) => void;
}

export interface AvailabilityData {
  desiredWorkDays: string[]; // Array of date strings YYYY-MM-DD
  requestedDaysOff: string[]; // Array of date strings YYYY-MM-DD
  vacationDays: string[]; // Array of date strings YYYY-MM-DD
  sickDays: string[]; // Array of date strings YYYY-MM-DD
}

export function AvailabilityDialog({ isOpen, onClose, employee, onSave }: AvailabilityDialogProps) {
  const [desiredWorkDays, setDesiredWorkDays] = useState<string[]>([]);
  const [requestedDaysOff, setRequestedDaysOff] = useState<string[]>([]);
  const [vacationDays, setVacationDays] = useState<string[]>([]);
  const [sickDays, setSickDays] = useState<string[]>([]);

  // Filter controls
  const [selectedCategory, setSelectedCategory] = useState<'desired' | 'requested' | 'vacation' | 'sick'>('desired');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!isOpen || !employee) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/employees/${employee.id}/availability?year=${selectedYear}&month=${selectedMonth + 1}`);
        if (response.ok) {
          const data: AvailabilityData = await response.json();
          setDesiredWorkDays(data.desiredWorkDays || []);
          setRequestedDaysOff(data.requestedDaysOff || []);
          setVacationDays(data.vacationDays || []);
          setSickDays(data.sickDays || []);
        } else {
          console.error('Failed to fetch availability');
          toast({ title: 'Failed to load availability', variant: 'destructive' });
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
        toast({ title: 'Error loading availability', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [isOpen, employee, selectedYear, selectedMonth]);

  if (!isOpen || !employee) return null;

  const toggleDesiredWorkDay = (date: string) => {
    // Remove from other categories first
    setRequestedDaysOff(prev => prev.filter(d => d !== date));
    setVacationDays(prev => prev.filter(d => d !== date));
    setSickDays(prev => prev.filter(d => d !== date));

    // Toggle in this category
    setDesiredWorkDays(prev =>
      prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  const toggleRequestedDayOff = (date: string) => {
    // Remove from other categories first
    setDesiredWorkDays(prev => prev.filter(d => d !== date));
    setVacationDays(prev => prev.filter(d => d !== date));
    setSickDays(prev => prev.filter(d => d !== date));

    // Toggle in this category
    setRequestedDaysOff(prev =>
      prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  const toggleVacationDay = (date: string) => {
    // Remove from other categories first
    setDesiredWorkDays(prev => prev.filter(d => d !== date));
    setRequestedDaysOff(prev => prev.filter(d => d !== date));
    setSickDays(prev => prev.filter(d => d !== date));

    // Toggle in this category
    setVacationDays(prev =>
      prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  const toggleSickDay = (date: string) => {
    // Remove from other categories first
    setDesiredWorkDays(prev => prev.filter(d => d !== date));
    setRequestedDaysOff(prev => prev.filter(d => d !== date));
    setVacationDays(prev => prev.filter(d => d !== date));

    // Toggle in this category
    setSickDays(prev =>
      prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  const handleSave = async () => {
    setSaveStatus('saving');

    const availabilityData = {
      desiredWorkDays,
      requestedDaysOff,
      vacationDays,
      sickDays
    };

    console.log('💾 Admin saving availability for employee:', {
      employeeId: employee?.id,
      employeeName: employee?.name,
      desiredWorkDays: availabilityData.desiredWorkDays.length,
      requestedDaysOff: availabilityData.requestedDaysOff.length,
      vacationDays: availabilityData.vacationDays.length,
      sickDays: availabilityData.sickDays.length
    });

    // Small delay to show the saving state
    await new Promise(resolve => setTimeout(resolve, 300));

    onSave(availabilityData);
    toast({ title: `Availability updated for ${employee?.name}` });

    setSaveStatus('saved');

    // Keep the saved state visible for 1 second before closing
    setTimeout(() => {
      setSaveStatus('idle');
      onClose();
    }, 1000);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const categories = [
    { id: 'desired' as const, label: 'Desired Work Days', color: '#7636ff', bgColor: '#eae1ff' },
    { id: 'requested' as const, label: 'Requested Days Off', color: '#ff6b6b', bgColor: '#ffe0e0' },
    { id: 'vacation' as const, label: 'Vacation Days', color: '#4caf50', bgColor: '#e8f5e9' },
    { id: 'sick' as const, label: 'Sick Days', color: '#ff9800', bgColor: '#fff3e0' }
  ];

  const getCurrentDates = () => {
    switch (selectedCategory) {
      case 'desired': return desiredWorkDays;
      case 'requested': return requestedDaysOff;
      case 'vacation': return vacationDays;
      case 'sick': return sickDays;
    }
  };

  const getCurrentToggle = () => {
    switch (selectedCategory) {
      case 'desired': return toggleDesiredWorkDay;
      case 'requested': return toggleRequestedDayOff;
      case 'vacation': return toggleVacationDay;
      case 'sick': return toggleSickDay;
    }
  };

  const getCurrentCategory = () => categories.find(c => c.id === selectedCategory)!;

  // Get the category for a specific date
  const getDateCategory = (dateStr: string): 'desired' | 'requested' | 'vacation' | 'sick' | null => {
    if (desiredWorkDays.includes(dateStr)) return 'desired';
    if (requestedDaysOff.includes(dateStr)) return 'requested';
    if (vacationDays.includes(dateStr)) return 'vacation';
    if (sickDays.includes(dateStr)) return 'sick';
    return null;
  };

  // Handle date click
  const handleDateClick = (dateStr: string) => {
    getCurrentToggle()(dateStr);
  };

  // Calendar rendering
  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return {
      daysInMonth,
      startingDayOfWeek,
      year,
      month
    };
  };

  const formatDate = (year: number, month: number, day: number): string => {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
  };

  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-[#f7f6fb] rounded-[12px] w-[800px] max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white px-[32px] py-[24px] border-b border-[#e6e6ec] flex justify-between items-center">
          <div>
            <h2 className="font-['Poppins:Medium',_sans-serif] text-[24px] tracking-[-0.48px] text-[#19181d] leading-[24px]">
              Employee Availability
            </h2>
            <p className="font-['Poppins:Regular',_sans-serif] text-[14px] tracking-[-0.28px] text-[#888796] leading-[14px] mt-[8px]">
              {employee.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-[32px] h-[32px] rounded-[8px] bg-[#f7f6fb] flex items-center justify-center hover:bg-[#eae1ff] transition-colors"
          >
            <X className="w-[16px] h-[16px] text-[#19181d]" strokeWidth={2} />
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white px-[32px] py-[20px] border-b border-[#e6e6ec]">
          <div className="flex gap-[16px] items-end">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] text-[#19181d] leading-[14px] mb-[8px] block">
                Category
              </label>
              <div className="grid grid-cols-2 gap-[8px]">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-[16px] py-[10px] rounded-[8px] font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] leading-[14px] transition-all ${selectedCategory === cat.id
                      ? 'text-white shadow-md'
                      : 'bg-[#f7f6fb] text-[#888796] hover:bg-[#eae1ff]'
                      }`}
                    style={selectedCategory === cat.id ? { backgroundColor: cat.color } : {}}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Month Selector */}
            <div className="w-[160px]">
              <label className="font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] text-[#19181d] leading-[14px] mb-[8px] block">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full px-[12px] py-[10px] rounded-[8px] bg-[#f7f6fb] border border-[#e6e6ec] font-['Poppins:Regular',_sans-serif] text-[14px] tracking-[-0.28px] text-[#19181d] leading-[14px] cursor-pointer hover:bg-[#eae1ff] transition-colors"
              >
                {monthNames.map((month, idx) => (
                  <option key={idx} value={idx}>{month}</option>
                ))}
              </select>
            </div>

            {/* Year Selector */}
            <div className="w-[100px]">
              <label className="font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] text-[#19181d] leading-[14px] mb-[8px] block">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full px-[12px] py-[10px] rounded-[8px] bg-[#f7f6fb] border border-[#e6e6ec] font-['Poppins:Regular',_sans-serif] text-[14px] tracking-[-0.28px] text-[#19181d] leading-[14px] cursor-pointer hover:bg-[#eae1ff] transition-colors"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-[32px] py-[24px]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-[16px]">
                <div className="w-[40px] h-[40px] border-4 border-[#e6e6ec] border-t-[#7636ff] rounded-full animate-spin" />
                <p className="font-['Poppins:Regular',_sans-serif] text-[16px] tracking-[-0.32px] text-[#888796] leading-[16px]">
                  Loading availability...
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[8px] p-[24px]">
              <div className="flex items-center justify-between mb-[16px]">
                <h3 className="font-['Poppins:Medium',_sans-serif] text-[18px] tracking-[-0.36px] text-[#19181d] leading-[18px]">
                  Select {getCurrentCategory().label}
                </h3>
                <div className="px-[12px] py-[6px] rounded-[6px]" style={{ backgroundColor: getCurrentCategory().bgColor }}>
                  <p className="font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] leading-[14px]" style={{ color: getCurrentCategory().color }}>
                    {getCurrentDates().length} {getCurrentDates().length === 1 ? 'day' : 'days'} selected
                  </p>
                </div>
              </div>

              {/* Custom Multi-Color Calendar */}
              <div className="w-full mb-[20px]">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-[12px]">
                  <button
                    onClick={goToPreviousMonth}
                    className="w-[28px] h-[28px] rounded-[6px] bg-[#f7f6fb] flex items-center justify-center hover:bg-[#eae1ff] transition-colors"
                  >
                    <ChevronLeft className="w-[16px] h-[16px] text-[#19181d]" strokeWidth={2} />
                  </button>
                  <p className="font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#19181d] leading-[16px]">
                    {monthNames[selectedMonth]} {selectedYear}
                  </p>
                  <button
                    onClick={goToNextMonth}
                    className="w-[28px] h-[28px] rounded-[6px] bg-[#f7f6fb] flex items-center justify-center hover:bg-[#eae1ff] transition-colors"
                  >
                    <ChevronRight className="w-[16px] h-[16px] text-[#19181d]" strokeWidth={2} />
                  </button>
                </div>

                {/* Day names */}
                <div className="grid grid-cols-7 gap-[4px] mb-[4px]">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(name => (
                    <div key={name} className="h-[28px] flex items-center justify-center">
                      <p className="font-['Poppins:Medium',_sans-serif] text-[12px] tracking-[-0.24px] text-[#888796] leading-[12px]">
                        {name}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-[4px]">
                  {(() => {
                    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(selectedYear, selectedMonth);
                    const days: (number | null)[] = [];

                    // Add empty slots
                    for (let i = 0; i < startingDayOfWeek; i++) {
                      days.push(null);
                    }

                    // Add all days
                    for (let day = 1; day <= daysInMonth; day++) {
                      days.push(day);
                    }

                    return days.map((day, index) => {
                      if (day === null) {
                        return <div key={`empty-${index}`} className="h-[32px]" />;
                      }

                      const dateStr = formatDate(selectedYear, selectedMonth, day);
                      const dateCategory = getDateCategory(dateStr);
                      const categoryConfig = dateCategory ? categories.find(c => c.id === dateCategory) : null;

                      return (
                        <button
                          key={day}
                          onClick={() => handleDateClick(dateStr)}
                          className={`h-[32px] rounded-[6px] flex items-center justify-center transition-colors ${categoryConfig
                            ? 'text-white'
                            : 'bg-[#f7f6fb] text-[#19181d] hover:bg-[#eae1ff]'
                            }`}
                          style={categoryConfig ? { backgroundColor: categoryConfig.color } : {}}
                        >
                          <p className="font-['Poppins:Medium',_sans-serif] text-[14px] tracking-[-0.28px] leading-[14px]">
                            {day}
                          </p>
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Legend */}
              <div className="p-[16px] bg-[#f7f6fb] rounded-[8px]">
                <p className="font-['Poppins:Medium',_sans-serif] text-[12px] tracking-[-0.24px] text-[#888796] mb-[12px]">
                  LEGEND
                </p>
                <div className="grid grid-cols-2 gap-[12px]">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center gap-[8px]">
                      <div
                        className="w-[24px] h-[24px] rounded-[6px]"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-['Poppins:Regular',_sans-serif] text-[12px] tracking-[-0.24px] text-[#19181d]">
                        {category.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white px-[32px] py-[20px] border-t border-[#e6e6ec] flex justify-end gap-[12px]">
          <button
            onClick={onClose}
            disabled={saveStatus !== 'idle'}
            className={`px-[24px] py-[10px] rounded-[8px] bg-[#f7f6fb] font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-[#19181d] leading-[16px] transition-colors ${saveStatus === 'idle' ? 'hover:bg-[#eae1ff]' : 'opacity-50 cursor-not-allowed'
              }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`px-[24px] py-[10px] rounded-[8px] font-['Poppins:Medium',_sans-serif] text-[16px] tracking-[-0.32px] text-white leading-[16px] transition-all ${saveStatus === 'saved'
              ? 'bg-[#4caf50] hover:bg-[#4caf50]'
              : saveStatus === 'saving'
                ? 'bg-[#888796] cursor-not-allowed'
                : 'bg-[#7636ff] hover:bg-[#6428e0]'
              }`}
          >
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'saved' && '✓ Saved!'}
            {saveStatus === 'idle' && 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};
