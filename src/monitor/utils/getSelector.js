const getSelectors = (path) => {
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
export const getSelector = (path) => {
	if (Array.isArray(path)) {
		return getSelectors(path);
	}
};
