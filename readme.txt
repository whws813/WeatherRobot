-------------
+++++++++++++
Weather Robot
+++++++++++++
-------------

Cette application est un robot sur Twitter. Quand il y a un tweet qui le mentionne avec le nom d'une ville, le robot va lui répondre avec le météo des prochaines trois heures.

Compte Twitter: WeatherRobot@weather_robot (https://twitter.com/weather_robot)

Github: https://github.com/whws813/WeatherRobot
-------
Exemple
-------
Tweet: troyes @weather_robot
Réponse: weather of Troyes of the next hours: light rain, temperature: 13.76°C ~ 16.35°C.

--------------------
Web services utilisés
--------------------
1.Twitter REST APIs (https://dev.twitter.com/rest/public)
	(1)GET statuses/user_timeline (https://dev.twitter.com/rest/reference/get/statuses/user_timeline)
	(2)GET statuses/mentions_timeline (https://dev.twitter.com/rest/reference/get/statuses/mentions_timeline)
	(3)POST statuses/update (https://dev.twitter.com/rest/reference/post/statuses/update)

2.OpenWeatherMap (http://openweathermap.org/)
	(1) 5 days/3 hour forecast API (http://openweathermap.org/forecast5)
--------------
Module utilisé
--------------
twit (https://www.npmjs.com/package/twit)
--------------
Fonctionnement
--------------
1. Environnement: Node.js
2. Exécuter auto_reply.js. Par défaut, le script cherche, chaque 3 minutes, les tweets qui le mentionnent et leurs répondre.
3. Pour exécuter qu'une seul fois:
	(1) commenter la ligne 13: var myVar = setInterval(function(){getLastReplyTo()}, 180000);
	(2) décommenter la ligne 15: getLastReplyTo();