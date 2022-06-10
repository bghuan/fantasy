let place = []
for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) place.push(i + '' + j)
let place_power = function (num) { return parseInt(place[num][0]) + parseInt(place[num][1]) }
let set_place_power = function () { }

let data_all = '1234567891'.split('')
let data_all_length = data_all.length
let rondom_int = function () { return Math.floor(Math.random() * data_all_length) }
let rondom = function () { return data_all[rondom_int()] }
let data_a = function () { return rondom() }
let data_b = function () { return rondom() }
let data = function () { return data_a() + data_b() }

let stand_in = []
for (let i = 0; i < 100; i++) stand_in.push(data())

console.log(stand_in)

