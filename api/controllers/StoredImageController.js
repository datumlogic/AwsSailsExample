/**
 * StoredImageController
 *
 * @module      :: Controller
 * @description    :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to StoredImageController)
     */
    _config: {
        Bucket: "ci0k10u9fexsopeay5vyavmx6q"
    },

    find: function (req, res) {
        //var user = req.session.user,
        //    id = user.id;
        StoredImage.find().done(function (err, data) {
            if (err) {
                console.error(err);
                res.send(500);
            } else {
                console.log(data);
                if (req.socket) {
                    StoredImage.subscribe(req.socket); //listen for creates
                    StoredImage.subscribe(req.socket, data); //listen for updates or deletes on these only
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
            body = req.param("body");

        StoredImage.create({
            //owner: user.id,
            body: body
        }).done(function (err, msg) {
                if (err) {
                    console.log(err);
                    res.send(err, 400);
                } else {
                    StoredImage.publishCreate(msg.toJSON());
                    res.send(msg);
                }
            });
    }
};
