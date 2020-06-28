// // 1. 默认导出(只能有一个)
// export default {
//   m: 1
// }

// // 2. 分别导出(可以有多个)
// export const yyy = 3
// export function zzz() {

// }

// // 3. 统一导出(可以有多个)
// const a = 1
// const b = 2
// const c = 3
// export {
//   a,
//   b,
//   c
// }
// const d = 4
// const e = 5
// export {
//   d,
//   e0
// }

export default {
  name:"hello"
}

export const num = 100
export function fn1(){}

const name1 = '超哥'
const name2 = '渊哥'

export {
  name1,
  name2
}

const name3 = '华哥'
const name4 = '强哥'

export {
  name3,
  name4
}
