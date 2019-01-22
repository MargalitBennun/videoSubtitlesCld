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
const loadJSON = (filepath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, 'utf8', (err, content) => {
            if(err) {
                reject(err)
            } else {
                try {
                    resolve(JSON.parse(content));
                } catch(err) {
                    reject(err)
                }
            }
        })
    });
}


export {
    template,
    loadJSON,
}

