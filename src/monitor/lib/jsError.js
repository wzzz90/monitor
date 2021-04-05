import { getLastEvent } from '../utils/getLastEvent';
import { getSelector } from '../utils/getSelector';

const getLines = (stack) => {
	return stack
		.split('\n')
		.slice(1)
		.map((it) => it.replace(/^\s+at\s+/g, ''))
		.join('->');
};
export function injectJsError() {
	console.log('injectJsError');
	window.addEventListener('error', function (event) {
		let lastEvent = getLastEvent(); //获取最后一个交互事件
		console.log(`window.location`, window.location);
		let log = {
			// title: '', //页面标题
			// url: window.location.href, //访问路径报错
			// timestamp: '1788787878', //访问时间戳
			// userAgent: 'Chrome', //用户浏览器类型
			kind: 'stability', //监控指标大类
			type: 'error', //小类，这是一个错误
			errorType: 'jsError', //错误类型，js执行错误
			messsage: event.message, //报错信息
			filename: event.filename, //访问的文件名
			postition: `${event.lineno}:${event.colno}`, //行列信息
			stack: getLines(event.error.stack), //堆栈信息
			selector: lastEvent ? getSelector(lastEvent.path) : '', // 代表最后一个操作元素
		};
		console.log(`log`, log);
	});
}
