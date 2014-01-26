

module.exports = {

    findOne: function (modelClass, id, req, res, transformCb) {
        modelClass.findOne(id).done(function (err, item) {
            if (err) {
                console.error(err);
                res.send(500);
            } else {
                if (req.socket) {
                    modelClass.subscribe(req.socket, id); //listen for updates or deletes on these only
                }
                if (req.isJson || req.isSocket) {
                    res.send(transformCb(item));
                } else {
                    res.view({items: [transformCb(item)]});
                }
            }
        });
    },

    findMany: function (modelClass, req, res) {
        modelClass.find().done(function (err, data) {
            if (err) {
                console.error(err);
                res.send(500);
            } else {
                if (req.socket) {
                    modelClass.subscribe(req.socket); //listen for creates
                    modelClass.subscribe(req.socket, data); //listen for updates or deletes on these only
                }
                if (req.isJson || req.isSocket) {
                    res.send(data);
                } else {
                    res.view({items: data});
                }
            }
        });
    }
};