import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Weather = new Mongo.Collection('weather');

if (Meteor.isServer) {
    Meteor.publish("weather.findAll", function() {
        return getAllWeather(this.userId);
    });
}

Meteor.methods({
    'city.get'(city) {
        check(city, String);
        return getWeather(city);
    },

    'weather.insert'(weather) {
        if (!isValidWeather) {
            throw new Meteor.Error(400, 'Weather has not correct attributes');
        }

        insertOrUpdateWeather(weather);
    },

    'weather.remove'(weatherId) {
        check(weatherId, String);
        Weather.remove(weatherId);
    }
});

function buildWeatherObject(httpResponse) {
    if (!httpResponse || !httpResponse.data) {
        throw new Meteor.Error(400, 'There was a problem with your request')
    }

    const { name, sys, main} = httpResponse.data;
    const { country } = sys;
    const { temp, humidity} = main;
    const date = new Date();
    const weather = {
        city: name,
        country,
        temp,
        humidity,
        feeling: getFeelingValue(temp),
        time: date.toISOString().split('T')[0],
    };
    
    console.log(weather.time)
    return weather;
};

function getWeather(city) {
    if (Meteor.isClient) {
        return;
    }
    try {
        const response = HTTP.call('GET', 'http://api.openweathermap.org/data/2.5/weather', {
          params: { 
            'q': city, 
            'appid': Meteor.settings.weatherApi.appid,
            'units' : Meteor.settings.weatherApi.units
          }
        });

        const weather = buildWeatherObject(response);

        return weather;
      } catch (err) {
        if (!err || !err.response || !err.response.statusCode) {
            console.log(err)
            throw new Meteor.Error(500, 'There was an error calling the API')
        }

        throw new Meteor.Error(err.response.statusCode, 'There was an error processing your request')
      }
};

function getFeelingValue(temperature) {
    if (temperature <= 9)
        return "cold";
    if (temperature < 26) 
        return "normal";
    return "hot";
};

function isValidWeather(weather) {
    if (!weather || !weather.city || !weather.country || 
        !weather.humidity || !weather.feeling) {
        return false;
    }

    return true;
};

function insertOrUpdateWeather(weather) {
    Weather.update(
        { city: weather.city,
            owner: Meteor.userId()
        }, 
        { city: weather.city,
            country: weather.country,
            temp: weather.temp,
            humidity: weather.humidity,
            feeling: weather.feeling,
            time: weather.time,
            owner: Meteor.userId(),
            username: Meteor.user() && Meteor.user().username,
        }, 
        { upsert: true }
    );
};

function getAllWeather(userId) {
    return Weather.find(
        { owner: userId }, 
        { sort: { city: 1 } }
    );
}

