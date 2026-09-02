function setBgTransparent(node, depth) {
    if (!node || depth > 10) return;
    if (node.style) node.style.backgroundColor = 'transparent';
    if (node.style) node.style.color = '#f3f3f3';
    if (node.style && localStorage.textcolor) node.style.color = localStorage.textcolor;
    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            setBgTransparent(node.children[i], depth + 1);
        }
    }
}
function bottomLine() {
    const topp = (document.body.scrollHeight - window.innerHeight) + 'px';
    const line = document.createElement('div');
    Object.assign(line.style, {
        position: 'absolute',
        top: topp,
        width: '100%',
        height: '1px',
        borderTop: '1px dashed #eee',
        zIndex: 999999,
    });
    document.body.appendChild(line);
}

setBgTransparent(document.documentElement, 1);

const style = document.createElement('style');
style.textContent = `::-webkit-scrollbar { display: none !important; }`;
document.head.appendChild(style);

document.body.addEventListener("keyup", event => { if (event.key === '.') (localStorage.textcolor = localStorage.textcolor == '#f3f3f3' ? '#000' : '#f3f3f3') })

if (location.href.indexOf('qidian') > 0) {
    var asddsadas = () => {
        setBgTransparent(document.body, 1);
        try { for (let obj of document.getElementsByClassName('page-ops')) { obj.style.display = 'none' } } catch { }
        try { document.getElementById('j-topOpBox').style.display = 'none' } catch { }
        try { document.getElementById('left-container').style.display = 'none' } catch { }
        document.querySelectorAll('.noise-bg').forEach(o => { o.style.backgroundImage = "none" })
        try { document.querySelector('#r-menu').style.display = 'none' } catch { }
        document.querySelector('#reader-content').style.marginLeft = '50px'
    }
    setInterval(asddsadas, 1000)
}

if (location.href.indexOf('dingdiange') > 0) {
    apprecom1.style.display = 'none'; apprecom2.style.display = 'none'; document.querySelector('.reader_mark1').style.display = 'none'; document.querySelector('.reader_mark0').style.display = 'none'; box_con.style.border = 'none';
    box_con.children[4].style.display = 'none'
    bottomLine()
    var asdddd = (event) => {
        if (Math.ceil(window.pageYOffset) + Math.ceil(window.innerHeight) + 100 >= document.body.scrollHeight) {
            document.querySelectorAll('.bottem a')[3].click()
            event.stopPropagation();
        }
    }
    document.body.addEventListener("keydown", event => { if (event.key == ' ' || event.key == 'PageDown') { asdddd(event) } })
}


if (location.href.indexOf('biqugewenx') > 0) {
    document.body.addEventListener("keyup", event => { console.log(event.key); if (event.key === 'ArrowRight') { A3.click() } })

    if (content) content.removeChild(content.lastChild)
    if (content) content.removeChild(content.lastChild)

    if (document.querySelectorAll('.pc, .hotbook, .tuibook, .mobile, .footer')) document.querySelectorAll('.pc, .hotbook, .tuibook, .mobile, .footer').forEach(o => o.style.display = 'none')
    if (document.querySelector('.box_con')) document.querySelector('.box_con').style.border = 'none'
}

if (location.href.indexOf('92yanqing') > 0) {
    bottomLine()
    var asdddd = (event) => {
        if (Math.ceil(window.pageYOffset) + Math.ceil(window.innerHeight) + 100 >= document.body.scrollHeight) {
            next_url.click()
            event.stopPropagation();
        }
    }
    document.body.addEventListener("keydown", event => { if (event.key == ' ' || event.key == 'PageDown') { asdddd(event) } })
}