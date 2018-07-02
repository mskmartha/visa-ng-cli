(function() {
      var fs = require('fs');
      var express = require('express');
      var cors = require('cors');

      var app = express();

      app.use(cors());

      var getuserInfo = require('./mockapi/user/getuserInfo.json');
      app.get('/getUserInfo',function(req, res){res.send(getuserInfo);});

      var getDetailedUserInfo = require('./mockapi/user/getDetailedUserInfo.json');
      app.get('/config-services/user/abherani',function(req, res){res.send(getDetailedUserInfo);});

      var getAllusers = require('./mockapi/config-services/users/mockUsers.json');
      app.get('/config-services/users/search',function(req, res){res.send(getAllusers);});

      var mockUser = require('./mockapi/user/getDetailedUserInfo.json');
      app.get('/config-services/user/smartha',function(req, res){res.send(mockUser);});

      var getMockUser = require('./mockapi/config-services/users/userInfo.json');
      app.get('/config-services/user/18898',function(req, res){res.send(getMockUser);});

      var enums = require('./mockapi/sa-services/common/globalenums.json');
      app.get('/sa-services/common/globalenums',function(req, res){
            // set custom header and expose it
            // res.setHeader('X-Permission', 1)
            // res.setHeader('Access-Control-Expose-Headers', 'X-Permission,content-type');
            res.send(enums);
      });

      var departments = require('./mockapi/config-services/departments.json');
      app.get('/config-services/departments',function(req, res){
            // set custom header and expose it
            // res.setHeader('X-Permission', 1)
            // res.setHeader('Access-Control-Expose-Headers', 'X-Permission,content-type');
            res.send(departments);
      });

      var SSOValidation = require('./mockapi/sa-services/sa/SSOValidation.json');
      app.get('/sa-services/sa/SSOValidation',function(req, res){res.send(SSOValidation);});

      var getPSSLDetails = require('./mockapi/sa-services/sa/sec-assessments.json');
      app.get('/sa-services/sa/assessments',function(req, res){
            // set custom header and expose it
            //res.setHeader('X-Permission', 1)
            // res.setHeader('Access-Control-Expose-Headers', 'X-Permission,content-type');
            res.send(getPSSLDetails);
      });

      var getSAActions = require('./mockapi/sa-services/common/sa-actions.json');
      // app.get('/sa-services/common/1/1/actions',function(req, res){res.send(getSAActions);});
      app.get('/sa-services/sa/assessments/1/actions',function(req, res){res.send(getSAActions);});

      var getSAA2ctions = require('./mockapi/sa-services/common/sa-actions.2.json');
      // app.get('/sa-services/common/1/2/actions',function(req, res){res.send(getSAA2ctions);});
      app.get('/sa-services/sa/assessments/2/actions',function(req, res){res.send(getSAA2ctions);});
      // dashboard
      var saDashboardFilterType = require('./mockapi/sa-services/sa/dashboard/types.json');
      app.get('/sa-services/sa/dashboard/types',function(req, res){res.send(saDashboardFilterType);});
      var saDashboardFilterSummary = require('./mockapi/sa-services/sa/dashboard/summary.json');
      app.get('/sa-services/sa/dashboard/summary',function(req, res){res.send(saDashboardFilterSummary);});

      var getStatusChanged = require('./mockapi/sa-services/sa/SSOValidation.json');
      // SA
      var camrs = require('./mockapi/config-services/camrs.json');
      app.get('/config-services/camrs/search',function(req, res){res.send(camrs);});

      var camr = require('./mockapi/config-services/camr.json');
      app.get('/config-services/camr/1009',function(req, res){res.send(camr);});

      var SACommonQuestionnaire = require('./mockapi/sa-services/sa/questionnaire.json');
      app.get('/sa-services/common/metadata/SA',function(req, res){res.send(SACommonQuestionnaire);});

      var ViewSACommonQuestionnaire = require('./mockapi/sa-services/sa/questionnaire.json');
      app.get('/sa-services/sa/assessments/1/actions/6',function(req, res){res.send(ViewSACommonQuestionnaire);});

      var SAquestionnaire = require('./mockapi/sa-services/sa/questionnaire.json');
      app.get('/sa-services/sa/assessments/1',function(req, res){res.send(SAquestionnaire);});

      // SA Scoping
      var SAScopingGetQuestionnaire = require('./mockapi/sa-services/sa/saScopingMetadata.json');
      app.get('/sa-services/sa/assessments/1/actions/20',function(req, res){res.send(SAScopingGetQuestionnaire);});

      // Edit SA Scoping
      var SAEditScoping = require('./mockapi/sa-services/sa/saScopingMetadata.json');
      app.get('/sa-services/sa/assessments/1/actions/23',function(req, res){res.send(SAEditScoping);});

      var SAScopingPostQuestionnaire = require('./mockapi/sa-services/sa/saScopingMetadata.json');
      app.post('/sa-services/sa/assessments/1/actions/12',function(req, res){res.send(SAScopingPostQuestionnaire);});

      // SA Triaging
      var saTriageMetadata = require('./mockapi/sa-services/sa/saTriageMetadata.json');
      app.get('/sa-services/sa/assessments/1/actions/1',function(req, res){res.send(saTriageMetadata);});
      app.get('/sa-services/sa/assessments/2/actions/1',function(req, res){res.send(saTriageMetadata);});

      var saTriagePost = require('./mockapi/sa-services/sa/saTriageMetadata.json');
      app.post('/sa-services/sa/questionnaire/SAT',function(req, res){res.send(saTriagePost);});

      var sasummary = require('./mockapi/sa-services/sa/summary.json');
      app.post('/sa-services/sa/assessments',function(req, res){res.send(sasummary);});

      // Cloud Security
      var csaCamrs = require('./mockapi/cs-services/camrs.json');
      app.get('/cs-services/camrs',function(req, res){res.send(csaCamrs);});

      var CSAquestionnaire = require('./mockapi/cs-services/questionnaire.json');
      app.get('/cs-services/questionnaire',function(req, res){res.send(CSAquestionnaire);});

      var postQuestionnaire = require('./mockapi/cs-services/questionnaire.json');
      app.post('/cs-services/questionnaire',function(req, res){res.send(postQuestionnaire);});

      var getCSADetails = require('./mockapi/cs-services/cloud-sec-assessments.json');
      app.get('/cs-services/cloud-sec-assessments',function(req, res){res.send(getCSADetails);});

      var manageCSA = require('./mockapi/cs-services/manage-csa.json');
      app.get('/cs-services/1',function(req, res){res.send(manageCSA);});

      var manageCSA = require('./mockapi/cs-services/manage-csa.json');
      app.get('/cs-services/2',function(req, res){res.send(manageCSA);});

      var updateTeamStatus = require('./mockapi/cs-services/manage-csa.json');
      app.patch('/cs-services/1/teams/1',function(req, res){res.send(updateTeamStatus);});

      var CSAActions = require('./mockapi/cs-services/actions.json');
      app.get('/cs-services/1/actions',function(req, res){res.send(CSAActions);});

      //LDR
      var getLLDRDetails = require('./mockapi/sa-services/sa/ldrfindings/getldrfindings.json');
      app.get('/sa-services/sa/ldrfindings',function(req, res){res.send(getLLDRDetails);});

      var updateldrfindings = require('./mockapi/sa-services/sa/ldrfindings/updateldrfindings.json');
      app.post('/sa-services/sa/ldrfindings/updateldrfindings',function(req, res){res.send(updateldrfindings);});

      var assessmentDOs = require('./mockapi/sa-services/sa/summary.json');
      app.get('/sa-services/sa/assessments/1/summary',function(req, res){res.send(assessmentDOs);});

      //app scoping
      var appscopingdetails = require('./mockapi/sa-services/sa/appscopingdetails.json');
      app.get('/sa-services/sa/appscopingdetails/id/1/applicationId/1005',function(req, res){
            // set custom header and expose it
            res.setHeader('X-Permission', 1)
            res.setHeader('Access-Control-Expose-Headers', 'X-Permission,content-type');
            res.send(appscopingdetails);
      });

      var getFeaturesJira = require('./mockapi/sa-services/sa/getFeaturesJira.json');
      app.get('/sa-services/sa/appscopingdetails/id/1/applicationId/1005',function(req, res){
            // set custom header and expose it
            res.setHeader('X-Permission', 1)
            res.setHeader('Access-Control-Expose-Headers', 'X-Permission,content-type');
            res.send(getFeaturesJira);
      });

      var completeAppScoping = require('./mockapi/sa-services/sa/appScopingActions.json');
      app.post('/sa-services/sa/appscopingdetails/id/1/applicationId/1005/action/2',function(req, res){res.send(completeAppScoping);});

      var saveFeatures = require('./mockapi/sa-services/sa/appscopingdetails.json');
      app.post('/sa-services/sa/appscopingdetails/id/1/applicationId/1005/action/1',function(req, res){res.send(saveFeatures);});

      //KCC
      var kccmetadata = require('./mockapi/sa-services/kcc/kccmetadata.json');
      app.get('/sa-services/kcc/questionnaire',function(req, res){res.send(kccmetadata);});

      var kccdetails = require('./mockapi/sa-services/kcc/kcclist.json');
      app.get('/sa-services/kcc/kcclist',function(req, res){res.send(kccdetails);});

      var getKCCActions = require('./mockapi/sa-services/common/kcc-actions.json');
      app.get('/sa-services/common/4/25/actions',function(req, res){res.send(getKCCActions);});


      var getKCCP1Actions = require('./mockapi/sa-services/common/kccp1-actions.json');
      app.get('/sa-services/common/5/25/actions',function(req, res){res.send(getKCCP1Actions);});

      var getKCCP2Actions = require('./mockapi/sa-services/common/kccp2-actions.json');
      app.get('/sa-services/common/6/25/actions',function(req, res){res.send(getKCCP2Actions);});

      var getKCC2Actions = require('./mockapi/sa-services/common/kcc-actions.2.json');
      app.get('/sa-services/common/4/32/actions',function(req, res){res.send(getKCC2Actions);});

      var postKCCcomments = require('./mockapi/sa-services/kcc/kcc-comments.json');
      app.post('/sa-services/kcc/25/comments',function(req, res){res.send(postKCCcomments);});

      var kccquestions = require('./mockapi/sa-services/kcc/kccmetadata.json');
      app.post('/sa-services/kcc/questionnaire',function(req, res){res.send(kccquestions);});

      var prePPRQns = require('./mockapi/sa-services/kcc/pre-ppr.json');
      app.get('/sa-services/kcc/questionnaire/25/KCCP1',function(req, res){
            res.setHeader('X-Permission', 2)
            res.setHeader('Access-Control-Expose-Headers', 'X-Permission,content-type');
            res.send(prePPRQns);
      });

      var prePIRQns = require('./mockapi/sa-services/kcc/pre-pir.json');
      app.get('/sa-services/kcc/questionnaire/25/KCCP2',function(req, res){
            res.setHeader('X-Permission', 1)
            res.setHeader('Access-Control-Expose-Headers', 'X-Permission,content-type');
            res.send(prePIRQns);
      });

      var postKCCP1 = require('./mockapi/sa-services/kcc/pre-ppr.json');
      app.post('/sa-services/kcc/questionnaire/KCCP1',function(req, res){res.send(postKCCP1);});

      var postKCCP2 = require('./mockapi/sa-services/kcc/pre-pir.json');
      app.post('/sa-services/kcc/questionnaire/KCCP2',function(req, res){res.send(postKCCP2);});

      var kccSummaryP1 = require('./mockapi/sa-services/kcc/kccSummaryP1.json');
      app.get('/sa-services/kcc/25/kccsummary/kcctype/KCCP1',function(req, res){res.send(kccSummaryP1);});

      var kccSummaryP2 = require('./mockapi/sa-services/kcc/kccSummaryP2.json');
      app.get('/sa-services/kcc/25/kccsummary/kcctype/KCCP2',function(req, res){res.send(kccSummaryP2);});

      var updateKccStatus = require('./mockapi/sa-services/kcc/kccSummaryP1.json');
      app.patch('/sa-services/kcc/25/action/7',function(req, res){res.send(updateKccStatus);});

      //Saar API
      var saarsummary = require('./mockapi/sa-services/sa/saarsummary.json');
      app.get('/sa-services/sa/saarsummary',function(req, res){
            res.setHeader('X-Permission', 1)
            res.setHeader('Access-Control-Expose-Headers', 'X-Permission,content-type');
            res.send(saarsummary);
      });

      var saarquestionnaire = require('./mockapi/sa-services/sa/saarquestionnaire.json');
      app.get('/sa-services/sa/saarquestionnaire',function(req, res){res.send(saarquestionnaire);});

      //SAAR Findings
      var findingsummary = require('./mockapi/sa-services/sa/saarfinding/findingsummary.json');
      app.get('/sa-services/sa/saarfinding/findingsummary', function(req, res){
            res.setHeader('X-Permission', 1)
            res.setHeader('Access-Control-Expose-Headers', 'X-Permission,content-type');
            res.send(findingsummary);
      });

      var viewfinding = require('./mockapi/sa-services/sa/saarfinding/viewfinding.json');
      app.get('/sa-services/sa/saarfinding/viewfinding', function(req, res){res.send(viewfinding);});

      var category = require('./mockapi/sa-services/sa/saarmapping/category.json');
      app.get('/sa-services/sa/saarmapping/category', function(req, res){res.send(category);});

      var vulnerability = require('./mockapi/sa-services/sa/saarmapping/vulnerability.json');
      app.get('/sa-services/sa/saarmapping/vulnerability', function(req, res){res.send(vulnerability);});

      var updatevulnerabilities = require('./mockapi/sa-services/sa/saarvulnerabilities/updatevulnerabilities.json');
      app.get('/sa-services/sa/saarvulnerabilities/updatevulnerabilities', function(req, res){res.send(updatevulnerabilities);});

      //SAST
      var getCSDetails  = require('./mockapi/sa-services/sa/sast/scans/odata/test_project_1.json');
      app.get('/sa-services/sa/sast/scans/odata/test_project_1', function(req, res){res.send(getCSDetails);});

      var getProjectName = require('./mockapi/sa-services/sa/sast/projects/id/projects_list.json');
      app.get('/sa-services/sa/sast/projects/id/1', function(req, res){
            res.setHeader('X-Permission', 1)
            res.setHeader('Access-Control-Expose-Headers', 'X-Permission,content-type');
            res.send(getProjectName);
      });

      var saveScanDetail = require('./mockapi/sa-services/sa/sast/savescan.json');
      app.get('/sa-services/sa/sast/id/1/projectName/test_project_1/scan/1010158', function(req, res){res.send(saveScanDetail);});

      var getGraphDetail = require('./mockapi/sa-services/sa/sast/csGraph.json');
      app.get('/sa-services/sa/sast/graph/id/1', function(req, res){res.send(getGraphDetail);});

      var getCodeScanProjects = require('./mockapi/sa-services/sa/sast/projectnames.json');
      app.get('/sa-services/sa/sast/projects/addProject', function(req, res){res.send(getCodeScanProjects);});


      //TSR
      var tsrTypes = require('./mockapi/tsr-services/types.json');
      app.get('/tsr-services/types', function(req, res){res.send(tsrTypes);});

      var tsrData = require('./mockapi/tsr-services/search.json');
      app.get('/tsr-services/search', function(req, res){res.send(tsrData);});

      var sortasc = require('./mockapi/tsr-services/sortasc.json');
      app.get('/tsr-services/sortasc', function(req, res){res.send(sortasc);});

      var sortdesc = require('./mockapi/tsr-services/sortdesc.json');
      app.get('/tsr-services/sortdesc', function(req, res){res.send(sortdesc);});

      //Pen Test API
      var penTestGetWorkStatus  = require('./mockapi/sa-services/pentest/getWorkStatus.json');
      app.get('/sa-services/1/pentest',function(req, res){res.send(penTestGetWorkStatus);});

      var penTestGetPreScopingQuestionnaire  = require('./mockapi/sa-services/pentest/prescopingMetadata.json');
      app.get('/sa-services/1/pentest/prescope/questionnaire',function(req, res){
        //res.setHeader('X-Permission', 1)
        //res.setHeader('Access-Control-Expose-Headers', 'X-Permission,content-type');
        res.send(penTestGetPreScopingQuestionnaire);
      });

      var penTestSubmitPreScopingQuestionnaire  = require('./mockapi/sa-services/pentest/prescopingMetadata.json');
      app.post('/sa-services/1/pentest/prescope/questionnaire',function(req, res){res.send(penTestSubmitPreScopingQuestionnaire);});

      var penTestQIDServers  = require('./mockapi/sa-services/pentest/servers.json');
      app.get('/sa-services/1/pentest/qid/servers',function(req, res){
        //res.setHeader('X-Permission', 1)
        //res.setHeader('Access-Control-Expose-Headers', 'X-Permission,content-type');
        res.send(penTestQIDServers);
      });

      var penTestQIDApplications  = require('./mockapi/sa-services/pentest/applications.json');
      app.get('/sa-services/1/pentest/qid/applications',function(req, res){
        res.setHeader('X-Permission', 1)
        res.setHeader('Access-Control-Expose-Headers', 'X-Permission,content-type');
        res.send(penTestQIDApplications);
      });

      var penTestQIDPostServers  = require('./mockapi/sa-services/pentest/servers.json');
      app.patch('/sa-services/1/pentest/qid/servers',function(req, res){res.send(penTestQIDPostServers);});

      var penTestQIDPostApplications  = require('./mockapi/sa-services/pentest/applications.json');
      app.patch('/sa-services/1/pentest/qid/applications',function(req, res){res.send(penTestQIDPostApplications);});


      var penTestGetScopingQuestionnaire  = require('./mockapi/sa-services/pentest/scopingMetadata.json');
      app.get('/sa-services/1/pentest/scoping/questionnaire',function(req, res){
        res.setHeader('X-Permission', 1)
        res.setHeader('Access-Control-Expose-Headers', 'X-Permission,content-type');
        res.send(penTestGetScopingQuestionnaire);
      });

      var penTestSubmitScopingQuestionnaire  = require('./mockapi/sa-services/pentest/scopingMetadata.json');
      app.post('/sa-services/1/pentest/scoping/questionnaire',function(req, res){res.send(penTestSubmitScopingQuestionnaire);});

  ///////////////////
      app.listen(process.env.PORT || 8080);
      console.log('Server running on port 8080...');

}).call(this);
