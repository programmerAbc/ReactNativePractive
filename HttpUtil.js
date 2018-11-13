export default class HttpUtil {
    static fetchWithTimeout(promise, ms = 2000) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => { reject(new Error("timeout")) }, ms)
            promise.then((response) => {
                clearTimeout(timeoutId)
                resolve(response);
            })
                .catch((err) => {
                    clearTimeout(timeoutId)
                    reject(err)
                })
        })
    }
}