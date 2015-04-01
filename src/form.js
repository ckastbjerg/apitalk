var $ = require('./vendor/jquery/jquery.js');
var _ = require('./vendor/underscore/underscore.js');
var crypto = require('./vendor/crypto/crypto.min.js');
var parser = require('./utils/parser.js');

var template = require('./template');

function arrayToHTML(arr, state) {
    var str = '<div class="rsp text-' + state + '">';

    _.each(arr, function(obj) {
        str += parser.objectToHTML(obj);
    });

    return $.parseHTML(str + '</div>');
}


function append(elems) {
    $('.js-form').remove();

    var env = $('.js-environment').find('option:selected').attr('name');

    var data = {
        'formAction': 'http://api.' + env + '.com/1_0',
        'isUploadForm': false,
        'enctype': '',
        'elems': elems.items,
        'action': $('.js-endpoint').find(":selected").text(),
        'apiKey': $('.js-api-key').val()
    };

    // annoying special case...
    if (data.action === 'issuu.document.upload') {
        data.formAction = 'http://upload.' + env + '.com/1_0';
        data.enctype = 'multipart/form-data';
        data.isUploadForm = true;
    }

    console.log(data);

    template.append('form', data, '.js-form-container');
    $('.js-form').on('submit', onFormSubmit);
}

function onFormSubmit(e) {
    var $form = $(this);

    if (!$(this).find('.js-signature')[0]) {
        e.preventDefault();

        var arr = sortObjects($form.serializeArray());
        var stringToSign = $('.js-api-secret').val() + getStringToSign(arr);
        var signature = crypto.createHash('md5').update(stringToSign).digest('hex');

        var action = $form.attr('action');
        console.log(action);

        if (action === 'http://upload.tissuu.com/1_0') { // AJAX upload doesn't work
            $form.append('<input class="js-signature" type="hidden" name="signature" value="' + signature + '"/>');
            $form.submit();
        } else {
            // TODO: Make this work for upload cross origin problem)
            var req = $form.attr('action') + '?' + $form.serialize() + '&signature=' + signature;

            $.ajax({
                url: req,
                crossDomain: true
            }).done(function(rsp) {
                $('.js-response').empty();
                var content = rsp.rsp._content;
                var html;

                if (content.error) {
                    html = arrayToHTML(content, 'danger');
                } else if (content.document) {
                    html = arrayToHTML(content.document, 'success');
                } else {
                    html = arrayToHTML(content.result._content, 'success');
                }

                $('.js-response').empty();
                $('.js-response').append(html);
                $('html, body').animate({
                    scrollTop: $('.js-response').offset().top
                }, 800);
            });
        }
    }
}

function sortObjects(arr) {
    return _.sortBy(arr, function(o) {
        return o.name;
    });
}

function getStringToSign(arr) {
    str = '';

    for (var i in arr) {
        str += arr[i].name + arr[i].value;
    }

    return str;
}

module.exports.init = function(data) {
    append(data);
};

module.exports.change = function(data) {
    append(data);
};
