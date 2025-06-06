var quanxian_list = []

var yidong = {
    shu: 0,
    rala: [],
    quan: (a) => {
        shu = shu + a > 0 ? 1 : -1
    }
}
var juli = { shu: 0, rala: [], quan: (a) => { return yidong.shu - 0 } }

var shengxu = {
    quan: (a) => {
        var n = quanxian_list.length - 1
        var random1 = Math.floor(Math.random() * n)
        var random2 = Math.floor(Math.random() * n)
        if (random1 == random2) return

        var quanxian = {
            shu: 0,
            rala: [],
            quan: quanxian_list[random1].quan,
            xian: quanxian_list[random2].quan,
        }
        quanxian_list.add(quanxian)
    }
}
var ralation = (a, b) => {
    if (b == 0) return 0
    else if (a > 0 && b > 0) return a / b
    else if (a > 0 && b < 0) return a / b
    else if (a < 0 && b < 0) return a / b
    else if (a < 0 && b > 0) return a / b
}
quanxian_list = [juli, shengxu]
