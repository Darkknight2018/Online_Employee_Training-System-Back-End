const express = require('express'); //引入express模块
const app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser') //body-parser是node.js 中间件，用于处理 JSON, Raw, Text 和 URL 编码的数据。

//与数据库中的testdb_01库进行连接
var connection = mysql.createConnection({ //使用createConnection方法创建一个表示与mysql数据库服务器之间连接的connection对象
  host     : 'localhost',
  user     : 'root',
  password : '******', //请自行设置
  database : 'testdb_01'
});

connection.connect(); //用connection对象的connet方法建立连接

//启动套接字，监听1486端口的信息
const server = app.listen(1486, function () {
  console.log('Express app server listening on port %d', server.address().port);
});

app.use(bodyParser.urlencoded({ extended: false })) //对于所有请求，返回一个中间件用来解析body中的url。
app.use(bodyParser.json()) //返回中间件用来解析json。

//对所有请求，更改响应头中的参数，使允许跨域访问该服务。
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

var questions_per_test = 2; //试卷题目数量

// login
app.post('/login', function (req, res) { //使用function处理路径为/login的post请求
  var pwd = req.body.password;
  var user = req.body.StaffId;
  var priv = req.body.IfAdmin;

  var sql = "select StaffID,Passwd,IfAdmin from staff_info where StaffID='" + user + "'and Passwd='" + pwd + "';";
  //调用query方法来直接向数据库发送sql语句，并通过回调函数返回结果。回调函数中有三个参数，第一参数是错误对象，第二参数是具体的返回的结果，正常情况下是一个数组，里面包含很多json； =>可以看成Pyhon中的匿名函数
  connection.query(sql,  (err, result)=> { 
    if (err) {
        console.log('err message:', err);
        res.json({code: -1, msg: "服务器错误"}); //以json格式返回response 返回值为一个对象/数组
        return;
    }
    else if (result == '') {
        res.json({code: -1, msg: '用户名或密码错误' }); 
    } 
    else {
        console.log(result)
        if (priv == '0') {
            res.json({code: 1, msg: '登录成功' });
        }
        else{
          if(priv == result[0]["IfAdmin"]){
            res.json({code: 2, msg: '登录成功' });
          }
          else{
            res.json({code: -1, msg: '您没有培训师权限' });
          }
        }
    }
  });
});


// get questions
app.post('/questions', function (req, res) {
  var testID = req.body.testInfo;
  testID = /[0-9]+/.exec(testID); //用正则表达式提取非testid的数字部分
  var sql = "select * from Item_Poll where TestID=" + testID  + " order by rand() limit " + questions_per_test + ";";
  connection.query(sql,  (err, result)=> {
    if (err) {
        console.log('err message:', err);
        res.json({code: -1, msg: "检索题时库服务器错误"});
        return;
    }
    if (result == '') {
        res.json({code: -1, msg: '不存在此题库' });

    } 
    else {
        res.json({code: 1, msg: '查询成功', questions: result});
    }
  });
});

// submit results
app.post('/submit', function (req, res) {
  var result = req.body;
  console.log(result);
  //testName = /[0-9]+/.exec(result.testInfo);
  //console.log([result.staffId, result.testInfo, result.totalScore].join());
  var sql = "insert history_score value (" + [result.staffId, quotes(result.testInfo), result.totalScore].join() + ");";
  connection.query(sql, (err, result)=>{
    if (err) {
      console.log(err);
      res.json({code: -1, msg: "提交结果时库服务器错误"});
      return;
    }
    res.json({code: 1, msg: "提交成功"});
  });
});

// get history
app.post('/history', function (req, res) {
  var staffID = req.body.staffId;
  var sql = "select testName, score from history_score where staffid=" + staffID + ";";
  connection.query(sql, (err, result)=>{
    if (err) {
      console.log(err);
      res.json({code: -1, msg: "查询成绩时库服务器错误"});
      return;
    }
    res.json({code: 1, msg: "提交成功", score:result});
  });
});


app.post('/qrcode', function (req, res) {
  var subject = req.body.subject
  var sql = "select testid from test_info where testname='" + subject  + "';";

  connection.query(sql,  (err, result)=> {
    if (err) {
        console.log('err message:', err);
        res.json({code: -1, msg: "登录时服务器错误"});
        return;
    }
    if (result == '') {
        res.json({code: -1, msg: '没有这个考试' });

    } 
    else {
        res.json({code: 1, msg: '登录成功', testId: result[0].testid});
    }
  });
});

//在外层添加引号
function quotes(s){
  if (s){
    return "'" + s + "'"; 
  }
  return "null";
}

