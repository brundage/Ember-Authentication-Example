App = Ember.Application.create();

/*
 * Routing
 */
App.Router = Ember.Router.extend({

    enableLogging: true,

    init: function() {
        this.set('authenticated', false);
        return this._super();
    },

    /* Actions */
    goHome: Ember.State.transitionTo('home'),
    listNews: Ember.State.transitionTo('loggedIn.news.list'),
    beSneaky: Ember.State.transitionTo('loggedIn.news.list'),

    /* "Authentication" method - just toggle the state */
    toggleAuthentication: function() {
        var auth = this.get('authenticated');
        this.set('authenticated', !auth);
        if (auth) {
            this.transitionTo('root.home');
        } else {
            this.transitionTo('loggedIn.home');
        }
    },

    /* Logged out state tree */
    root: Ember.State.extend({
        home: Ember.State.extend({
            connectOutlets: function(router, context) {
                router.get('applicationController').connectOutlet(App.HomeView);
            }
        })
    }),

    /* Authenticated state tree */
    loggedIn: Ember.State.extend({

        /* Enter checks user is authenticated */
        enter: function(manager, transition, async, resume) {
            console.log('logging in (authenticated ' + manager.get('authenticated') + ')');

            var appController = manager.get('applicationController');
            if (manager.get('authenticated')) {
                appController.setFlashMessage('Logged In');
                this._super();
            } else {
                appController.setFlashMessage('Unauthorized!');
                manager.transitionTo('root.home');
            }
        },

        /* Exit sets authenticated to false just to be sure */
        exit: function(manager, transition, async, resume) {
            manager.get('applicationController').setFlashMessage('Logged Out');
            manager.set('authenticated', false);
            this._super();
        },

        /* Sub-states */
        home: Ember.State.extend({
            connectOutlets: function(router, context) {
                router.get('applicationController').connectOutlet(App.HomeView);
            }
        }),

        news: Ember.State.extend({

            list: Ember.State.extend({
                connectOutlets: function(router, context) {
                    router.get('applicationController').connectOutlet(App.ListNewsView);
                }
            })
        })
    })
});

/* Application Controller */
App.ApplicationController = Ember.Controller.extend({

    authenticatedBinding: Ember.Binding.oneWay('App.stateManager.authenticated'),

    setFlashMessage: function(message) {
        this.set("flashMessage", message);
    },

    userName: function() {
        if (this.get('authenticated')) {
            return 'friend';
        } else {
            return '';
        }
    }.property('authenticated')
});

App.ApplicationView = Ember.View.extend({
    templateName: 'application'
});

/* Navigation */
App.NavigationView = Ember.View.extend({
    templateName: 'navigation'
});

/* Home */
App.HomeView = Ember.View.extend({
    templateName: 'home'
});

/* News */
App.ListNewsView = Ember.View.extend({
    templateName: 'listNews'
});
App.ListNewsController = Ember.ArrayController.extend({
    content: [
        {
        text: "Google buys jsFiddle"},
    {
        text: "genderizer named best ruby gem of 2012"},
    {
        text: "Get your eggs unscrambled here."}
    ],
    
    authenticatedBinding : Ember.Binding.oneWay('App.stateManager.authenticated')
});

jQuery(document).ready(function() { App.initialize(); } );
