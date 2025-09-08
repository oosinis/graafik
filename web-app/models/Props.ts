import { Shift } from '@/models/Shift'
import { Rule } from '@/models/Rule'
import { Worker } from '@/models/Worker'

export type Props = {
    makeId: () => string
    shifts: Shift[]
    activeShiftId: string
    onDeleteShift: (id: string) => void
    onAddShift: (shift: Shift) => void
    onSelectShift: (id: string) => void
    onUpdateShift: (id: string, patch: Partial<Shift>) => void
    rulesProps: RulesProps
  }

  export type RulesProps = {
    shiftId?: string
    rules: Rule[]
    activeRuleId: string
    onSelectRule: (ruleId: string) => void
    onUpdateRule: (shiftId: string, ruleId: string, patch: Partial<Rule>) => void
    onAddRule: (shiftId: string, draft: Omit<Rule, "id">) => void;
    onDeleteRule: (shiftId: string, ruleId: string) => void;
    onToggleDay: (shiftId: string, ruleId: string, day: number) => void
    onSetPriority: (shiftId: string, ruleId: string, p: Rule['priority']) => void
  }

  export type WorkerProps = {
    monthName: string
    shifts: Shift[]
    workers: Worker[]
    activeWorkerId: string
    onAddWorker: (worker: Worker) => void
    onDeleteWorker: (id: string) => void
    onSelectWorker: (id: string) => void
    onUpdateWorker: (id: string, patch: Partial<Worker>) => void
    onToggleAssignedShift: (workerId: string, shiftId: string) => void
    onSetWorkLoad: (workerId: string, value: number) => void
    onToggleDesiredVacationDay: (workerId: string, day: number) => void
    onToggleVacationDay: (workerId: string, day: number) => void
    onSetRequestedWorkDay: (workerId: string, day: number, shiftId: string | null) => void
  }
