var Twit = require('twit');
var config = require('./config');
var http = require('http');

var T = new Twit({
  consumer_key:          config.twitConsumerKey,
  consumer_secret:       config.twitConsumerSecret,
  access_token:          config.twitAccessToken,
  access_token_secret:   config.twitAccessTokenSecret,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests. 
});

var myVar = setInterval(function(){getLastReplyTo()}, 180000);

//getLastReplyTo();

/*
get the most recent mentions not be replyed
*/
function getMentions(since_id) {
	T.get('statuses/mentions_timeline', {since_id: since_id}, function(err, data, response) {
		for (res in data){
			if (data[res].id == since_id) {
				break;
			};
			if (data[res].text) {
				var city = data[res].text.replace("@weather_robot","");
				var replytoStatus = data[res].id_str;
				var replytoUser = data[res].user.screen_name;
				if (city) {
					getWeather(city,replytoStatus,replytoUser);
				}else{
					var text = "please tell me a city name @" + replytoUser;
					postTweet(text,replytoStatus);
			};
			};
		}
	});
}

/*
get the weather of the city given
*/
function getWeather(city, replytoStatus, replytoUser) {
	options = "http://api.openweathermap.org/data/2.5/forecast/city?q="+ city + "&APPID=" + config.weatherMapKey;
	http.get(options, function(data) {
		var res='';
		data.on('data', function (chunk) {
			res = res + chunk;
		});
		data.on('end',function(){
			result = JSON.parse(res);
			if (result.cod=='200') {
				var resCity = result.city.name;
				var weather = result.list[1].weather[0].description;
				var tempMin = (result.list[1].main.temp_min -273.15).toFixed(2);
				var tempMax = (result.list[1].main.temp_max -273.15).toFixed(2);
				var text = "weather of " + resCity + " in three hours: " + weather + ", temperature: " + tempMin + "°C ~ " + tempMax + "°C. @" + replytoUser;
				postTweet(text,replytoStatus);
			} else if(result.message=='Error: Not found city'){
				var text = "sorry, I can't find this city @" + replytoUser;
				postTweet(text,replytoStatus);
			} else{
				console.log(result);
			};
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
}

/*
post a tweet to reply
*/
function postTweet (status, replytoStatus) {
	T.post('statuses/update', {status: status, in_reply_to_status_id: replytoStatus},function(err, data, response) {
		console.log(data);
	});
}

/*
get the last tweet which have been replyed
*/
function getLastReplyTo(){
	T.get('statuses/user_timeline', {screen_name: 'weather_robot'}, function(err, data, response) {
		var replytoStatus = data[0].in_reply_to_status_id;
		getMentions(replytoStatus);
	});
}