var Twitter = require('twitter');
var AWS = require('aws-sdk');

require('dotenv').config();

exports.handler = function(event, context, callback) {
    var twitter = new Twitter({
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token_key: process.env.ACCESS_TOKEN_KEY,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
    });

    var params = {
        screen_name: 'campingbabble'
    };

    twitter.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            upload(tweets);
        }
        else {
            console.log(error, error.stack);
        }
    });
};

function upload(data) {
    var s3 = new AWS.S3();

    params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: process.env.AWS_S3_KEY,
        Body: JSON.stringify(data)
    };

    s3.upload(params, function(error, data) {
        if (error) {
            console.log(err, err.stack);
        }
    });
}
