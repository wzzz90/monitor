import userAgent from 'user-agent';
const getExtraData = () => {
	return {
		title: document.title, //页面标题
		url: window.location.href, //访问路径报错
		timestamp: Date.now(), //访问时间戳
		userAgent: userAgent.parse(navigator.userAgent).name, //用户浏览器类型
	};
};
const projectName = 'test-monitor';
const host = 'cn-shanghai.log.aliyuncs.com';
const storeName = 'test-monitor-store';
class SendTracker {
	constructor() {
		this.url = `http://${projectName}.${host}/logstores/${storeName}/track`;
		this.xhr = new XMLHttpRequest();
	}
	send(data = {}) {
		const log = { ...getExtraData(), ...data };
		console.log(`log`, log);
		for (const key in log) {
			if (Object.hasOwnProperty.call(log, key)) {
				typeof log[key] === 'number' && (log[key] = `${log[key]}`);
			}
		}
		let body = JSON.stringify({
			__logs__: [log],
		});
		this.xhr.open('POST', this.url, true);
		this.xhr.setRequestHeader('x-log-apiversion', '0.6.0');
		this.xhr.setRequestHeader('x-log-bodyrawsize', body.length);
		this.xhr.onload = () => {};
		this.xhr.onerror = () => {};
		this.xhr.send(body);
	}
}

export default new SendTracker();
