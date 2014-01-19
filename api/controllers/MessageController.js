/*globals Message:false*/

/**
 * MessageController
 *
 * @module      :: MessageController
 * @description    :: The ability to send messages to other parties.
 */

module.exports = {

    _config: {

    },

    find: function (req, res, next) {
        var user = req.session.user,
            id = user.id;
        Message.find({or:[{to:id}, {from:id}]}).done(function (err, data) {
            if (err) {
                console.error(err);
                res.send(500);
            } else {
                console.log(data);
                if (req.socket) {
                    Message.subscribe(req.socket); //listen for creates
                    Message.subscribe(req.socket, data); //listen for updates or deletes on these only
                }
                if (req.isJson || req.isSocket) {
                    res.send(data);
                } else {
                    res.view({items: data});
                }
            }
        });
    },

    create: function (req, res) {
        var user = req.session.user,
            to = req.param('to'),
            text = req.param('text');

        if (!to || !parseInt(to)) {
            res.send("Missing param 'to'", 400);
        } else if (!text) {
            res.send("Missing param 'text'", 400);
        } else {
            Message.create({
                from: user.id,
                to: parseInt(to),
                text: text,
                sendTime: new Date()
            }).done(function (err, msg) {
                    if (err) {
                        console.log(err);
                        res.send(err, 400);
                    } else {
                        Message.publishCreate(msg.toJSON());
                        res.send(msg);
                    }
                });
        }
    },

    search: function (req, res) {
        var where, user = req.session.user;
        where = req.param('where');
        if (!where) {
            res.send("Missing param 'where'", 400);
        } else {
            try {
                where = JSON.parse(where);
                Message.find()
                    .where(where)
                    .done(function (err, msgs) {
                        if (err) {
                            console.log(err);
                            res.send(err, 400);
                        } else {
                            res.send(msgs);
                        }
                    });
            } catch (ex) {
                res.send(ex.toString(), 400);
            }
        }
    }
};
