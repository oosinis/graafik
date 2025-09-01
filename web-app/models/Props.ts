import { Shift } from '@/models/Shift'
import { Rule } from '@/models/Rule'

export type Props = {
    shifts: Shift[]
    activeShiftId: string
    onDeleteShift: (id: string) => void
    onAddShift: (shift: Shift) => void
    onSelectShift: (id: string) => void
    onUpdateShift: (id: string, patch: Partial<Shift>) => void
    rulesProps: RulesProps
  }

  export type RulesProps = {
    activeRuleId: string
    onSelectRule: (ruleId: string) => void
    updateRule: (shiftId: string, ruleId: string, patch: Partial<Rule>) => void
    toggleRuleDay: (shiftId: string, ruleId: string, day: number) => void
    setRulePriority: (shiftId: string, ruleId: string, p: Rule['priority']) => void
  }
