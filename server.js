(function() {
  var app, express, path, proxy, axios, fs,obj, helmet, csp, https;
  express = require('express');
  path = require('path');
  fs = require('fs');
  https = require('https');
  axios= require('axios');
  proxy = require('express-http-proxy');
  app = express();
  helmet = require('helmet');
  csp = require('helmet-csp');
  app.use(helmet());
  // Implement CSP with Helmet
  app.use(csp({
    directives: {
 //   defaultSrc: ["'self'"],
//    scriptSrc: ["'self'"],
//    styleSrc: ["'unsafe-inline'", "http://fonts.googleapis.com/css?family=Open+Sans"],
 //   imgSrc: ["'self'"],
//    connectSrc: ["'none'"],
   // fontSrc: ["'self'"],
    objectSrc: ["'self'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'self'"]
    }
  }));

  app.get('/getUserInfo',function(req, res){
    var nodeSSPI = require('node-sspi');
    var nodeSSPIObj = new nodeSSPI();
    var userToken = '';
    var user = '';
    nodeSSPIObj.authenticate(req, res, function(err){
      if(req.connection.user !== undefined) {
        user = req.connection.user;
        var config = {
          headers: {'Content-Type': 'application/json'}
        };
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        axios.post('https://uat.gateway.shiftleft.visa.com:8080/auth-service/auth', {
          appId : '4baa61e4c9b93f3f0682250b6cf8331b7ee68fd1',
          userId: req.connection.user.split('\\')[1]
          }, config)
          .then(function(response) {
          userToken = response.data.Token;
          res.json({user: req.connection.user, token: userToken});
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    });
  });

  var key = fs.readFileSync('ssl/key.slp.np.pem');
  var cert = fs.readFileSync( 'ssl/cert.slp.np.cer' );

  var options = {
    key: key,
    cert: cert,
    secureProtocol: "TLSv1_2_method"
  };

  app.use(express.static(path.join(__dirname, 'dist')));
  app.listen(80);
  https.createServer(options, app).listen(443);
  console.log('Server running ...');
}).call(this);
