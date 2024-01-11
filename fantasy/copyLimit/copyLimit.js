//2的n次方天数内,能复制n个,限制复制的倍率

let day = 1000
let init = 1

let array = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576]

for (let i = 0; i < 21; i++) {
    array.push(Math.pow(2, i))
}

//有限天数,能复制几个
const calc = (day) => {
    for (let i = 0; day < (Math.pow(2, 100)); i++)
        if (Math.pow(2, i + 1) > day) return i
}


const biubiubiu = (num, day) => {
    let i = calc(day--);
    num += i
    console.log(i, day, num)
    if (day > 0)
        return num + biubiubiu(num, day)
    else return num
}

const levelyo = (level) => {
    return level + '--------------------------'.substring(0, level)
}

array = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576]
let asd = 1
let keyValuePairs = {}
let countdsa = 0
let getkeyValuePairs = (days) => {
    return keyValuePairs[days]
}
const limit222 = (days, level = 1) => {
    let count = 0
    for (let i = 1; i <= days && days > 1; i++) {
        let right = 0
        if (array.indexOf(i) > -1) {
            right = 1
            console.log((countdsa++ + '        ').substring(0, 9) + ((asd++) + '    ').substring(0, 5) + (right > 0 ? '+   ' : '    '), ('(' + i + '/' + days + ')     ').substring(0, 8), levelyo(level))
            //count = count + 1
            if (keyValuePairs[days]) count += keyValuePairs[days] + 1
            else count += (limit222(days - i + 1, level + 1) + 1)
        }
        else
            console.log((countdsa + '        ').substring(0, 9) + ((asd++) + '    ').substring(0, 5) + (right > 0 ? '+   ' : '    '), ('(' + i + '/' + days + ')     ').substring(0, 8), levelyo(level))
    }
    keyValuePairs[days] = count
    return count
}
//limit222(10)
console.log(limit222(5))