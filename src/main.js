var $ = require('./vendor/jquery/jquery.js');

var api = require('./api');
var stubber = require('./stubber');
var apiSettings = require('./apiSettings');
var form = require('./form');
var userOptions = require('./userOptions');

api.getApiMethods().then(function(methods) {
    userOptions.init(methods);
    apiSettings.init();
    stubber.init();

    api.getRequestParameters(methods[0].url).then(function(data) {
        form.init(data);
    });
});
