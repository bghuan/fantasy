let cl = console.log
let card = document.getElementById('card');
let right = document.getElementById('right');
let rate = document.getElementById('rate');
let witness = document.getElementById('witness');
let right_single = document.getElementById('right_single');
let btn1 = document.getElementById('btn1');
let children = card.children
let refresh = true
let count = 0
let right_count = 0
let room = 'MontyHall-' + new Date().getMilliseconds()
let class_right = 'border bg-primary'
let class_wrong = 'border bg-danger'
let class_disable = 'border bg-dark'
let class_normal = 'border bg-light'
let refresh_time = 1000

let right_array = [0, 1, 0];
let one_of_wrong
var webSocket

create_new_right_array = () => {
    let rondom = get_random()
    right_array = [0, 0, 0]
    right_array[rondom] = 1
}

show_right = (i) => {
    let temp = document.createElement('span')
    let is_right = right_array[i] == 1
    temp.className = is_right ? 'text-primary' : 'texr-danger'
    temp.innerText = right_array + '-'
    right.appendChild(temp)
    right_count += is_right ? 1 : 0
    count++
    rate.innerText = right_count + '/' + count + '---------' + (right_count / count * 100).toFixed(2) + '%'

    for (let i = 0; i < children.length; i++) {
        children[i].children[0].innerText = right_array[i]
        if (children[i].children[0].className.indexOf('dark') < 0) {
            var className = right_array[i] == 1 ? class_right : class_wrong
            refresh_div(i, className)
        }
    }
}

rondom_except_right = (i) => {
    let rondom = get_random()
    while (rondom == i || right_array[rondom] == 1) {
        rondom = get_random()
    }
    return rondom;
}

send_the_true = () => {
    webSocket.send(right_array)
}

refresh_div = (i, className) => {
    children[i].children[0].className = className
}

run_a_thousand = (num = 1) => {
    for (let i = 0; i < num; i++) {
        create_new_right_array()
        let pick_one = get_random()
        let one_of_wrong = rondom_except_right(pick_one);
        let one_of_last = the_last(pick_one, one_of_wrong);
        let is_right = right_array[one_of_last] == 1
        right_count += is_right ? 1 : 0
        count++
    }
    rate.innerText = right_count + '/' + count + '---------' + (right_count / count * 100).toFixed(2) + '%'
    right_single.innerText = count_0 + ' ' + count_1 + ' ' + count_2
    cl(rate.innerText)
    cl(right_single.innerText)
}

the_last = (var1, var2) => {
    for (let i = 0; i < 3; i++) {
        if (var1 != i && var2 != i) {
            return i
        }
    }
}

let count_0 = count_1 = count_2 = 0
get_random = () => {
    let result = Math.floor(Math.random() * 3)
    count_0 += result == 0 ? 1 : 0
    count_1 += result == 1 ? 1 : 0
    count_2 += result == 2 ? 1 : 0
    return result
}

webSocket = new WebSocket("wss://buguoheng.com/ws", room)
witness.href = 'https://ws.buguoheng.com?room=' + room
create_new_right_array()
for (let i = 0; i < children.length; i++) {
    children[i].onclick = () => {
        if (refresh) {
            children[i].children[0].innerText = '是否更换选择'
            one_of_wrong = rondom_except_right(i);
            children[one_of_wrong].children[0].innerText = '0'
            refresh_div(one_of_wrong, class_disable)
            refresh = false
            send_the_true()
        } else {
            show_right(i)
            create_new_right_array()
            setTimeout(() => {
                for (let i = 0; i < children.length; i++) {
                    children[i].children[0].innerText = '?'
                    refresh_div(i, class_normal)
                }
            }, refresh_time);
            refresh = true
        }
    }
}
btn1.onclick = () => {
    run_a_thousand(1000)
}