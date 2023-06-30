// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...params: any[]) => any;

function throttle<T extends AnyFn>(callback: T, limit = 100) {
    let waiting = false;
    return function (...args: Parameters<T>) {
        if (!waiting) {
            callback(...args);
            waiting = true;
            setTimeout(function () {
                waiting = false;
            }, limit);
        }
    };
}

export default throttle;
