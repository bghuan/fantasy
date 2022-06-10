class data {
    name = 'data'
    madeof = "1"
}

let asd = new data()
let stdin = 'ABCDEFG'

get_two = function (obj) {
    if (obj && obj.length && obj.length > 1) {
        return [get_two(obj[0]), get_two(obj.substr(1, obj.length))]
    } else {
        return obj
    }
}

in_put = get_two('AB')