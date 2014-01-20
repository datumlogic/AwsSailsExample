/**
 * StoredImage
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    adapter: 's3',
    attributes: {
        "body": {
            type: "string",
            required: true
        }
    }
};
