'use client';
import React from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import type { Shift } from '@/models/Shift';
import type { Rule } from '@/models/Rule';

interface AddShiftProps {
  onSave: (shift: Partial<Shift>) => void;
  onDiscard: () => void;
  editingShift?: Shift;
}

export function AddShift({ onSave, onDiscard, editingShift }: AddShiftProps) {
  const [shiftTitle, setShiftTitle] = React.useState(editingShift?.name ?? '');
  const [startTime, setStartTime] = React.useState(
    editingShift?.startTime ?? '09:00'
  );
  const [endTime, setEndTime] = React.useState(
    editingShift?.endTime ?? '17:00'
  );
  const [shiftType, setShiftType] = React.useState<Shift['type']>(
    editingShift?.type ?? 'Day'
  );
  const [rules, setRules] = React.useState<Rule[]>(editingShift?.rules ?? []);

  const [isAddingRule, setIsAddingRule] = React.useState(false);
  const [ruleForm, setRuleForm] = React.useState({
    name: '',
    daysApplied: [] as number[],
    priority: 'medium' as Rule['priority'],
    perDay: '1',
    continuousDays: '5',
    restDays: '2',
  });

  const toggleDay = (day: number) => {
    setRuleForm((f) => ({
      ...f,
      daysApplied: f.daysApplied.includes(day)
        ? f.daysApplied.filter((d) => d !== day)
        : [...f.daysApplied, day],
    }));
  };

  const handleAddRule = () => {
    if (!ruleForm.name.trim()) return alert('Rule name required');
    if (ruleForm.daysApplied.length === 0) return alert('Select days');

    const newRule: Rule = {
      id: `rule-${Date.now()}`,
      name: ruleForm.name.trim(),
      daysApplied: ruleForm.daysApplied,
      perDay: parseInt(ruleForm.perDay),
      continuousDays: parseInt(ruleForm.continuousDays),
      restDays: parseInt(ruleForm.restDays),
      priority: ruleForm.priority,
    };

    setRules((prev) => [...prev, newRule]);
    setRuleForm({
      name: '',
      daysApplied: [],
      priority: 'medium',
      perDay: '1',
      continuousDays: '5',
      restDays: '2',
    });
    setIsAddingRule(false);
  };

  const handleSave = () => {
    if (!shiftTitle.trim()) return alert('Enter a title');

    const payload: Partial<Shift> = {
      name: shiftTitle.trim(),
      type: shiftType,
      startTime,
      endTime,
      rules,
    };

    // debug: confirm payload and that parent handler is called
    console.log('Creating shift payload:', payload);

    onSave(payload);
  };

  const inputClass =
    'bg-[#f7f6fb] h-[40px] px-[14px] rounded-[8px] text-[15px] w-full outline-none';

  return (
    <div className="p-4 w-full">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center pr-6">
        <h1 className="text-[24px] font-medium">
          {editingShift ? 'Edit Shift' : 'Create New Shift'}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={onDiscard}
            className="text-[#7636ff] px-4 py-2 rounded hover:bg-[#f7f6fb]"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-[#7636ff] text-white px-6 py-2 rounded-lg flex gap-2 items-center hover:bg-[#6428e0]"
          >
            <Check size={18} />
            {editingShift ? 'Save Changes' : 'Save Shift'}
          </button>
        </div>
      </div>

      {/* Shift Details */}
      <div className="bg-white p-6 rounded-lg max-w-4xl mb-4 shadow-sm">
        <h2 className="text-[18px] font-medium mb-1">Basic Information</h2>
        <p className="text-sm text-[#888796] mb-4">Name & time range</p>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-[14px] font-medium">Shift Name</label>
            <input
              value={shiftTitle}
              placeholder="Morning Shift"
              onChange={(e) => setShiftTitle(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div>
            <label className="text-[14px] font-medium">Start</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-[14px] font-medium mt-4">End</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="bg-white p-6 rounded-lg max-w-4xl shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-[18px] font-medium">Scheduling Rules</h2>

          {!isAddingRule && (
            <button
              onClick={() => setIsAddingRule(true)}
              className="bg-[#7636ff] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#6428e0]"
            >
              <Plus size={16} /> Add Rule
            </button>
          )}
        </div>

        {/* Existing Rules */}
        {rules.length > 0 && (
          <div className="mt-4 grid gap-3">
            {rules.map((r) => (
              <div
                key={r.id}
                className="bg-[#f7f6fb] p-3 rounded-lg flex justify-between"
              >
                <div>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-[#888796] mt-1">
                    {r.daysApplied.join(', ')} • {r.perDay} per day •{' '}
                    {r.continuousDays} days • {r.restDays} off
                  </p>
                </div>
                <button
                  onClick={() =>
                    setRules((prev) => prev.filter((x) => x.id !== r.id))
                  }
                >
                  <Trash2 className="text-[#d4183d]" size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Rule Form */}
        {isAddingRule && (
          <div className="bg-[#f7f6fb] p-5 mt-4 rounded-lg grid gap-4">
            <div>
              <label className="text-sm font-medium">Rule Name</label>
              <input
                type="text"
                value={ruleForm.name}
                onChange={(e) =>
                  setRuleForm((f) => ({ ...f, name: e.target.value }))
                }
                className="bg-white w-full h-[38px] px-3 rounded outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Days Applied</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <button
                    key={d}
                    onClick={() => toggleDay(d)}
                    className={`px-3 py-1 rounded ${
                      ruleForm.daysApplied.includes(d)
                        ? 'bg-[#7636ff] text-white'
                        : 'bg-white text-[#888796]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { key: 'perDay', label: 'Shifts per day' },
                { key: 'continuousDays', label: 'Continuous Days' },
                { key: 'restDays', label: 'Days Off' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="text-sm font-medium">{label}</label>
                  <input
                    type="number"
                    min="0"
                    value={(ruleForm as any)[key]}
                    onChange={(e) =>
                      setRuleForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className="bg-white w-full h-[38px] px-3 rounded outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAddingRule(false)}
                className="text-[#888796] px-3 py-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRule}
                className="bg-[#7636ff] text-white px-3 py-1 rounded-lg"
              >
                Add Rule
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
