/*globals sails*/

module.exports = {

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to NotificationController)
     */
    _config: {
    },

    find: function (req, res) {
        var models = _.map(sails.models, function (model, name) {
            return {
                name: name,
                attributes: model.attributes,
                validator: model._validator.validations,
                schema: model._schema.schema
            }
        });

        console.log(sails);

        res.send({models: models});
    }


};