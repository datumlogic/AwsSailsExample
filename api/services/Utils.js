module.exports = {
    addIfExists: function (obj, key, value) {
        if (value){
            obj[key] = value;
        }
    }
};