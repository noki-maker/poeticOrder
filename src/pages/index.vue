<script setup lang="ts">
import { changePos, init, isOK } from '~/util'

defineOptions({
  name: 'IndexPage',
})

const first = '绿蚁新醅酒，红泥小火炉。晚来天欲雪，能饮一杯无？'

const passed = ref(false)
const rows = ref(4)
const cols = ref(6)
const initArr = ref(init(rows.value, cols.value, first))

watchEffect(() => {
  passed.value = false
  initArr.value = init(rows.value, cols.value, first)
})

function newGame() {
  passed.value = false
  initArr.value = init(rows.value, cols.value, first)
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
      if (isOK(res, first))
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
      if (isOK(res, first))
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
          {{ initArr[(row - 1) * cols + (col - 1)].id === rows * cols - 1 && !passed ? '' : first[initArr[(row - 1) * cols + (col - 1)].id] }}
        </button>
      </div>
    </div>

    <div py-4 />

    <Confetti :passed="passed" />
  </div>
</template>
