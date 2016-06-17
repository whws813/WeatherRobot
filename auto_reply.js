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


//getLastReplyTo();
//getMentions(LASTREPLYTO);
getWeather("troyes");



/*
get the most recent mentions not be replyed
*/
function getMentions(since_id) {
	T.get('statuses/mentions_timeline', {since_id: since_id}, function(err, data, response) {
		for (res in data){
			if (data[res].id == since_id) {
				break;
			};
			//var text = data[res].text;
			var city = data[res].text.replace("@weather_robot","");
			getWeather(city);
			var replyto = data[res].id;
			//getWeather(city);
		}
		//console.log(JSON.stringify(data,null,2))
	});
}

function getWeather(city) {
	options = "http://api.openweathermap.org/data/2.5/forecast/city?q="+ city + "&APPID=" + config.weatherMapKey;
	http.get(options, function(data) {
		//console.log(data);
		var res='';
		data.on('data', function (chunk) {
			res = res + chunk;
		});
		data.on('end',function(){
			//var res1 = res.search(/"weather"/);
			res1 = JSON.parse(res);
			console.log(res1.list[1]);
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
}

function postTweet (status, replyto) {
	T.post('statuses/update', {status: status, in_reply_to_status_id: replyto},function(err, data, response) {
		console.log(data);
	});
}

/*
get the last tweet which have been reply
*/
function getLastReplyTo(){
	T.get('statuses/user_timeline', {screen_name: 'weather_robot'}, function(err, data, response) {
		getMentions(data[0].in_reply_to_status_id);
	});
}