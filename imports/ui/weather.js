import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import './weather.html';

Template.weather.events({
    'click .delete'() {
        Meteor.call('weather.remove', this._id);
    }
});