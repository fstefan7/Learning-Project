import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import './weather.html';

Template.weather.onCreated(function () {
    this.weather = Template.instance().data.weather;
    this.allWeatherData = Template.instance().data.allWeatherData.get();
  });

Template.weather.events({
    'click .delete'() {
        removeWeatherData(this.weather._id, Meteor.user(), this.weather.city);
    }
});

function removeWeatherData(id, isLoggedIn, city) {
    if (isLoggedIn) {
        Meteor.call('weather.remove', id);
    } else {
        let allWeatherData = Template.instance().data.allWeatherData.get();

        allWeatherData = allWeatherData.filter(data =>
            data.city !== city
        );

        Template.instance().data.allWeatherData.set(allWeatherData);
    }
}