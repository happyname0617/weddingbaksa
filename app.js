var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];
//var dictionary = require('./dictionary');
const express = require('express')
var session = require('express-session');
//var FileStore = require('session-file-store')(session);
const MongoStore = require('connect-mongo')(session);
var winston = require('winston');
var async = require("async");

var app = express()
var request = require('request');
var VError = require('verror');
var fs = require('fs')
var _ = require('underscore');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');


var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

app.use(express.static('client'))
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'pug');
app.set('views', './views');

app.use(session({
  secret: config.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  store:new MongoStore({ url: config.DB_URL })
}));

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: true
    })
  ]
});
var mongodb;
var collectionUser;
var collectionList;
function dbconnect(url,callback)
{

  logger.info("DB connect")
  MongoClient.connect(url, function(err, db) {
     if (err) { 
        var error = new VError(err,"DB connect %s", url) 
        logger.error(error);
        callback(error); 
     }
    logger.info("Connected correctly to server");
    mongodb=db;
    collectionUser = mongodb.collection('User');
    collectionList = mongodb.collection('Wishlist');
    callback();
  });
}

function dbdisconnect(){
  mongodb.close();
}



app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    logger.info(profile.name)
    var _id = 'google:'+profile.id;;
      collectionUser.findOne({_id:_id},function(err, foundUser) {
        if (err) {logger.error('google strategy:',err); return done(err); }
        if(foundUser){
          logger.info("user already exist, proceed to login")
          done(null, foundUser);
        }
        else
        {
          logger.info("new user, proceed to login")
          var newuser = profile._json;
          newuser._id = _id;
          newuser.displayName = JSON.stringify(profile._json.name);
          logger.info('new user displayName',newuser.displayName)

          collectionUser.insertOne(newuser,function(err, newuser) {
            if (err) {var newError = VError(err,'google strategy InsertOne'); return done(newError); }
	        });
          done(null,newuser);
        }
      });
  }
));

passport.use(
  new FacebookStrategy({
    clientID: config.FACEBOOK_APP_ID,
    clientSecret: config.FACEBOOK_APP_SECRET,
    callbackURL: config.FACEBOOK_CALLBACK_URL,
    profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'verified', 'displayName','age_range']
  },
  function(accessToken, refreshToken, profile, done) {
    logger.info('facebook login:',profile.name);
    var _id = 'facebook:'+profile.id;;
      collectionUser.findOne({_id:_id},function(err, foundUser) {
        if (err) {logger.error(err); return done(err); }
        if(foundUser){
          logger.info("user already exist, proceed to login")
          done(null, foundUser);
        }
        else
        {
          logger.info("new user, proceed to login")
          var newuser = profile._json;
          newuser._id = _id;
          newuser.displayName = profile._json.name;
          collectionUser.insertOne(newuser,function(err, newuser) {
            if (err) {var newError = VError(err,'facebook strategy insertOne'); return done(newError); }
	        });
          done(null,newuser);
        }
      });
  }

));


passport.serializeUser(function(user, done) {
  logger.info('         serializeUser',user._id, user.name);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
 collectionUser.findOne({_id:id},function(err, foundUser) {
        if(err){logger.error('deserializeUser',err); return done(err);}
        if(foundUser)
        {
          logger.info('         deserializeUser ', id, foundUser.name)
          done(err, foundUser);
        }
        else
        {
          done('not existing FoundUser');
        }
  });

});


function initialize(){
  dbconnect(config.DB_URL,function(err){
    if (err) { var newError = new VError(err,'initialize dbconnect');  return newError; }

  });
}

initialize();

app.get('/:id',function(req, res) {
  if(req.user)
  {
    res.send('/')
  }
  else
  {
    var id = req.params.id;
    logger.info('/wishlist',id);
    var listexample = [
    {_id:'2',title:'전자렌지',
    model:'삼성 MS23K3535A',
    link:'http://item.gmarket.co.kr/DetailView/Item.asp?goodscode=938716677&GoodsSale=Y&jaehuid=200002673',
    imglink:'http://photo3.enuri.com/data/images/service/middle/15871000/15871281.jpg',
    price:'103,770원',status:'',
    statuscode:'ready'},
    
    {_id:'3',title:'TV',
    model:'LG전자 HD TV 32LJ566B ',
    link:'http://item.gmarket.co.kr/DetailView/Item.asp?goodscode=979921706&GoodsSale=Y&jaehuid=200002673',
    imglink:'http://photo3.enuri.com/data/images/service/middle/19242000/19242924.jpg',
    price:'106만원',status:'',
    statuscode:'ready'
    },
    {_id:'1',title:'냉장고',model:'LG 디오스 S839S30',
    link:'http://www.11st.co.kr/product/SellerProductDetail.tmall?method=getSellerProductDetail&prdNo=1266886137&utm_term=&utm_campaign=-&utm_source=%BF%A1%B4%A9%B8%AE%B4%E5%C4%C4_PCS&utm_medium=%B0%A1%B0%DD%BA%F1%B1%B3',
    imglink:'http://photo3.enuri.com/data/images/service/middle/15978000/15978977.jpg',
    price:'200만원',status:'김기훈님께서 예약중',
    statuscode:'reservation'
    },
    
    
    {_id:'4',title:'세탁기',
    model:'LG 트롬 RH9SAW',
    link:'http://item.gmarket.co.kr/DetailView/Item.asp?goodscode=979881717&GoodsSale=Y&jaehuid=200002673',
    imglink:'http://photo3.enuri.com/data/images/service/middle/19279000/19279368.jpg',
    price:'1,249,620원',status:'베프 김들림님께서 선물완료',statuscode:'done'}
    ];
    res.render('wishlist.pug',{wishlist:listexample,name:'김병수 김재림',wishliststr:JSON.stringify(listexample)});
  }
})

app.get('/auth/logout', function(req, res){
  if(req.user)
  {
    logger.info('/auth/logout', req.user._id, req.user.name);
    req.logout();
    req.session.save(function(){
      res.redirect('/');
    });
  }
  else{
    logger.info('/auth/logout not logged in approach')
    res.redirect('/');
  }
});




// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook',{scope:'email'}));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/' }));


app.get('/auth/google',passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { successRedirect:'/',
                                    failureRedirect: '/' }));

app.get('/',function(req,res){
  if(req.user) //logged in user?
  {
    res.render('home_login');
  }
  else{
    res.render('landingpage');
    
  }
})

app.listen(process.env.PORT || config.NODE_PORT, process.env.IP || "0.0.0.0",function(){
  logger.info('listening on %s',process.env.PORT||config.NODE_PORT)
})
