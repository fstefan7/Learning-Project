import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Weather } from '../api/weather.js';

import './body.html';
import './weather.js';


Template.body.onCreated(function () {
    Meteor.subscribe("weather.findAll");
})

Template.body.helpers({
    weatherData() {
        return getAllWeatherData();
    }
});

Template.body.events({
    'submit .new-entry'(event) {
        event.preventDefault();

        const target = event.target;
        const city = target.city.value;

        console.log(city);
        Meteor.call('city.get', city, function(error, result) {
            if (error) {
                sweetAlert("Error", "Please write a correct city name", "error");
                return;
            }

            Meteor.call("weather.insert", result);            
        });
        
        target.city.value = '';
    },
});

function getAllWeatherData() {
    return Weather.find({});
}