module.exports = {

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to DBInstanceController)
     */
    _config: {},

    find: function (req, res) {
        var fs = require('fs');

        var filepath = req.param('filepath');

        fs.stat(filepath, function(err, stats) {
            if (err) {
                res.send(err);
            } else if (stats.isFile()) {
                fs.readFile(filepath, function (err, data) {
                    if (err) res.send(err);
                    else res.send(data);
                });
            } else {
                fs.readdir(filepath, function (err, data) {
                    if (err) res.send(err);
                    else res.send(data);
                });
            }
        })
    }
};
