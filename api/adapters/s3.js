var AWS = require('awk-sdk'),
    _ = require('underscore');

//{ "accessKeyId": "akid", "secretAccessKey": "secret", "region": "us-west-2" }
AWS.config.loadFromPath('./config.json');

module.exports = (function() {

    // You'll want to maintain a reference to each collection
    // (aka model) that gets registered with this adapter.
    var _modelReferences = {};



    // You may also want to store additional, private data
    // per-collection (esp. if your data store uses persistent
    // connections).
    //
    // Keep in mind that models can be configured to use different databases
    // within the same app, at the same time.
    //
    // i.e. if you're writing a MariaDB adapter, you should be aware that one
    // model might be configured as `host="localhost"` and another might be using
    // `host="foo.com"` at the same time.  Same thing goes for user, database,
    // password, or any other config.
    //
    // You don't have to support this feature right off the bat in your
    // adapter, but it ought to get done eventually.
    //
    // Sounds annoying to deal with...
    // ...but it's not bad.  In each method, acquire a connection using the config
    // for the current model (looking it up from `_modelReferences`), establish
    // a connection, then tear it down before calling your method's callback.
    // Finally, as an optimization, you might use a db pool for each distinct
    // connection configuration, partioning pools for each separate configuration
    // for your adapter (i.e. worst case scenario is a pool for each model, best case
    // scenario is one single single pool.)  For many databases, any change to
    // host OR database OR user OR password = separate pool.
    var _dbPools = {};

    var adapter = {
        syncable: true, // to track schema internally

        defaults: {
            host: 'localhost',
            database: 'sails',
            port: 27017,
            user: null,
            password: null,
            schema: false,
            nativeParser: false,
            safe: true,
            url: null
        },

        /**
         *
         * This method runs when a model is initially registered
         * at server-start-time.  This is the only required method.
         *
         * @param  {{identity:*}}   collection [description]
         * @param  {Function} cb         [description]
         */
        registerCollection: function(collection, cb) {

            // Keep a reference to this collection
            _modelReferences[collection.identity] = collection;

            return cb();
        },


        /**
         * Fired when a model is unregistered, typically when the server
         * is killed. Useful for tearing-down remaining open connections,
         * etc.
         *
         * @param  {Function} cb [description]
         * @return {[type]}      [description]
         */
        teardown: function(cb) {


            cb();
        },



        /**
         *
         * REQUIRED method if integrating with a schemaful
         * (SQL-ish) database.
         *
         * @param  {[type]}   collectionName [description]
         * @param  {[type]}   definition     [description]
         * @param  {Function} cb             [description]
         * @return {[type]}                  [description]
         */
        define: function(collectionName, definition, cb) {

            // If you need to access your private data for this collection:
            var collection = _modelReferences[collectionName];

            // Define a new "table" or "collection" schema in the data store
            cb();
        },

        /**
         *
         * REQUIRED method if integrating with a schemaful
         * (SQL-ish) database.
         *
         * @param  {[type]}   collectionName [description]
         * @param  {Function} cb             [description]
         * @return {[type]}                  [description]
         */
        describe: function(collectionName, cb) {

            // If you need to access your private data for this collection:
            var collection = _modelReferences[collectionName];

            // Respond with the schema (attributes) for a collection or table in the data store
            var attributes = {};
            cb(null, attributes);
        },


        /**
         *
         *
         * REQUIRED method if integrating with a schemaful
         * (SQL-ish) database.
         *
         * @param  {[type]}   collectionName [description]
         * @param  {[type]}   relations      [description]
         * @param  {Function} cb             [description]
         * @return {[type]}                  [description]
         */
        drop: function(collectionName, relations, cb) {
            // If you need to access your private data for this collection:
            var collection = _modelReferences[collectionName];

            // Drop a "table" or "collection" schema from the data store
            cb();
        },




        // OVERRIDES NOT CURRENTLY FULLY SUPPORTED FOR:
        //
        // alter: function (collectionName, changes, cb) {},
        // addAttribute: function(collectionName, attrName, attrDef, cb) {},
        // removeAttribute: function(collectionName, attrName, attrDef, cb) {},
        // alterAttribute: function(collectionName, attrName, attrDef, cb) {},
        // addIndex: function(indexName, options, cb) {},
        // removeIndex: function(indexName, options, cb) {},



        /**
         *
         * REQUIRED method if users expect to call Model.find(), Model.findOne(),
         * or related.
         *
         * You should implement this method to respond with an array of instances.
         * Waterline core will take care of supporting all the other different
         * find methods/usages.
         *
         * @param  {[type]}   collectionName [description]
         * @param  {[type]}   options        [description]
         * @param  {Function} cb             [description]
         * @return {[type]}                  [description]
         */
        find: function(collectionName, options, cb) {

            // If you need to access your private data for this collection:
            var collection = _modelReferences[collectionName];

            // Options object is normalized for you:
            //
            // options.where
            // options.limit
            // options.skip
            // options.sort

            // Filter, paginate, and sort records from the datastore.
            // You should end up w/ an array of objects as a result.
            // If no matches were found, this will be an empty array.

            var s3 = new AWS.S3();
            s3.listObjects({bucket: "", key: ""}, function (err, data) {
                // Respond with error or an array of updated records.
                console.log(err, data);
                cb(err, data);
            });
            s3.getObject({
                Bucket: "",
                //ETag has to match this or 412
                IfMatch: "",
                //Must be modified or 304
                IfModifiedSince: new Date(),
                //Only if ETag is different or 304
                IfNoneMatch: "",
                Key: "",
                ResponseCacheControl: "",
                ResponseContentDisposition: "",
                ResponseContentEncoding: "",
                ResponseContentLanguage: "",
                ResponseContentType: "",
                ResponseExpires: "",
                VersionId: ""
            }, function (err, data) {
                // Respond with error or an array of updated records.
                console.log(err, data);
                cb(err, data);
            });
        },

        /**
         *
         * REQUIRED method if users expect to call Model.create() or any methods
         *
         * @param  {[type]}   collectionName [description]
         * @param  {[type]}   values         [description]
         * @param  {Function} cb             [description]
         * @return {[type]}                  [description]
         */
        create: function(collectionName, values, cb) {
            // If you need to access your private data for this collection:
            var collection = _modelReferences[collectionName];

            // Create a single new model (specified by `values`)
            var s3 = new AWS.S3();
            s3.putObject({
                //private|public-read|public-read-write|authenticated-read|
                // bucket-owner-read|bucket-owner-full-control
                ACL: "",
                Body: new Buffer(),
                Bucket: "",
                CacheControl: "",
                ContentDisposition: "",
                ContentLanguage: "",
                ContentLength: "",
                ContentMD5: "",
                Expires: new Date(),
                GrantFullControl: "",
                GrantRead: "",
                GrantReadACP: "",
                GrantWriteACP: "",
                Key: "",
                //map<string>
                Metadata: new Map(),
                ServerSideEncryption: "AES256",
                //STANDARD|REDUCED_REDUNDANCY
                StorageClass: "",
                WebsiteRedirectLocation: ""
            }, function (err, data) {
                var eTag = data.ETag,
                    expiration = data.Expiration,
                    serverSideEncryption = data.ServerSideEncryption,
                    versionId = data.VersionId;
                    console.log(eTag, expiration, serverSideEncryption, versionId);
                cb(null, data);
            });
        },



        //

        /**
         *
         *
         * REQUIRED method if users expect to call Model.update()
         *
         * @param  {[type]}   collectionName [description]
         * @param  {[type]}   options        [description]
         * @param  {[type]}   values         [description]
         * @param  {Function} cb             [description]
         * @return {[type]}                  [description]
         */
        update: function(collectionName, options, values, cb) {

            // If you need to access your private data for this collection:
            var collection = _modelReferences[collectionName];

            // 1. Filter, paginate, and sort records from the datastore.
            //    You should end up w/ an array of objects as a result.
            //    If no matches were found, this will be an empty array.
            //
            // 2. Update all result records with `values`.
            //
            // (do both in a single query if you can-- it's faster)

            throw new Error("Not supported yet.");
            /*
            var s3 = new AWS.S3();
            s3.getObject({bucket: "", key: ""}, function (err, data) {
                // Respond with error or an array of updated records.
                console.log(err, data);
                cb(err, data);
            });
            */
        },

        /**
         *
         * REQUIRED method if users expect to call Model.destroy()
         *
         * @param  {[type]}   collectionName [description]
         * @param  {[type]}   options        [description]
         * @param  {Function} cb             [description]
         * @return {[type]}                  [description]
         */
        destroy: function(collectionName, options, cb) {

            // If you need to access your private data for this collection:
            var collection = _modelReferences[collectionName];

            // 1. Filter, paginate, and sort records from the datastore.
            //    You should end up w/ an array of objects as a result.
            //    If no matches were found, this will be an empty array.
            //
            // 2. Destroy all result records.
            //
            // (do both in a single query if you can-- it's faster)

            var s3 = new AWS.S3();
            s3.destroyObject({bucket: "", key: ""}, function (err, data) {
                // Respond with error or an array of updated records.
                console.log(err, data);
                cb(err, data);
            });
        },



        /*
         **********************************************
         * Optional overrides
         **********************************************

         // Optional override of built-in batch create logic for increased efficiency
         // (since most databases include optimizations for pooled queries, at least intra-connection)
         // otherwise, Waterline core uses create()
         createEach: function (collectionName, arrayOfObjects, cb) { cb(); },

         // Optional override of built-in findOrCreate logic for increased efficiency
         // (since most databases include optimizations for pooled queries, at least intra-connection)
         // otherwise, uses find() and create()
         findOrCreate: function (collectionName, arrayOfAttributeNamesWeCareAbout, newAttributesObj, cb) { cb(); },
         */


        /*
         **********************************************
         * Custom methods
         **********************************************

         ////////////////////////////////////////////////////////////////////////////////////////////////////
         //
         // > NOTE:  There are a few gotchas here you should be aware of.
         //
         //    + The collectionName argument is always prepended as the first argument.
         //      This is so you can know which model is requesting the adapter.
         //
         //    + All adapter functions are asynchronous, even the completely custom ones,
         //      and they must always include a callback as the final argument.
         //      The first argument of callbacks is always an error object.
         //      For core CRUD methods, Waterline will add support for .done()/promise usage.
         //
         //    + The function signature for all CUSTOM adapter methods below must be:
         //      `function (collectionName, options, cb) { ... }`
         //
         ////////////////////////////////////////////////////////////////////////////////////////////////////


         // Custom methods defined here will be available on all models
         // which are hooked up to this adapter:
         //
         // e.g.:
         //
         foo: function (collectionName, options, cb) {
         return cb(null,"ok");
         },
         bar: function (collectionName, options, cb) {
         if (!options.jello) return cb("Failure!");
         else return cb();
         }

         // So if you have three models:
         // Tiger, Sparrow, and User
         // 2 of which (Tiger and Sparrow) implement this custom adapter,
         // then you'll be able to access:
         //
         // Tiger.foo(...)
         // Tiger.bar(...)
         // Sparrow.foo(...)
         // Sparrow.bar(...)


         // Example success usage:
         //
         // (notice how the first argument goes away:)
         Tiger.foo({}, function (err, result) {
         if (err) return console.error(err);
         else console.log(result);

         // outputs: ok
         });

         // Example error usage:
         //
         // (notice how the first argument goes away:)
         Sparrow.bar({test: 'yes'}, function (err, result){
         if (err) console.error(err);
         else console.log(result);

         // outputs: Failure!
         })




         */


    };


    // Expose adapter definition
    return adapter;

})();