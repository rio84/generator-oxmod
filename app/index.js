
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var http=require('http');
var querystring=require('querystring');

var fs=require('fs');
var Api={},
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
  };

var getAPIs=function(cb){
    ajax(Api.allApi,function(chunk){
      try {
        var data = JSON.parse(chunk);
        cb(data);
      }catch(e){
        console.log('err',typeof cb)
        cb({})
      }
    });

},
  checkName=function(v,cb){
    return true;

    var files=fs.readdirSync('./mod');

    return files.indexOf(v)==-1;
  },

  registerMod=function(param,cb){
    console.log(chalk.blue(
      'Sending register info...'+JSON.stringify(param)
    ));
    //console.log('Sending register info...',param)
    ajax(Api.register,param,function(chunk){
     // console.log('chuck',chunk)
      try {
        var data = JSON.parse(chunk);
      }catch(e){
        eval('var data='+chunk);
      }
      cb(data);
    });
  },
  prompting=function(apis){

    //https://github.com/SBoudrias/Inquirer.js
    // Have Yeoman greet the user.
    apis=(apis&&apis.length) ? apis:[];
    var done = this.async();
    var prompts = [];

    var dirname=process.cwd().split('/').pop();

    prompts.push({
      type: 'input',
      name: 'modName',
      message: 'Input mod name(input nothing to use current dir):',
      default:dirname,
      validate:function(v){
        var done2=this.async();
        if(/^[a-z][\-_a-z0-9]+$/.test(v)){
          /*
           checkName(v,function(r){
           done2(r.ok||'模块名冲突');
           });
           */
          done2(checkName(v)||'conflict mod name');

        }else{
          done2( 'mod name must in letter/-/_');
        }

      }
    })

   // console.log('cwd',process.cwd())

    if(apis&&apis.length){
      prompts.push({
        type:'checkbox',
        name:'deps',
        message:'以下列出是已注册所有接口，共'+apis.length+'个，请在其中选择模块依赖的接口:',
        choices:apis

      })

    }


    this.prompt(prompts, function (props) {
      this.modName=props.modName;
      this.isDefaultName=dirname==this.modName;
     // this.modName=props.modName;
      this.depstr='';
      if(props.deps){
        this.deps=props.deps;
        this.depstr=JSON.stringify(props.deps);

      }

      done();
    }.bind(this));
  };

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
    Api=this.pkg.devApi
  },

  prompting: function () {
    var done = this.async();
    this.log(yosay(
      'Welcome to ' + chalk.red('OXMod') + ' generator!'
    ));
    console.log(
      'Getting data from remote ...'
    );
   // console.log('prompting.bind(this)',prompting.bind(this).toString())
    getAPIs(prompting.bind(this));

  },

  writing: {
    app: function () {
      var done = this.async();

      registerMod({
        name:this.modName,
        deps:this.deps&&this.deps.join(',')
      },(function(r){
       // console.log('xmlNodes:',r)
        if(r.code==0||r.xmltpl||r.xml){

          this.log(chalk.green(
            'mod '+this.modName+' get data ok!  creating files...'
          ));
          this.xmlNodes= r.xmltpl||r.xml;
          var files='demo.xsl,mod.json,demo.xml,mod.xsl'.split(','),
            prefix=this.isDefaultName?'./':('./'+this.modName)

          files.forEach((function(v){

            this.template('_'+v,prefix+'/'+v);
          }).bind(this));

          var assetsfiles='index.js,index.css'.split(',');

          assetsfiles.forEach((function(v){

            this.template('asset/_'+v,prefix+'/asset/'+v);
          }).bind(this));
        }else{
          this.log(chalk.red(
            'remote serve response error! '+r.msg
          ));
        }

        done();

      }.bind(this)));




    },

    projectfiles: function () {

    }
  },

  install: function () {

  }
});
