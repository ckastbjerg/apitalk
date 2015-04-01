var $ = require('./vendor/jquery/jquery.js');

var $elem = $('.js-settings');
var template = require('./template');
var api = require('./api');
var form = require('./form');

function init(methods) {
    template.append('methods', methods, '.js-settings');
    setFixedPositionOnScroll();
}

function setFixedPositionOnScroll() {
    var topHeight = $('.js-top').height() - 10;
    var isFixed = false;

    $(document).on('scroll', function() {
        var scrollTop = $(this).scrollTop();
        if (!isFixed && scrollTop >= topHeight) {
            $elem.addClass('js-fixed');
            isFixed = true;
        } else if (isFixed && scrollTop < topHeight) {
            $elem.removeClass('js-fixed');
            isFixed = false;
        }
    });

    $('.js-endpoint').on('change', function() {
        var url = $(this).find('option:selected').val();
        api.getRequestParameters(url).then(function(data) {
            form.change(data);
        });
    });
}

module.exports.init = init;
