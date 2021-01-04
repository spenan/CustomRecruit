const connect=require("connect"); //创建连接
const bodyParser = require('body-parser');   //body解析
const cookieParser=require('cookie-parser');  //cookie解析
const serveStatic = require('serve-static');   //目录访问（静态文件访问）
const cors=require("cors"); //跨域处理
const url=require("url");  //url
const qs=require("qs"); //数据序列化
const path=require("path");  //路径 处理文件和目录的路径

const service=require("./service")

let app=connect() 
    .use(bodyParser.json()) //JSON解析
    .use(cors()) //跨越处理
    .use(serveStatic(__dirname))  
    .use("/api",function(request,response,next){
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        service.GetPersonList("select * from sp_person where id=1",[],(res)=>{
            var data =ResultCode(res)
            response.end(JSON.stringify(data));
            next();
        })
    })
    .use("/work",function(request,response,next){
        let custom=url.parse(request.url,true).query;
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        service.GetPersonList(`SELECT * FROM sp_work LIMIT ${custom.pageIndex}, ${custom.pageSize}`,[],(res)=>{
            var data =ResultCode(res)
            response.end(JSON.stringify(data));
            next();
        })
    })
    .listen(2020,function(){
        console.log('Server running at http://127.0.0.1:2020');
    });

    function ResultCode(res){
        if(res&&res!=undefined&&res!=null&&res!=""){
            return  {Data:res,"code": 200, "msg": "success" };
        }
        return {"code": 500, "msg": "error" };
    }