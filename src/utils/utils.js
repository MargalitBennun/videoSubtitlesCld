function template(strings, ...keys) {
    return (function(...values) {
        var dict = values[values.length - 1] || {};
        var result = [strings[0]];
        keys.forEach(function(key, i) {
            var value = Number.isInteger(key) ? values[key] : dict[key];
            result.push(value, strings[i + 1]);
        });
        return result.join('');
    });
}
const TIMEOUT = 10000;
function loadJSON(url) {
    return new Promise((resolve, reject) => {

        let callbackName = 'jsonpCallback';
        let timeoutTrigger = window.setTimeout(function(){
            window[callbackName] = Function.prototype;
            reject(new Error('Timeout'));
        }, TIMEOUT);

        window[callbackName] = function(data){
            window.clearTimeout(timeoutTrigger);
            resolve(data);
        };

        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = url;

        document.getElementsByTagName('head')[0].appendChild(script);

    });
}
// const loadJSON = (filepath) => {
//     return new Promise((resolve, reject) => {
//         fetch(filepath, {
//             method: 'get'
//         }).then(function (response) {
//             resolve(JSON.parse(response));
//         }).catch(function (err) {
//             reject(err);
//         });
//     });
// };


export { template, loadJSON }


