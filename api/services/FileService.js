var temp = require('temp'),
    fs   = require('fs'),
    gm = require('gm').subClass({ imageMagick: true }),
    stream = require('stream');

// Automatically track and cleanup files at exit
temp.track();

module.exports = {
    writeFile: function (filename, data, cb) {
        fs.writeFile(filename, data, cb);
    },

    /**
     * Change buffered image to different size
     * @param {Buffer} buf
     * @param {string} filename
     * @param {integer|null} width
     * @param {integer|null} height
     * @param {function} cb
     */
    resizeStreamedFile: function (buf, filename, width, height, cb) {
        gm(buf, filename)
            .identify(function (err, meta) {
                var stream =  gm(buf, filename)
                    .resize(width, height)
                    .toBuffer(function (err, buffer) {
                        cb(meta, buffer);
                    });
            });
    },

    readFile: function (name, cb) {
        fs.readFile(cb);
    }
};