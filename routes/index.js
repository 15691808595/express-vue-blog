var express = require('express');
var router = express.Router();

// 添加交互
var mysql = require('mysql')
var qs=require("querystring")
//连接mysql
var pool = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'',
    database:'blog',
    connectionLimit:10
});


router.get("/getLengthData",(req,res)=>{
    pool.getConnection((err,conn)=>{
        let sql = "SELECT * FROM article2 order by createTime desc";
        conn.query(sql,(err,result)=>{
            res.json(result);
            conn.release();
        });
    });
});
router.post("/getInput",(req,res)=>{
    req.on("data",(data)=>{
        var obj = qs.parse(data.toString());
        // var obj = data.toString();
        var wd=obj.wd;
        var decodeWd=encodeURIComponent(wd);
        console.log(wd);
        pool.getConnection((err,conn)=>{
            var sql = "select * from article2  where title like '%"+wd+"%' order by createTime desc";
            conn.query(sql,(err,result)=>{
                res.json(result);
                conn.release();
            });
        });
    });
});

// 把反馈信息存到数据库
router.post("/user_item",(req,res)=>{
    req.on("data",(data)=>{
        var obj = qs.parse(data.toString());
        // var obj = data.toString();
        console.log(obj);
        var rn = obj.name;
        var re = obj.email;
        var rq = obj.qq;
        var rp = obj.phone;
        var rm = obj.message;
        pool.getConnection((err,conn)=>{
            var sql = "INSERT INTO user_item VALUES(NULL,?,?,?,?,?)";
            conn.query(sql,[rn,re,rq,rp,rm],(err,result)=>{
                res.json(result);
                conn.release();
            });
        });
    });
});
// 发表文章的内容放到数据库
router.post("/postArticle",(req,res)=>{
    req.on("data",(data)=>{
        var obj = qs.parse(data.toString());
        // var obj = data.toString();
        console.log(obj);
        var rn = obj.title;
        var re = obj.url;
        var rq = encodeURIComponent(obj.content);
        var rm = obj.type;
        var img = rm+".png";
        var time= new Date().getTime();
        console.log('time:'+time);
        pool.getConnection((err,conn)=>{
            var sql = "insert into article2(title,url,content,`type`,img,createTime) values(?,?,?,?,?,?)";
            conn.query(sql,[rn,re,rq,rm,img,time],(err,result)=>{
                res.json(result);
                conn.release();
            });
        });
    });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
