const mysql=require("mysql");

let conn=mysql.createConnection({
    host:'rm-bp1rs1qmx2lk4ns5d125010tm.mysql.rds.aliyuncs.com',
    port:3306,
    user:'用户名',
    password:'密码',
    database:'数据库名',    
    useConnectionPooling: true
});
conn.connect(err=>{
	if(err)throw(err)
});
console.log("MySQL连接成功");

module.exports={
    GetPersonList(sql,data=[],callback){    
        conn.query(sql,function (err, result) {
            if(err){
                console.log('[错误] --- ',err.message);
                return;
            } 
            callback(result);      
        });        
    }
} 

