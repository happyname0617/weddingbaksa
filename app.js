var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];
//var dictionary = require('./dictionary');
const express = require('express')
//var session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
//var FileStore = require('session-file-store')(session);
//const MongoStore = require('connect-mongo')(session);
var winston = require('winston');
var async = require("async");
var cors = require('cors')
var app = express()
//var request = require('request');
var VError = require('verror');
var fs = require('fs')
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
//var MongoClient = require('mongodb').MongoClient;
//var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');
const mongoose = require('mongoose');
var passport = require('passport')
const User = require('./models/user');
const Todo = require('./models/todo');
const Category = require('./models/category');

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = config.SECRET_KEY;
passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
  console.log('jwt_payload');
  User.getUserById(jwt_payload.id, (err, user) => {
    if(err){
      console.log('JwtStrategy',err)
      return done(err, false);
    }

    if(user){
      console.log('JwtStrategy',user)
      return done(null, user);
    } else {
      console.log('JwtStrategy no user')
      return done(null, false);
    }
  });
}));


//passport.use(jwtstrategy);
// var FacebookStrategy = require('passport-facebook').Strategy;
// var GoogleStrategy = require('passport-google-oauth20').Strategy;

app.use(express.static(path.join(__dirname, 'client')))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.set('views', './views');
app.use(cors());
//const users = require('./routes/users');

// app.use(session({
//   secret: config.SESSION_SECRET_KEY,
//   resave: false,
//   saveUninitialized: true,
//   store:new MongoStore({ url: config.DB_URL })
// }));

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: true
    })
  ]
});

// var mongodb;
// var collectionUser;
// var collectionList;
// function dbconnect(url,callback)
// {

//   logger.info("DB connect")
//   MongoClient.connect(url, function(err, db) {
//      if (err) { 
//         var error = new VError(err,"DB connect %s", url) 
//         logger.error(error);
//         callback(error); 
//      }
//     logger.info("Connected correctly to server");
//     mongodb=db;
//     collectionUser = mongodb.collection('User');
//     collectionList = mongodb.collection('Wishlist');
//     callback();
//   });
// }

// function dbdisconnect(){
//   mongodb.close();
// }


app.post('/user/register', (req, res, next) => {
  console.log(req.body)
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg:'Failed to register user'});
    } else {
      const token = createToken(user.id);
      res.json({
        success: true,
        token: 'JWT '+token,
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email
        },
        msg:'User registered'
      });

      //add inital checklist to user
      addInitialChecklist(user.id);

      //res.json({success: true, msg:'User registered'});
    }
  });
});
function addInitialChecklist(userid){
  console.log('addInitialChecklist');
  var table = {};
  //get all category list from bskim user
  Category.getCategoryByOwnerId('599698a3c72cb0674180719c', (err, list) => {
    // console.log('typeof list',typeof list);
    // console.log(JSON.stringify(list));
    console.log('list.length',list.length)
    async.forEach(list,function(item,callback){
        let newCategory = new Category({
          ownerid: userid,
          title: item.title,
          memo: item.memo, 
          required: item.required,
          descryption: item.descryption,
          budget:item.budget,
          budget_avg:item.budget_avg,
          budget_automatic:item.budget_automatic
        });   
        Category.addCategory(newCategory, (err, category) => {
          if(err){
            console.log(err);
            callback(err)
          }
          else{
            console.log('added category',category);
            var newCategoryID = category._id;
            table[item._id] = newCategoryID;
            callback()
          }
        })
      },function(err){
        console.log('table',table);
        Todo.getTodoByOwnerId('599698a3c72cb0674180719c', (err, todos) => {
          todos.forEach(function(todo){
            let categoryid = table[todo.categoryid];
            console.log('categoryid',categoryid)
            let newTodo = new Todo({
              ownerid: userid,
              categoryid: categoryid,
              title: todo.title,
              memo: todo.memo,
              completed: todo.completed,
              descryption: todo.descryption,
              budget:todo.budget,
              budget_avg:todo.budget_avg
            })
        
            Todo.addTodo(newTodo, (err, addedTodo) => {
              console.log('addedTodo',addedTodo)
            })
              
          })
        })
    })




 
  })

}
function createToken(userid){
  var payload = {id: userid};
  const token = jwt.sign(payload, config.SECRET_KEY, {
    expiresIn: 604800 // 1 week
  });
  return token;
}
app.post('/user/login',function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  console.log('username:',req.body.username);
  console.log('password:',req.body.password);
  User.getUserByUsername(username, (err, user) => {
    if(err) {console.log('err',err);throw err};
    if(!user){
      console.log('User not found');
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) {console.log('err',err);throw err;}
      if(isMatch){
        const token = createToken(user.id);
        // const token = jwt.sign(payload, config.SECRET_KEY, {
        //   expiresIn: 604800 // 1 week
        // });
        console.log('succeed');
        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        console.log('Wrong password');
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
})


app.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
  res.json({message: "Success! You can not see this without a token"});
});


app.use(passport.initialize());
//app.use(passport.session());
//require('./passport')(passport);
// app.use('/users', users);
// passport.use(new GoogleStrategy({
//     clientID: config.GOOGLE_CLIENT_ID,
//     clientSecret: config.GOOGLE_CLIENT_SECRET,
//     callbackURL: config.GOOGLE_CALLBACK_URL
//   },
//   function(accessToken, refreshToken, profile, done) {
//     logger.info(profile.name)
//     var _id = 'google:'+profile.id;;
//       collectionUser.findOne({_id:_id},function(err, foundUser) {
//         if (err) {logger.error('google strategy:',err); return done(err); }
//         if(foundUser){
//           logger.info("user already exist, proceed to login")
//           done(null, foundUser);
//         }
//         else
//         {
//           logger.info("new user, proceed to login")
//           var newuser = profile._json;
//           newuser._id = _id;
//           newuser.displayName = JSON.stringify(profile._json.name);
//           logger.info('new user displayName',newuser.displayName)

//           collectionUser.insertOne(newuser,function(err, newuser) {
//             if (err) {var newError = VError(err,'google strategy InsertOne'); return done(newError); }
// 	        });
//           done(null,newuser);
//         }
//       });
//   }
// ));

// passport.use(
//   new FacebookStrategy({
//     clientID: config.FACEBOOK_APP_ID,
//     clientSecret: config.FACEBOOK_APP_SECRET,
//     callbackURL: config.FACEBOOK_CALLBACK_URL,
//     profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'verified', 'displayName','age_range']
//   },
//   function(accessToken, refreshToken, profile, done) {
//     logger.info('facebook login:',profile.name);
//     var _id = 'facebook:'+profile.id;;
//       collectionUser.findOne({_id:_id},function(err, foundUser) {
//         if (err) {logger.error(err); return done(err); }
//         if(foundUser){
//           logger.info("user already exist, proceed to login")
//           done(null, foundUser);
//         }
//         else
//         {
//           logger.info("new user, proceed to login")
//           var newuser = profile._json;
//           newuser._id = _id;
//           newuser.displayName = profile._json.name;
//           collectionUser.insertOne(newuser,function(err, newuser) {
//             if (err) {var newError = VError(err,'facebook strategy insertOne'); return done(newError); }
// 	        });
//           done(null,newuser);
//         }
//       });
//   }

// ));


// passport.serializeUser(function(user, done) {
//   logger.info('         serializeUser',user._id, user.name);
//   done(null, user._id);
// });

// passport.deserializeUser(function(id, done) {
//   console.log('deserializ user trial')
//  collectionUser.findOne({_id:id},function(err, foundUser) {
//         if(err){logger.error('deserializeUser',err); return done(err);}
//         if(foundUser)
//         {
//           logger.info('         deserializeUser ', id, foundUser.name)
//           done(err, foundUser);
//         }
//         else
//         {
//           done('not existing FoundUser');
//         }
//   });

// });


function initialize(){
    // Connect To Database
  
  mongoose.connect(config.DB_URL);
  var db = mongoose.connection;
  // On Connection
  db.on('open', () => {
    console.log('Connected to database '+config.DB_URL);
  });

  // On Error
  db.on('error', (err) => {
    console.log('Database error: '+err);
  });

  // dbconnect(config.DB_URL,function(err){
  //   if (err) { var newError = new VError(err,'initialize dbconnect');  return newError; }

  // });
}

initialize();
// var todos = [
//                 {id:'1',owner:'bskim',categoryid:'8',title:'장소,기간,예산 계획hh',completed:false,memo:''},
//             {id:'2',owner:'bskim',categoryid:'8',title:'예약완료',completed:false,memo:''},
//             {id:'3',owner:'bskim',categoryid:'8',title:'여권준비',completed:false,memo:''},
//             {id:'4',owner:'bskim',categoryid:'8',title:'비자준비(필요시)',completed:false,memo:''},
//             {id:'5',owner:'bskim',categoryid:'8',title:'신혼여행 준비물 리스트작성',completed:false,memo:''},
//             {id:'6',owner:'bskim',categoryid:'8',title:'해외여행시 신용카드준비',completed:false,memo:''}
// ]
app.get('/get/userinfo',passport.authenticate('jwt', { session: false }),function(req,res){
  
    return res.json(req.user);

  
})
    
    
app.get('/category/list/:userid',passport.authenticate('jwt', { session: false }),function(req, res) {
    console.log('/get/category/',req.params.userid)
    var userid = req.params.userid;
    //res.json(todos);
    Category.getCategoryByOwnerId(userid, (err, list) => {
      if(err){
        res.json({success: false, msg:'Failed to get category list'});
      }
      else{
        res.json(list);
      }
      
    })

});
app.post('/category/add',passport.authenticate('jwt', { session: false }),function(req, res) {
    console.log('/category/add',req.body.ownerid);
    var budget = parseInt(req.body.budget)
    var budget_avg = parseInt(req.body.budget_avg)

    let newCategory = new Category({
      ownerid: req.body.ownerid,
      title: req.body.title,
      memo: req.body.memo, 
      required: req.body.required,
      descryption: req.body.descryption,
      budget:budget,
      budget_avg:budget_avg,
      budget_automatic:req.body.budget_automatic
    });   


    Category.addCategory(newCategory, (err, category) => {
      if(err){
        console.log(err);
        res.json({success: false, msg:'Failed to add new newCategory'});
      }
      else{
        res.json({success: true, msg:'succeed to add new newCategory'});
      }
      
    })

});

app.put('/category/update',passport.authenticate('jwt', { session: false }),function(req, res) {
      console.log('/category/update',req.body._id);
    var budget = parseInt(req.body.budget)
    var budget_avg = parseInt(req.body.budget_avg)
  
    let newCategory = {
      ownerid: req.body.ownerid,
      title: req.body.title,
      memo: req.body.memo, //TODO
      required: req.body.required,//TODO
      descryption: req.body.descryption, //TODO
      budget:budget,
      budget_avg:budget_avg,
      budget_automatic:req.body.budget_automatic        

    }   


    Category.updateCategory(req.body._id,newCategory, (err, category) => {
      if(err){
        console.log(err);
        res.json({success: false, msg:'Failed to update newCategory'});
      }
      else{
        console.log('return',category);
        res.json({success: true, msg:'succeed to update newCategory'});
      }
      
    })

}); 
app.delete('/category/delete/:id',passport.authenticate('jwt', { session: false }),function(req, res) {
    console.log('/category/delete/',req.params.id);
    console.log('/category/delete/ owner:',req.user._id)
    var categoryid = req.params.id;
    Category.deleteCategoryById(categoryid,req.user._id, (err, list) => {
      if(err){
        res.json({success: false, msg:'Failed to delete category'});
      }
      else{ 
        res.json({success: true, msg:'succeed to delete category'});
      }
       
    })

});  
app.get('/todo/get/:userid',passport.authenticate('jwt', { session: false }),function(req, res) {
    console.log('/todo/get/',req.params.userid)
    
    var userid = req.params.userid;
    //res.json(todos);
    Todo.getTodoByOwnerId(userid, (err, todos) => {
      if(err){
        res.json({success: false, msg:'Failed to get todo list'});
      }
      else{
        res.json(todos);
      }
      
    })

});
app.get('/todo/get/:userid/:categoryid',passport.authenticate('jwt', { session: false }),function(req, res) {
  console.log('/todo/get/userid:',req.params.userid)
  console.log('/todo/get/categoryid:',req.params.categoryid)
  
  var userid = req.params.userid;
  var categoryid = req.params.categoryid;
  //res.json(todos);
  const query = {ownerid:userid,categoryid:categoryid};
  Todo.getTodoByQuery(query, (err, todos) => {
    if(err){
      res.json({success: false, msg:'Failed to get todo list'});
    }
    else{
      res.json(todos);
    }
    
  })

});


    
app.post('/todo/add',passport.authenticate('jwt', { session: false }),function(req, res) {
    console.log('/todo/add',req.body.ownerid);
    var budget = parseInt(req.body.budget)
    var budget_avg = parseInt(req.body.budget_avg)

    let newTodo = new Todo({
      ownerid: req.body.ownerid,
      categoryid: req.body.categoryid,
      title: req.body.title,
      memo: req.body.memo,
      completed: req.body.completed,
      descryption: req.body.descryption,
      budget:budget,
      budget_avg:budget_avg,
    })

    Todo.addTodo(newTodo, (err, todos) => {
      if(err){
        console.log(err);
        res.json({success: false, msg:'Failed to add new todo item into todo list'});
      }
      else{
        res.json({success: true, msg:'succeed to add new todo item into todo list'});
      }
      
    })

});



app.put('/todo/update',passport.authenticate('jwt', { session: false }),function(req, res) {
    console.log('/todo/update',req.body._id);
 
    var budget = parseInt(req.body.budget)
    var budget_avg = parseInt(req.body.budget_avg)
   
    let newTodo = {
      ownerid:req.body.ownerid,
      categoryid: req.body.categoryid,
      title: req.body.title,
      memo: req.body.memo,
      budget:budget,
      budget_avg:budget_avg,
      completed: req.body.completed,
      descryption: req.body.descryption
    }

    Todo.updateTodo(req.body._id,newTodo, (err, todos) => {
      if(err){
        console.log(err);
        res.json({success: false, msg:'Failed to update todo'});
      }
      else{
        console.log('matching',todos);
        res.json({success: true, msg:'succeed to update todo'});
      }
      
    })

});
app.delete('/todo/delete/:id',passport.authenticate('jwt', { session: false }),function(req, res) {
  console.log('/todo/delete/',req.params.id);
  console.log('/todo/delete/ owner:',req.user._id)
  var todoid = req.params.id;
  Todo.deleteTodoById(todoid,req.user._id, (err, list) => {
    if(err){
      res.json({success: false, msg:'Failed to delete todo'});
    }
    else{ 
      res.json({success: true, msg:'succeed to delete todo'});
    }
     
  })

});  

app.get('/checklist',function(req, res) {
  var list = [
{_id:'001',owner:'bskim',checked:0,dday:120,title:'양가상견례',category:''},
{_id:'002',owner:'bskim',checked:0,dday:120,title:'신혼집 준비',category:''},
{_id:'003',owner:'bskim',checked:0,dday:110,title:'결혼예산세우기',category:''},
{_id:'004',owner:'bskim',checked:0,dday:110,title:'예식장 시장조사',category:''},
{_id:'005',owner:'bskim',checked:0,dday:110,title:'스튜디오 시장조사',category:''},
{_id:'006',owner:'bskim',checked:0,dday:100,title:'예식장 예약',category:''},
{_id:'007',owner:'bskim',checked:0,dday:100,title:'허니문 시장조사',category:''},
{_id:'008',owner:'bskim',checked:0,dday:100,title:'신혼집 시장조사',category:''},
{_id:'009',owner:'bskim',checked:0,dday:90,title:'허니문예약',category:''},
{_id:'010',owner:'bskim',checked:0,dday:90,title:'여권비자준비',category:''},
{_id:'011',owner:'bskim',checked:0,dday:90,title:'혼수리스트 작성',category:''},
{_id:'012',owner:'bskim',checked:0,dday:80,title:'예단상의',category:''},
{_id:'013',owner:'bskim',checked:0,dday:80,title:'한복 시장조사',category:''},
{_id:'014',owner:'bskim',checked:0,dday:80,title:'예물 시장조사',category:''},
{_id:'015',owner:'bskim',checked:0,dday:70,title:'스튜디오 예약, 촬영일 결정',category:''},
{_id:'016',owner:'bskim',checked:0,dday:70,title:'혼수 시장조사',category:''},
{_id:'017',owner:'bskim',checked:0,dday:70,title:'한복 맞춤',category:''},
{_id:'018',owner:'bskim',checked:0,dday:60,title:'청첩장 주문',category:''},
{_id:'019',owner:'bskim',checked:0,dday:60,title:'예물구입',category:''},
{_id:'020',owner:'bskim',checked:0,dday:60,title:'예단준비 진행',category:''},
{_id:'021',owner:'bskim',checked:0,dday:60,title:'피부관리시작',category:''},
{_id:'022',owner:'bskim',checked:0,dday:60,title:'드레스결정',category:''},
{_id:'023',owner:'bskim',checked:0,dday:50,title:'주례부탁',category:''},
{_id:'024',owner:'bskim',checked:0,dday:50,title:'신혼집계약 (등기부등본)',category:''},
{_id:'025',owner:'bskim',checked:0,dday:45,title:'스튜디오 촬영',category:''},
{_id:'026',owner:'bskim',checked:0,dday:40,title:'청첩장 발송준비',category:''},
{_id:'027',owner:'bskim',checked:0,dday:40,title:'사회자선정, 접수 선정',category:''},
{_id:'028',owner:'bskim',checked:0,dday:40,title:'부케 받을 친구 선정',category:''},
{_id:'029',owner:'bskim',checked:0,dday:35,title:'혼수(가전,가구,주방,침구) 구입 시작',category:''},
{_id:'030',owner:'bskim',checked:0,dday:30,title:'예단 보내기',category:''},
{_id:'031',owner:'bskim',checked:0,dday:30,title:'청첩장 발송',category:''},
{_id:'032',owner:'bskim',checked:0,dday:30,title:'사회자와 의논',category:''},
{_id:'033',owner:'bskim',checked:0,dday:30,title:'건강검진',category:''},
{_id:'034',owner:'bskim',checked:0,dday:25,title:'허니문 준비물 리스트 작성',category:''},
{_id:'035',owner:'bskim',checked:0,dday:25,title:'결혼인사 모임',category:''},
{_id:'036',owner:'bskim',checked:0,dday:20,title:'예복구입',category:''},
{_id:'037',owner:'bskim',checked:0,dday:20,title:'신혼살림들이기(가전,가구,주방,침구 등)',category:''},
{_id:'038',owner:'bskim',checked:0,dday:15,title:'허니문 예약확인',category:''},
{_id:'039',owner:'bskim',checked:0,dday:15,title:'폐백음식주문',category:''},
{_id:'040',owner:'bskim',checked:0,dday:15,title:'부케 예약',category:''},
{_id:'041',owner:'bskim',checked:0,dday:10,title:'함들이기',category:''},
{_id:'042',owner:'bskim',checked:0,dday:10,title:'전화가입, 가스설치, 우편물 주소변경',category:''},
{_id:'043',owner:'bskim',checked:0,dday:10,title:'본식 웨딩드레스와 소품점검',category:''},
{_id:'044',owner:'bskim',checked:0,dday:10,title:'휴가원제출',category:''},
{_id:'045',owner:'bskim',checked:0,dday:5,title:'결혼식날 쓸 자동차 준비',category:''},
{_id:'046',owner:'bskim',checked:0,dday:5,title:'도와줄 친구 연락 확인',category:''},
{_id:'047',owner:'bskim',checked:0,dday:5,title:'신혼살림 최종점검',category:''},
{_id:'048',owner:'bskim',checked:0,dday:3,title:'여행경비 환전',category:''},
{_id:'049',owner:'bskim',checked:0,dday:3,title:'폐백, 이바지 음식, 부케 확인',category:''},
{_id:'050',owner:'bskim',checked:0,dday:3,title:'허니문 가방정리',category:''},
{_id:'051',owner:'bskim',checked:0,dday:1,title:'차량, 지갑, 소품확인',category:''},
{_id:'052',owner:'bskim',checked:0,dday:1,title:'사례비 준비',category:''},
{_id:'053',owner:'bskim',checked:0,dday:1,title:'주례, 사회자, 도움친구 확인 전화',category:''},
{_id:'054',owner:'bskim',checked:0,dday:0,title:'결혼식',category:''}
];
    res.render('checklist.pug',{'basiclist':list});
})
app.get('/wishlist',function(req, res) {

    res.render('wishlist.pug');
})
app.get('/paylist',function(req, res) {
 var list  =[
    {_id:'001',owner:'bskim',side:'신랑측',name:'김병수',price:10},
    {_id:'002',owner:'bskim',side:'신부측',name:'김요셉',price:10}
    ]
    res.render('paylist.pug',{list:list});
})
app.get('/accoutbook',function(req, res) {
  var list =[
    {category:'혼수',title:'TV',price:53},
    {category:'혼수',title:'TV',price:53},
    {category:'혼수',title:'TV',price:53},
    {category:'혼수',title:'TV',price:53},
      ]
    res.render('accountbook.pug',{list:list,total:1002});
})

app.get('/honsulist',function(req, res) {
  var list = require('./honsu.js');
    res.render('honsulist',{list:list});
})

app.get('/new',function(req, res) {
    res.render('new');
})
app.get('/:id',function(req, res) {
  if(req.user)
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
  else{
        res.send('/')
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
  passport.authenticate('facebook', { successRedirect: 'http://localhost:8080/',
                                      failureRedirect: 'http://localhost:8080/' }));


app.get('/auth/google',passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { successRedirect:'/',
                                    failureRedirect: '/' }));

// app.get('/',function(req,res){
//   if(req.user) //logged in user?
//   {
//     res.render('home_login');
//   }
//   else{
//     res.render('landingpage');
    
//   }
// })

app.listen(process.env.PORT || config.NODE_PORT, process.env.IP || "0.0.0.0",function(){
  logger.info('listening on %s',process.env.PORT||config.NODE_PORT)
})
