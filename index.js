// 参考サイト
// https://kt-life.net/gas-tweet-bot/
// https://officeforest.org/wp/2021/05/22/google-apps-script%E3%81%8B%E3%82%89twitter-api-v2%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E3%81%99%E3%82%8B/

// Thanks to @Tkonsoy (https://twitter.com/Tkonsoy)
// https://twitter.com/Tkonsoy/status/1529688689802375168?s=20&t=3avC0I2HUqrFvYljLumIvQ

var userProperties = PropertiesService.getScriptProperties();
var TWITTER_API_KEY = userProperties.getProperty('TWITTER_API_KEY');
var TWITTER_API_KEY_SECRET = userProperties.getProperty('TWITTER_API_KEY_SECRET');

// 認証用インスタンス
var twitter = TwitterWebService.getInstance(
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

  var first_word = word_list[getRandomInt(num_pattern-2)];
  result_words.push(first_word);
  for (var i=0; i<5; i++){
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

 var service  = twitter.getService();

 var options = {
    "method": "post",
    "muteHttpExceptions" : true,
    'contentType': 'application/json',
    'payload': JSON.stringify(message)
  }

 var response = service.fetch('https://api.twitter.com/2/tweets', options);
}
