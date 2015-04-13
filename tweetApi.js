var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: "7ZkuNkslxLXJReFnZXQiQQYmi",
    consumer_secret: "RaOlbMXzUAhParwL95X9VWQ4j2JEjDvctiAVhnW0LjBBsRGJbM",
    access_token_key: "1068441726-LzsbGEBUWNPoKHyJRMjVCMBLN6T3T9g8nkJrvcK",
    access_token_secret: "rNz13tQIIpat5j4vVUDzzgxXcjQzVrUNyuWbLI6mtjmAX",
});

client.stream('statuses/filter', {track: 'twitter'},  function(stream){
    stream.on('data', function(tweet) {
        console.log(tweet.text);
    });

    stream.on('error', function(error) {
        console.log(error);
    });
});