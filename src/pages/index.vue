<script setup lang="ts">
import { changePos, init, isOK, isOrder } from '~/util'

defineOptions({
  name: 'IndexPage',
})

const poetic = ref('绿蚁新醅酒，红泥小火炉。晚来天欲雪，能饮一杯无？')
/*
两个黄鹂鸣翠柳，
一行白鹭上青天。
窗含西岭千秋雪，
门泊东吴万里船。
*/


const passed = ref(false)
const rows = ref(4)
const cols = ref(6)
const initArr = ref(init(rows.value, cols.value, poetic.value))

function newGame() {
  passed.value = false
  initArr.value = init(rows.value, cols.value, poetic.value)
}

const visible = ref(false)
const customPoetic = ref('')
function customPoeticClick() {
  visible.value = true
}

function customPoeticConfirm() {
  visible.value = false
  poetic.value = customPoetic.value.replace(/\r\n/g, '').replace(/\r/g, '').replace(/\n+/g, '').trim()
  rows.value = customPoetic.value.split('\n').length
  cols.value = Math.floor(customPoetic.value.length / rows.value)
  console.log({ poeticValue: poetic.value, rows: rows.value, cols: cols.value })
  newGame()
}
function customPoeticCancel() {
  visible.value = false
}

function showContent(row: number, col: number) {
  if(passed.value && !isOrder(initArr.value, poetic.value) && row === rows.value) {
    if(col === cols.value - 2 || col === cols.value - 1) {
      return poetic.value[(row - 1) * cols.value + col - 1]
    }
  }
  return initArr.value[(row - 1) * cols.value + (col - 1)].id === rows.value * cols.value - 1 && !passed.value ? '' : poetic.value[initArr.value[(row - 1) * cols.value + (col - 1)].id]
}

function handleClick(id: number) {
  const targetItem = initArr.value.find(item => item.id === id)
  if (targetItem) {
    const { up, down, left, right } = targetItem
    let res = null
    if (up)
      res = changePos(initArr.value, 'up', rows.value, cols.value)

    if (down)
      res = changePos(initArr.value, 'down', rows.value, cols.value)

    if (left)
      res = changePos(initArr.value, 'left', rows.value, cols.value)

    if (right)
      res = changePos(initArr.value, 'right', rows.value, cols.value)

    if (res && res.length > 0) {
      initArr.value = res
      if (isOK(res, poetic.value))
        passed.value = true
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', ({ code }) => {
    let res = null
    switch (code) {
      case 'ArrowUp':
        res = changePos(initArr.value, 'up', rows.value, cols.value)
        break
      case 'ArrowDown':
        res = changePos(initArr.value, 'down', rows.value, cols.value)
        break
      case 'ArrowLeft':
        res = changePos(initArr.value, 'left', rows.value, cols.value)
        break
      case 'ArrowRight':
        res = changePos(initArr.value, 'right', rows.value, cols.value)
        break
    }
    if (res && res.length > 0) {
      initArr.value = res
      if (isOK(res, poetic.value))
        passed.value = true
    }
  })
})
</script>

<template>
  <div>
    <div>
      <button
        class="m-3 text-sm btn"
        @click="newGame"
      >
        重 来
      </button>
      <button
        class="m-3 text-sm btn"
        @click="customPoeticClick"
      >
        自定义
      </button>
    </div>

    <div py-4 />

    <div
      v-for="row, x in rows"
      :key="x"
      flex="~"
      ma w-max items-center justify-center
    >
      <div
        v-for="col, y in cols"
        :key="y"
        flex="~"
        ma w-max items-center justify-center
      >
        <button
          flex="~"
          min-h-10 min-w-10 items-center justify-center m="1px"
          border="0.5 gray-700/10"
          @click="handleClick(initArr[(row - 1) * cols + (col - 1)].id)"
          >
          {{ showContent(row, col) }}
        </button>
      </div>
    </div>

    <div v-show="visible" class="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="w-5/6 border rounded-xl p-4 bg-white">
        <p class="pb-2">自定义诗句(记得换行)</p>
        <textarea v-model="customPoetic" rows="10" class="w-full border p-2 outline-none"></textarea>
        <div class="flex justify-center">
          <button type="button" class="m-3 text-sm btn bg-white text-gray-800 border hover:bg-white" @click="customPoeticCancel">取消</button>
          <button type="button" class="m-3 text-sm btn" @click="customPoeticConfirm">确定</button>
        </div>
      </div>
    </div>

    <div py-4 />

    <Confetti :passed="passed" />
  </div>
</template>
