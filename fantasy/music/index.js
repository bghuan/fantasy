let source_data = [
	'明灭案灯,照不见三千里',
	'推开世界的门,你是站在门外怕迟到的人']
source.innerHTML = source_data.join('<br>');
let listen_length = 2
let listen_length_current = 0
let listen_init = '-门外怕'
let source_data_index = 0
let source_data_index_index = 0

function changeColorToBlue(str) {
	let sourceDiv = document.getElementById('source');
	let originalText = sourceDiv.innerHTML;

	let newText = originalText.replaceAll('<span style="color: blue;">' + str + '</span>', str);
	newText = newText.replaceAll(str, '<span style="color: blue;">' + str + '</span>');
	if (sourceDiv.innerHTML != newText)
		sourceDiv.innerHTML = newText;
	checkSpans()
}
function checkSpans() {
	let array = source.innerHTML.split('<br>')
	for (let i = 0; i < array.length; i++) {
		let element = array[i];
		let a1 = element.indexOf('</span>')
		let a2 = a1 + element.substring(a1 + 7, element.length).indexOf('</span>')
		let a3 = a2 + element.substring(a2 + 7 + 7, element.length).indexOf('</span>')
		let a4 = a3 + element.substring(a3 + 7 + 7 + 7, element.length).indexOf('</span>')
		if (a1 > 0 && (a2 == 28 || (a3 - a2) == 28 || (a4 - a3) == 28))
			play.innerText = source.innerText.split('\n')[i]
	}
}
let listening = () => {
	// if (listen.innerText.length == 0) { listen.innerText = listen_init; return }
	let listen_word = listen.innerText.slice(0, 1)
	listen.innerText = listen.innerText.slice(1)
	play.innerText = play.innerText.slice(1)

	for (let i = 0; i < source_data.length; i++) {
		const _source_data = source_data[i];
		for (let j = 0; j < _source_data.length; j++) {
			const str = _source_data[j];
			if (listen_word == str) {
				changeColorToBlue(str)
			} else if ((source.innerHTML != source_data.join('<br>')) && source.innerHTML.indexOf(listen_word) < 0) {
				source.innerHTML = source_data.join('<br>');
				return
			}

			listen_length_current = 0
		}
	}
}

setInterval(listening, 1000)
speak.onclick = () => {
	let a = listen.innerText
	listen.innerText = a.slice(0, 2) + speak_text.value + a.slice(2)
	speak_text.value = ''
	play.innerText = ''
}