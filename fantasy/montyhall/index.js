let cl = console.log
let card = document.getElementById('card');
let right = document.getElementById('right');
let rate = document.getElementById('rate');
let witness = document.getElementById('witness');
let children = card.children
let refresh = true
let count = 0
let right_count = 0
let room = 'MontyHall-' + new Date().getMilliseconds()

let right_array = [0, 1, 0];
witness.href += '?room=' + room
var webSocket = new WebSocket("wss://buguoheng.com/ws", room)

for (let i = 0; i < children.length; i++) {
    children[i].onclick = () => {
        if (refresh) {
            send_the_true()
            children[i].getElementsByTagName('a')[0].innerText = '是否更换选择'
            _right = rondom_except_right(i);
            children[_right].getElementsByTagName('a')[0].innerText = '0'
            refresh = false
        } else {
            show_right(i)
            create_new_right_array()
            setTimeout(() => {
                for (let i = 0; i < children.length; i++) {
                    children[i].getElementsByTagName('a')[0].innerText = '?'
                }
            }, 1000);
            refresh = true
        }
    }
}

create_new_right_array = () => {
    let rondom = new Date().getMilliseconds() % right_array.length
    right_array = [0, 0, 0]
    right_array[rondom] = 1
}

show_right = (i) => {
    let temp = document.createElement('div')
    let is_right = right_array[i] == 1
    temp.className = is_right ? 'text-primary' : 'texr-danger'
    temp.innerText = right_array
    right.appendChild(temp)
    right_count += is_right ? 1 : 0
    count++
    rate.innerText = right_count + '/' + count + '---------' + (right_count / count * 100).toFixed(2) + '%'

    for (let i = 0; i < children.length; i++) {
        children[i].getElementsByTagName('a')[0].innerText = right_array[i]
    }
}

rondom_except_right = (i) => {
    let rondom = new Date().getMilliseconds() % right_array.length
    while (rondom == i || right_array[rondom] == 1) {
        rondom = new Date().getMilliseconds() % right_array.length
    }
    return rondom;
}

send_the_true = () => {
    webSocket.send(right_array)
}