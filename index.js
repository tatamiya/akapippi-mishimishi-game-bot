// 参考サイト
// https://kt-life.net/gas-tweet-bot/
// https://officeforest.org/wp/2021/05/22/google-apps-script%E3%81%8B%E3%82%89twitter-api-v2%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E3%81%99%E3%82%8B/

// Thanks to @Tkonsoy (https://twitter.com/Tkonsoy)
// https://twitter.com/Tkonsoy/status/1529688689802375168?s=20&t=3avC0I2HUqrFvYljLumIvQ

// 2025/04/26更新
// TwitterWebService が GAS の Library から消えたので、下記の記事を参考に書き換えた：
// https://funrepeat.com/fr-note/5212
// 参照コード: https://gist.github.com/M-Igashi/750ab08718687d11bff6322b8d6f5d90

var userProperties = PropertiesService.getScriptProperties();
var TWITTER_API_KEY = userProperties.getProperty('TWITTER_API_KEY');
var TWITTER_API_KEY_SECRET = userProperties.getProperty('TWITTER_API_KEY_SECRET');

'use strict';

function getInstance(consumer_key, consumer_secret) {
  return new TwitterWebService_(consumer_key, consumer_secret);
}

var TwitterWebService_ = function (consumer_key, consumer_secret) {
  this.consumer_key = consumer_key;
  this.consumer_secret = consumer_secret;
}

TwitterWebService_.prototype.getService = function () {
  return OAuth1.createService('Twitter')
    .setAccessTokenUrl('https://api.twitter.com/oauth/access_token')
    .setRequestTokenUrl('https://api.twitter.com/oauth/request_token')
    .setAuthorizationUrl('https://api.twitter.com/oauth/authorize')
    .setConsumerKey(this.consumer_key)
    .setConsumerSecret(this.consumer_secret)
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
}

TwitterWebService_.prototype.authorize = function () {
  var service = this.getService();
  if (service.hasAccess()) {
    Logger.log('Already authorized');
  } else {
    var authorizationUrl = service.authorize();
    Logger.log('Open the following URL and re-run the script: %s', authorizationUrl);
  }
}

TwitterWebService_.prototype.reset = function () {
  var service = this.getService();
  service.reset();
}

TwitterWebService_.prototype.authCallback = function (request) {
  var service = this.getService();
  var isAuthorized = service.handleCallback(request);
  var mimeType = ContentService.MimeType.TEXT;
  if (isAuthorized) {
    return ContentService.createTextOutput('Success').setMimeType(mimeType);
  } else {
    return ContentService.createTextOutput('Denied').setMimeType(mimeType);
  }
}

// 認証用インスタンス
var twitter = getInstance(
  TWITTER_API_KEY,
  TWITTER_API_KEY_SECRET
);

// 認証
function authorize() {
  twitter.authorize();
}

// 認証解除
function reset() {
  twitter.reset();
}

// 認証後のコールバック
function authCallback(request) {
  return twitter.authCallback(request);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function akapippiTweet() {
  var word_list = ["アカ", "ピ", "ミシ", "ミミ", "シ", "ガメ", "ッピ", ""];
  var result_words = [];

  var num_pattern = word_list.length;

  var first_word = word_list[getRandomInt(num_pattern - 2)];
  result_words.push(first_word);
  for (var i = 0; i < 5; i++) {
    var word_index = getRandomInt(num_pattern);
    var selected_word = word_list[word_index];

    result_words.push(selected_word);
  }

  return result_words.join("")
}

// ランダムにツイートを投稿
function postTweet() {

  var text = akapippiTweet();
  //message本文
  var message = {
    //テキストメッセージ本文
    text: text
  }

  var service = twitter.getService();

  var options = {
    "method": "post",
    "muteHttpExceptions": true,
    'contentType': 'application/json',
    'payload': JSON.stringify(message)
  }

  var response = service.fetch('https://api.twitter.com/2/tweets', options);
}
