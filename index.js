'use strict'

const Twitter = require('twitter')
const AWS = require('aws-sdk')

require('dotenv').config()

exports.handler = function (event, context, callback) {
  let twitter = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  })

  let params = {
    screen_name: process.env.TWITTER_SCREEN_NAME
  }

  twitter.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      upload(tweets)
    } else {
      console.log(error, error.stack)
    }
  })
}

function upload (data) {
  let s3 = new AWS.S3()
  data.length = 2

  let params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: process.env.AWS_S3_KEY,
    Body: JSON.stringify(data),
    ContentType: 'application/json'
  }

  s3.upload(params, function (error, data) {
    if (error) {
      console.log(error, error.stack)
    }
  })
}
