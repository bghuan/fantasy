// 数组是依靠01234的一维数字下标关联的或者说看起了这样关联的
// 做一个四个方向,六个方向的,一维是二,二维是四三维是六
let a_id = 0
let table = []
let last = null
class data {
    id = 0
    constructor(id) {
        this.id = id || a_id++
        table.push([last, this])
        last = this
    }
    next = function () {
        for (let i = 0; i < table.length; i++) {
            if (table[i][0] == this) {
                return table[i][1]
            }
        }
    }
    privours = function () {
        for (let i = 0; i < table.length; i++) {
            if (table[i][1] == this) {
                return table[i][0]
            }
        }
    }
}

let a = new data()
let b = new data()

let b_id = 0
let array = []
class data2 {
    id = 0
    constructor() {
        this.id = b_id++
        array.push(this)
    }
}
let aa = new data2()
let bb = new data2()
