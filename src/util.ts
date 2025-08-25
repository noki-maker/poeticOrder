import type { Cell } from '~/types'

const extend = Object.assign
const NOMOVE = {
  up: false,
  down: false,
  left: false,
  right: false,
}
const isOdd = (val: number): boolean => val % 2 === 1
function isNoSolution(arr: Cell[]): boolean {
  let count = 0
  for (let i = 1; i < arr.length; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[j].id < arr[i].id)
        count++
    }
  }

  return isOdd(count)
}

function generateArr(length: number): number[] {
  return Array.from({ length }, (_, index) => index).sort(
    () => Math.random() - 0.5,
  )
}

function generateGame(rows: number, cols: number): Cell[] {
  const length = rows * cols - 1
  const arr = generateArr(length)
  const res = []

  let col = 0
  let row = 0
  for (let i = 0; i < length; i++) {
    const item: Cell = {
      id: arr[i],
      col,
      row,
    }
    extend(item, NOMOVE)
    if (row === rows - 1 && col === cols - 2)
      item.right = true

    if (row === rows - 2 && col === cols - 1)
      item.down = true

    col++
    if (col === cols) {
      col = 0
      row++
    }
    res[i] = item
  }
  return res
}

function isEffectaivePos(row: number, col: number, rows: number, cols: number): boolean {
  if (row < 0 || col < 0 || row > rows - 1 || col > cols - 1)
    return false

  return true
}

function getPos(row: number, col: number, rows: number, cols: number): number {
  if (isEffectaivePos(row, col, rows, cols))
    return row * cols + col

  return 0
}

function resetStutas(arr: Cell[]): void {
  arr.forEach((item) => {
    extend(item, NOMOVE)
  })
}

function resolveNewStutas(arr: Cell[], empty: Cell, rows: number, cols: number): void {
  const { row, col } = empty
  if (isEffectaivePos(row - 1, col, rows, cols)) {
    const pos = getPos(row - 1, col, rows, cols)
    arr[pos].down = true
  }
  if (isEffectaivePos(row + 1, col, rows, cols)) {
    const pos = getPos(row + 1, col, rows, cols)
    arr[pos].up = true
  }
  if (isEffectaivePos(row, col - 1, rows, cols)) {
    const pos = getPos(row, col - 1, rows, cols)
    arr[pos].right = true
  }
  if (isEffectaivePos(row, col + 1, rows, cols)) {
    const pos = getPos(row, col + 1, rows, cols)
    arr[pos].left = true
  }
}

export function changePos(arr: Cell[], direction: 'down' | 'up' | 'right' | 'left', rows: number, cols: number): Cell[] {
  const targetItem = arr.find(item => item[direction])
  if (!targetItem)
    return arr
  const emptyItem = arr.find(item => item.id === rows * cols - 1)
  if (!emptyItem)
    return arr
  switch (direction) {
    case 'up':
      targetItem.row = targetItem.row - 1
      emptyItem.row = emptyItem.row + 1
      break
    case 'down':
      targetItem.row = targetItem.row + 1
      emptyItem.row = emptyItem.row - 1
      break
    case 'left':
      targetItem.col = targetItem.col - 1
      emptyItem.col = emptyItem.col + 1
      break
    case 'right':
      targetItem.col = targetItem.col + 1
      emptyItem.col = emptyItem.col - 1
      break
  }
  const targetItemPos = getPos(targetItem.row, targetItem.col, rows, cols)
  const emptyItemPos = getPos(emptyItem.row, emptyItem.col, rows, cols)

  arr[targetItemPos] = targetItem
  arr[emptyItemPos] = emptyItem

  resetStutas(arr)
  resolveNewStutas(arr, arr[emptyItemPos], rows, cols)

  return arr
}

export function isOK(arr: Cell[], poetic: string): boolean {
  return arr.map(item => poetic[item.id]).join('') === poetic
}

export function init(rows: number, cols: number, poetic: string): Cell[] {
  let game = generateGame(rows, cols)
  while (isOK(game, poetic) || isNoSolution(game))
    game = generateGame(rows, cols)

  return [
    ...game,
    extend(
      {
        id: rows * cols - 1,
        col: cols - 1,
        row: rows - 1,
      },
      NOMOVE,
    ),
  ]
}
