import tracker from '../utils/tracker';
export const injectXHR = () => {
	let XMLHttpRequest = window.XMLHttpRequest;
	let openOpen = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function (method, url, async) {
		if (!url.match(/logstores/) && !url.match(/sockjs/)) {
			this.logData = { method, url, async };
		}
		return openOpen.apply(this, arguments);
	};

	let openSend = XMLHttpRequest.prototype.send;
	XMLHttpRequest.prototype.send = function (body) {
		let startTime;
		if (this.logData) {
			startTime = Date.now();
			const handler = (type) => (event) => {
				console.log(`event`, event);
				let duration = Date.now() - startTime;
				let status = this.status;
				let statusText = this.statusText;
				tracker.send({
					kind: 'stability',
					type: 'xhr',
					eventType: type, //load,error,abort
					pathname: this.logData.url, //请求路径
					status: status + '-' + statusText, //状态码
					duration, //持续时间
					response: this.response //响应题
						? JSON.stringify(this.response)
						: '',
					params: body || '',
				});
			};
			this.addEventListener('load', handler('load'), false);
			this.addEventListener('error', handler('error'), false);
			this.addEventListener('abort', handler('abort'), false);
		}
		return openSend.apply(this, arguments);
	};
};
