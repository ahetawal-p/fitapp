angular.module('app.factories')

.factory('emailInfoFactory',["$cordovaDevice",
    function($cordovaDevice) {
        var SUPPORT_EMAIL = "pokifit@gmail.com";

        var systemInfo = function(){
            var platform = ionic.Platform.platform();
            var version = ionic.Platform.version();
            var deviceInformation = ionic.Platform.device().model;
            console.log("DEVICE INFO");
            console.log(JSON.stringify(deviceInformation));
            return {
                platform: platform,
                version: version,
                device: deviceInformation
            }
        }

        /* create body texts */
        var bodyTextGenerator = function(){
            var systemInfoObj = new systemInfo();

            this.getBodyText = function getBodyText() {
               // var userRow = createRow("User: ", "user@gmail.com");
                var deviceInformation = createRow("Device: ", systemInfoObj.device);
                var versionRow = createRow("Version: ", systemInfoObj.version);
                var platformRow = createRow("Platform: ", systemInfoObj.platform);
                return deviceInformation.concat(versionRow).concat(platformRow);
            }

            function createRow(property, value){
                var text = '<div><span style="font-weight:bold">' + property + '</span><span>' + value + '</span></div>';
                return text;
            }
        }



        /* function exposed to create email content */
        function createEmail(type){
            var textGen = new bodyTextGenerator();
            var emailInfo = {};

            if (type === "reportProblem"){
                emailInfo = createReportProblemEmailInfo(textGen);
            } else {
                emailInfo = createFeedbackEmailInfo(textGen);
            }

            return emailInfo;
        }

        function createReportProblemEmailInfo(textGen) {
            var emailInfo = {
                to:          [SUPPORT_EMAIL], // email addresses for TO field
                subject:    "Report a Problem", // subject of the email
                body:       textGen.getBodyText(), 
                isHtml:    true, // indicats if the body is HTML or plain text
            }

            return emailInfo;
        }

        function createFeedbackEmailInfo(textGen) {
            var emailInfo = {
                to:          [SUPPORT_EMAIL], // email addresses for TO field
                subject:    "Feedback", // subject of the email
                body:       textGen.getBodyText(), 
                isHtml:    true, // indicats if the body is HTML or plain text
            }

            return emailInfo;
        }




        return {
            createEmail: createEmail
        };
    }]);