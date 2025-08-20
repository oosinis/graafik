import {Shift} from './Shift'

export type Props = {
  shifts: Shift[]
  activeShiftId: string
  onSelectShift: (id: string) => void
  onUpdateShift: (id: string, patch: Partial<Shift>) => void
}