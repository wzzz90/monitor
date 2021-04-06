import { getLastEvent } from '../utils/getLastEvent';
import { getSelector } from '../utils/getSelector';
import tracker from '../utils/tracker';

const getLines = (stack) => {
	return stack
		.split('\n')
		.slice(1)
		.map((it) => it.replace(/^\s+at\s+/g, ''))
		.join('->');
};
export function injectJsError() {
	window.addEventListener(
		'error',
		(event) => {
			console.log(`error event`, event);
			let lastEvent = getLastEvent(); //获取最后一个交互事件
			if (event.target && (event.target.src || event.target.href)) {
				tracker.send({
					kind: 'stability', //监控指标大类
					type: 'error', //小类，这是一个错误
					errorType: 'resourceError', //错误类型，资源加载错误
					filename: event.target.src || event.target.href,
					tagName: event.target.tagName,
					selector: getSelector(event.target), // 代表最后一个操作元素
				});
			} else {
				tracker.send({
					kind: 'stability', //监控指标大类
					type: 'error', //小类，这是一个错误
					errorType: 'jsError', //错误类型，js执行错误
					message: event.message, //报错信息
					filename: event.filename, //访问的文件名
					postition: `${event.lineno}:${event.colno}`, //行列信息
					stack: getLines(event.error.stack), //堆栈信息
					selector: lastEvent ? getSelector(lastEvent.path) : '', // 代表最后一个操作元素
				});
			}
		},
		true
	);

	window.addEventListener(
		'unhandledrejection',
		(event) => {
			console.log(`event`, event);
			let lastEvent = getLastEvent(event);

			let reason = event.reason;
			let message = reason;
			let line = 0;
			let column = 0;
			let stack = '';
			let filename;
			if (typeof reason === 'string') {
				message = reason;
			} else if (typeof reason === 'object') {
				if (reason.stack) {
					let matchResult = reason.stack.match(
						/at\s+(.+):(\d+):(\d+)/
					);
					filename = matchResult[1];
					line = matchResult[2];
					column = matchResult[3];
				}
				message = reason.stack.message;
				stack = getLines(reason.stack);
			}
			tracker.send({
				kind: 'stability', //监控指标大类
				type: 'error', //小类，这是一个错误
				errorType: 'PromiseError', //错误类型，js执行错误
				message, //报错信息
				filename, //访问的文件名
				postition: `${line}:${column}`, //行列信息
				stack, //堆栈信息
				selector: lastEvent ? getSelector(lastEvent.path) : '', // 代表最后一个操作元素
			});
		},
		true
	);
}
