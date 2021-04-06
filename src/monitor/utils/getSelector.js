const getSelectors = (path) => {
	console.log(`path`, path);
	return path
		.reverse()
		.filter((ele) => ele !== document && ele !== window)
		.map((ele) => {
			let selector = '';
			if (ele.id) {
				selector = `${ele.nodeName.toLowerCase()}#${ele.id}`;
			} else if (ele.className && typeof ele.className === 'string') {
				selector = `${ele.nodeName.toLowerCase()}.${ele.className}`;
			} else {
				selector = ele.nodeName.toLowerCase();
			}
			return selector;
		})
		.join(' ');
};
export const getSelector = (pathOrTarget) => {
	//pathOrTarget 对象或数组
	if (Array.isArray(pathOrTarget)) {
		return getSelectors(pathOrTarget);
	} else {
		let path = [];
		while (pathOrTarget) {
			path.push(pathOrTarget);
			pathOrTarget = pathOrTarget.parentNode;
		}
		console.log(`path`, path);
		return getSelectors(path);
	}
};
