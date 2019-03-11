import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Weather } from '../api/weather.js';
import { ReactiveVar } from 'meteor/reactive-var';

import './body.html';
import './weather.js';


Template.body.onCreated(function () {
    Meteor.subscribe("weather.findAll");
    this.unregistredUserData = new ReactiveVar([]);
})

Template.body.helpers({
    weatherData() {
        const isLoggedInUser = Meteor.user();
        return getAllWeatherData(isLoggedInUser);
    },

    userData: function () {
        return Template.instance().unregistredUserData;
      }
});

Template.body.events({
    'submit .new-entry'(event, instance) {
        event.preventDefault();

        const target = event.target;
        const city = target.city.value;

        Meteor.call('city.get', city, function(error, result) {
            if (error) {
                sweetAlert("Error", "Please write a correct city name", "error");
                return;
            }

            if(Meteor.user()) {
                Meteor.call("weather.insert", result, instance.unregistredUserData);            
            } else {
                addWeatherForUnregisteredUser(instance, result)
            }
        });

        target.city.value = '';
    },
});

function getAllWeatherData(isLoggedInUser) {
    if (isLoggedInUser) {
        return Weather.find({});
    } else {
        const instance = Template.instance();
        return instance.unregistredUserData.get();
    }
}

function addWeatherForUnregisteredUser(instance, result) {
    let userData = instance.unregistredUserData.get();

    if (userData.find(data => data.city == result.city)) {
        sweetAlert("Error", "City already added", "error");
    } else {
        userData.push(result);
        instance.unregistredUserData.set(userData)
    }
}