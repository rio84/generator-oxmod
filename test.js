var http=require('http');




var req = http.request({
  hostname: 'localhost',
  port:'6001',

  path: '/admin/mod/register?name=temailist&deps=temailist'
}, function(res) {
  var restxt='';

  res.on('data', function (chunk) {
    restxt+=chunk;
    console.log('STATUS: ' + res.statusCode);
    console.log('-------------------------')
   // console.log('BODY: ' + chunk);
    console.log('=====')

  });
  res.on('finish',function(e){
    console.log('finiiiii')
  })
  res.on('end',function(e){
    try{
      var json=JSON.parse(restxt);
      console.log('parse ok',json)
    }catch (e){
      console.log('err +++',e)
    }
    console.log('end')
  })
  res.on('close',function(e){
    console.log('close')
  })
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.write('');
req.end();
