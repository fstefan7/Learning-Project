Create an app which respects the following user stories:

1. As a user I can use the app as a registered or non-registered user.
2.  As a user I can use a text input to enter a city name (Bonus: autocompletion)
3. As a user pressing enter on the text input, I get a widget added on my screen containing the following info: temperature, humidity, feeling. Temperature and humidity to be obtained from https://openweathermap.org/api. 'Feeling' value to be determined based on temperature using the following criteria:
    - <= 9º => 'cold'
    - 10º-25º => 'normal'
    - >= 26º => 'hot'
4. As a user I can remove widgets from my dashboard by clicking a button on them.
5. As a registered user, my widgets are stored and when I come back to the app repopulated. (Bonus: same behaviour for non-registered users)

TIPS:
- focus on bonus tasks last
- commit code whenever you're done with a task