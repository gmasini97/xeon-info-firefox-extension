const cpu_fmt = (name) => name.replace('-', '').replace(' ', '').toLowerCase()

function do_cpu_replace() {
	const regex = /(gold|platinum|silver|bronze|.\d?)[ -]?\d{4}[^\s]?(\s?v\d)?/gi

	function build_elements(defs) {
		const element = document.createElement('span')
		defs.forEach(x => {
			if (x.type == 'text') {
				element.appendChild(document.createTextNode(x.value))
			} else {
				const e = document.createElement(x.type)
				e.textContent = x.value
				const style = x.style ? x.style : {}
				Object.keys(style).forEach(k => e.style[k] = x.style[k])
				element.appendChild(e)
			}
		})
		return element
	}

	function replace_text_node(node) {
		let cycles_max = 1024 
		const defs = []
		let text = node.textContent + ''
		while (true) {
			if (cycles_max <= 0) { console.log('max cycles!'); break } else { cycles_max-- }

			const m = text.match(regex)
			if (m == null) {
				break
			}
			const index = text.indexOf(m[0]) + m[0].length

			defs.push({ type: 'text', value: text.substring(0, index) })
			text = text.substring(index + 1)

			const cpu = cpu_data.find(cpu => cpu_fmt(cpu.Product) === cpu_fmt(m[0]))

			let value = '?'
			if (cpu == null) {
				//console.log(`no cpus for ${m[0]}?`)
			} else {
				value = `${cpu['Code Name']} ${cpu.Cores}/${cpu.Threads} ${cpu['TDP(W)']}W` 
			}
			defs.push({ type: 'sup', value, style: { color: 'red' } })
		}
		if (node.parentNode !== null && defs.length !== 0) {
			defs.push({ type: 'text', value: text })
			const element = build_elements(defs)
			node.parentNode.replaceChild(element, node)
		}
	}

	function cpu_replace(node) {
		if (node.nodeType === Node.TEXT_NODE) {
			replace_text_node(node)
		} else {
			node.childNodes.forEach(cpu_replace)
		}
	}

	document.body.childNodes.forEach(cpu_replace)
}

do_cpu_replace()
