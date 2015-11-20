/**
 * Created by shengqing on 11/19/15.
 */
var http=require('http');
var querystring=require('querystring');
var Api={
    "host":"121.41.24.28",
    "allApi":"/o/apiall",
    "register":"/o/modregister"
  },
  ajax=function(path,param,cb){
    if(typeof param=='function'){
      cb=param;
    };
    param=param?querystring.stringify(param):'';
    var req = http.request({
      hostname: Api.host,
      path: path+'?'+param,
      port:Api.port
    }, function(res) {
      var resData='';

      res.on('data', function (chunk) {
        // cb(chunk);
        resData+=chunk;
      });
      res.on('end',function(e){
        cb(resData)
      });
    });

    req.on('error', function(e) {
      console.log(chalk.red(
        '远程接口: '+path+' 挂了!'
      ));
      cb({code:1});
    });

    req.write('');
    req.end();
  },
registerMod=function(param,cb){
  console.log(
    'Sending register info...'+JSON.stringify(param)
  );
  //console.log('Sending register info...',param)
  ajax(Api.register,param,function(chunk){
     console.log('chuck',chunk)
    try {
      var data = JSON.parse(chunk);
    }catch(e){
      eval('var data='+chunk);
    }
    cb(data);
  });
};
registerMod({"name":"oxm-test2","deps":"place-hades,a1119,aba"},function(r){

  console.log(r.xmltpl||r.xml)
})
