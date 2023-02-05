let _music = '明灭案灯,照不见三千里'
let music = _music.split('')
let mic = [2, 0, 3, 4, 0, 0, 0, 5, '明', '灭', '案', '灯', 3, 4, 3, 4, 3, 4]

let start_index = 0; for (let i = 0; i < music.length; i++) { start_index = i; if (![1, 0].includes(music[i])) break }
let right_index = 0
let need_lenght = 3
let tick = 100

const my_catch = (word) => {
    if (right_index == need_lenght) { right_index = 0; make_right_length(); return true }
    if (music[start_index + right_index].toString() == word.toString()) right_index++
    else right_index = 0
}
const sing = (str) => { if (str.length > 0) good.innerText += (str.toString()) }
const sing2 = (str) => { if (str.length > 0) bad.innerText += (str.toString()) }
const make_right_length = () => { let a = bad.innerText.length - good.innerText.length; for (let i = 0; i < a; i++)good.innerText += '' }

const sing_with_me = (str) => {
    let index = 0
    let intervalId = setInterval(function () {
        if (index >= music.length) clearInterval(intervalId);
        sing(str.substr(index++, 1))
    }, tick)
}

const listen = (word) => { if (my_catch(word)) sing_with_me(_music.slice(start_index + need_lenght)) }

const speak = (words) => {
    let intervalId = setInterval(function () {
        if (words.length == 0) clearInterval(intervalId);
        sing2(words.slice(0, 1))
        listen(words.slice(0, 1))
        words = words.slice(1)
    }, tick)
}

speak(mic)

