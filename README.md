# SHIFTLEFT

[http://shiftleft.visa.com](http://shiftleft.visa.com "SHIFTLEFT")

Frontend project for the SHIFTLEFT portal 

## Middleware requirements
1. node: 8.9.3 x64 or latest
2. npm: latest

## DevSetup
1. install Node: 8.9.3 or latest
2. clone "devsec-ui" project from Bitbucket
3. cd to project folder
4. run "npm install"
This may take a while. It may even *freeze* a bit on final steps - be patient. 
  * If your `npm install` ends with long tree of project dependencies - then you are going right way. Nevermind deprecation WARNs. 
5. Then run "npm start"
6. Open new terminal, cd to project folder again
6. And run "node mockapiserver.js" to start the mock backend services
7. Point your browser to [http://localhost:4200](http://localhost:4200) 

##For Mac users:
  
  remove node-sspi dependency from package.json
  You might still get an error regarding node-sass module
  In that case, go to VISA guest network and run the command: npm rebuild node-sass
  After that switch to VISA network and do the following:
  npm install
  npm start
  
## Production Build 
1. cd to project folder on your local
2. run "npm run build-prod"
If the build is successfull, you will see a "dist" folder created in the project root
5. Copy "dist", "node_modules" and "server.js" to Windows Webserver Root on Prod
6. Issue command "node server.js" on Prod This will start the server 
7. Point your browser to [http://sw730vsappw001.visa.com/#/](http://sw730vsappw001.visa.com:8080/#/) 

## .nmprc settings
    proxy=http://smartha@userproxy.visa.com:80
    https-proxy=http://smartha@userproxy.visa.com:443
    ftp-proxy=userproxy.visa.com:80
    registry=https://artifactory.trusted.visa.com:8443/api/npm/npm-uiux-virtual/
    always-auth=true
    username=smartha
    email=smartha@visa.com
    strict-ssl=false
    engine-strict=true
    ca=null
    artifactory.npm.index.quietPeriodSecs=60
    artifactory.npm.index.cycleSecs=60
    _auth=base64Encode [ smartha:ArtifactoryAuthSettingEncryptedPassword ]
    
## .gitconfig settings
[http]

    proxy = http://userproxy.visa.com:80/

    sslVerify = false

[https]

    proxy = https://userproxy.visa.com:443/

### Build Release instructions

## Release notes
