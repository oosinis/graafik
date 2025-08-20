import {Rule} from './Rule'

export type Shift = {
    id: string
    type: string
    durationInMinutes: number 
    rules: Rule[];
  }