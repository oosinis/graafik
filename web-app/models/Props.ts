import { Shift } from '@/models/Shift'
import { Rule } from '@/models/Rule'

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
