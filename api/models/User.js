var bcrypt = require('bcrypt');

/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {

    schema: true,

    attributes: {
        email: {
            type: 'string',
            required: true,
            unique: true,
            email: true,
            index: true
        },
        password: {
            type: 'string',
            required: true,
            minLength: 6,

        },
        validation: {
            type: 'json',
            defaultsTo: {}
        },
        lastLoggedIn: {
            type: 'datetime',
            required: false
        },
        firstName: {
            type: 'string',
            lowercase: true
        },
        lastName: {
            type: 'string',
            lowercase: true
        },
        fullName: function () {
            return this.firstName + ' ' + this.lastName;
        },
        verifyPassword: function (password, callback) {
            bcrypt.compare(password, this.password, callback);
        },
        toJSON: function () {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        }
    },



    beforeCreate: function (values, next) {
        bcrypt.hash(values.password, 10, function (err, hash) {
            if (!err) {
                values.password = hash;
            }
            next(err);
        });
    }

};
