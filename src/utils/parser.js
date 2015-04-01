var $ = require('../vendor/jquery/jquery.js');
var _ = require('../vendor/underscore/underscore.js');

function objectToHTML(obj) {
    var str = '<div class="rsp__row">';

    for (var key in obj) {
        var val = obj[key];
        str += '<div class="rsp__cell">';
        str += '<div class="rsp__label">' + key + '</div>';
        str += '<div class="rsp__value">';

        if (_.isObject(val)) {
            str += objectToHTML(val);
        } else {
            str += val;
        }

        str += '</div></div>';
    }

    return str + '</div>';
}

module.exports.objectToHTML = objectToHTML;
