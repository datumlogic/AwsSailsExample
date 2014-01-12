/**
 * Message
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

      from: {
          type: 'string',
          required: true,
          index: true
      },

      to: {
          type: 'string',
          required: true,
          index: true
      },

      text: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 144
      },

      attachment: {
          type: 'string',
          required: false
      }
    
  }

};
