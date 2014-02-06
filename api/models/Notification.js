/**
 * Notification
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    adapter: 'dynamodb',
    autoPK: false,
    autoCreatedAt: true,
    autoUpdatedAt: false,
    migrate: 'alter',

    attributes: {

        email: {
            type: 'string',
            index: 'hash',
            email: true
        },

        time: {
            type: 'datetime',
            index: 'range'
        }

    }
};
