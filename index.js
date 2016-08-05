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
    if (error) {
      console.log(error, error.stack)
    } else {
      upload(tweets)
      invalidate()
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
    ContentType: 'application/json',
    CacheControl: process.env.AWS_S3_CACHE_CONTROL
  }

  console.log('Uploading to S3 bucket...')

  s3.upload(params, function (error, data) {
    if (error) {
      console.log(error, error.stack)
    } else {
      console.log('Sucessfully uploaded tweets.json to S3')
    }
  })
}

function invalidate () {
  const cloudfront = new AWS.CloudFront()

  let params = {
    DistributionId: process.env.AWS_CLOUDFRONT_DISTRIBUTION,
    InvalidationBatch: {
      CallerReference: '' + new Date().getTime(),
      Paths: {
        Quantity: 1,
        Items: [
          '/' + process.env.AWS_S3_KEY
        ]
      }
    }
  }

  console.log('Invalidating CloudFront distribution...')

  cloudfront.createInvalidation(params, function (error, data) {
    if (error) {
      console.log(error, error.stack)
    } else {
      console.log('Sucessfully invalidated tweets.json on CloudFront')
    }
  })
}
