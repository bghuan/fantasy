// let before_scroll
// let on_scroll = () => {
//     let after = document.documentElement.scrollTop
//     let between = after - (before_scroll || 0)
//     console.log(between > 0 ? '111' : '222')
//     before_scroll = after
// }
// on_scroll() = function 
// window.addEventListener("scroll", on_scroll)
// let on_scroll = () => {
//     let before_scroll = 0
//     let _on_scroll = () => {
//         let after = document.documentElement.scrollTop
//         let between = after - before_scroll
//         console.log(between > 0 ? '111' : '222')
//         before_scroll = after
//     }
//     return _on_scroll
// }
// window.addEventListener("scroll", on_scroll())

// on_scroll() = function 
let on_scroll = (callBack) => {
    let before_scroll = 0
    let _on_scroll = () => {
        let after = document.documentElement.scrollTop
        let between = after - before_scroll
        before_scroll = after
        callBack(between > 0)
    }
    return _on_scroll
}
window.addEventListener("scroll", on_scroll((flag) => { console.log(flag ? '111' : '222') }))