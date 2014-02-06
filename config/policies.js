/**
 * Policy mappings (ACL)
 *
 * Policies are simply Express middleware functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect just one of its actions.
 *
 * Any policy file (e.g. `authenticated.js`) can be dropped into the `/policies` folder,
 * at which point it can be accessed below by its filename, minus the extension, (e.g. `authenticated`)
 *
 * For more information on policies, check out:
 * http://sailsjs.org/#documentation
 */


module.exports.policies = {

    '*': true,

    UserController: {
        '*': true,
        'find': 'isAdmin',
        'create': 'isAdmin',
        'destroy': 'isAdmin',
        'update': 'isAdmin'
    },

    MessageController: {
        '*': 'isAuthenticated'
    },

    ReminderController: {
        '*': 'isAuthenticated'
    },

    StoredImageController: {
        'create': ["isAuthenticated", "isSelf"],
        'destroy': ["isAuthenticated", "isSelf"],
        'update': ["isAuthenticated", "isSelf"],
        '*': "isAuthenticated"
    },

    SchemaController: {
        '*': "isAuthenticated"
    },

    LocationController: {
        'create': ["isAuthenticated", "isSelf"],
        'destroy': ["isAuthenticated", "isSelf"],
        'update': ["isAuthenticated", "isSelf"],
        '*': "isAuthenticated"
    }

  /*
	// Here's an example of adding some policies to a controller
	RabbitController: {

		// Apply the `false` policy as the default for all of RabbitController's actions
		// (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
		'*': false,

		// For the action `nurture`, apply the 'isRabbitMother' policy 
		// (this overrides `false` above)
		nurture	: 'isRabbitMother',

		// Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
		// before letting any users feed our rabbits
		feed : ['isNiceToAnimals', 'hasRabbitFood']
	}
	*/
};
