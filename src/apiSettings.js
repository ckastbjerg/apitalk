var $ = require('./vendor/jquery/jquery.js');

var key;
var secret;

function storeApiSettings() {
    console.log('store');
    if (typeof(Storage) !== "undefined") {
        key = $('.js-api-key').val();
        secret = $('.js-api-secret').val();

        localStorage.setItem("apiKey", key);
        localStorage.setItem("apiSecret", secret);
    } else {
        console.log('Sorry! No Web Storage support..');
    }
}

function setApiSettings() {
    if (typeof(Storage) !== "undefined") {
        key = localStorage.getItem("apiKey");
        secret = localStorage.getItem("apiSecret");
        $('.js-api-key').val(key);
        $('.js-api-secret').val(secret);
    } else {
        console.log('Sorry! No Web Storage support..');
    }
}

function checkIfChanged() {
    var newKey = $('.js-api-key').val();
    var newSecret = $('.js-api-secret').val();

    if (key === newKey && secret === newSecret) {
        $('.js-api-settings-btn').prop('disabled', true);
    } else {
        $('.js-api-settings-btn').prop('disabled', false);
    }
}

module.exports.init = function() {
    $('.js-api-settings-btn').on('click', function() {
        storeApiSettings();
    });

    $('.js-api-key').add('.js-api-secret').on('keyup', function() {
        checkIfChanged();
    });


    setApiSettings();
};
