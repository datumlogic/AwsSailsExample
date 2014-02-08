/*globals FileService, Buffer, StoredImage */

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

var log = log || console.log;

function applyStringifyAndFlattenTo (from, to) {
    if (from && to) {
        var metaTags = ['format', 'Mime type', 'size'];
        _.each(metaTags, function (value) {
            if (_.isString(from[value]) || _.isNumber(from[value])) {
                to[value] = from[value].toString();
            } else if (_.isObject(from[value])) {
                _.forOwn(from[value], function (value, key) {
                    if (_.isString(from[value]) || _.isNumber(from[value])) {
                        to[key] = value.toString();
                    }
                })
            }
        });
    }
}

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
        var id = req.param('id');
        if (id) {
            BaseController.findOne(StoredImage, id, req, res, function (item) {
                /**
                 * For stored images, we want to return them as base64.  The client should be requesting them
                 * with an XHR, and should be prepared for the request to fail (perhaps due to permissions).
                 *
                 * If they successfully get the image with the XHR, then they can put it in an img tag.
                 */
                if (item && item.Body) {
                    if (item.Metadata && item.Metadata.base64prefix) {
                        item.Body = item.Metadata.base64prefix + item.Body.toString('base64');
                    }
                }

                return item;
            });
        } else {
            BaseController.findMany(StoredImage, req, res);
        }
    },

    create: function (req, res) {
        var user = req.session.user,
            body = req.param("body");

        var base64Prefix = /^[^,]*/.exec(body)[0] + ",";
        body = body.substring(base64Prefix.length);
        var buffer = new Buffer(body, "base64"),
            Metadata = {
                base64prefix: base64Prefix
            };

        FileService.resizeStreamedFile(buffer, "jpg", 800, 600, function (meta, data) {

            if (Buffer.isBuffer(data)) {
                log("isBuffer", data.toString('base64').substring(0, 100))
            }

            if (data.on) {
                data.on('error', function (err) {
                    console.error(JSON.stringify(err));
                });
            }

            applyStringifyAndFlattenTo(meta, Metadata);
            log("metadata", Metadata);

            StoredImage.create({
                //owner: user.id,
                Body: data,
                Metadata: Metadata
            }).done(function (err, msg) {
                    if (err) {
                        console.error(JSON.stringify(err));
                        res.send(err, 400);
                    } else {
                        StoredImage.publishCreate(msg.toJSON());
                        res.send(msg);
                    }
                });
        });
    }
};
