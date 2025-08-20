import {Rule} from './Rule'
import { PriorityType } from './PriorityType'

export type RulesProps = {
  activeRuleId: string
  onSelectRule: (ruleId: string) => void
  updateRule: (shiftId: string, ruleId: string, patch: Partial<Rule>) => void
  toggleRuleDay: (shiftId: string, ruleId: string, day: number) => void
  setRulePriority: (shiftId: string, ruleId: string, p: PriorityType) => void
}