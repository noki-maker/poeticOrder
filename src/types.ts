export interface Cell {
  id: number
  col: number
  row: number
  up?: boolean
  down?: boolean
  left?: boolean
  right?: boolean
}
