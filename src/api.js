var $ = require('./vendor/jquery/jquery.js');
var _ = require('./vendor/underscore/underscore.js');
var crypto = require('./vendor/crypto/crypto.min.js');
var chance = require('./vendor/chance/chance.js');

var excluded = ['apiKey', 'signature', 'file', 'jsonCallback', 'format'];

function jsonp(url) {
    var d = $.Deferred();
    // http://stackoverflow.com/questions/15005500/loading-cross-domain-html-page-with-jquery-ajax
    // NOTE: Has limitations, so should only be used during development...
    var origin = 'https://apitalk.herokuapp.com/get?url=';
    $.getJSON(origin + encodeURIComponent(url) + '&callback=?', function(data) {
        d.resolve(data);
    });

    return d.promise();
}

function getApiMethod(url) {
    var d = $.Deferred();

    jsonp(url).then(function(data) {
        var links = $(data.contents).find('a');
        var methods = [];

        links.each(function() {
            var text = $(this).text();
            if (text.match(/^issuu./)) {
                methods.push({
                    'name': text,
                    'url': 'http://services.issuu.com/api/' + $(this).attr('href').replace(/..\//g, '')
                });
            }
        });

        d.resolve(methods);
    });

    return d.promise();
}

module.exports = {
    getRequestParameters: function(url) {
        var d = $.Deferred();

        jsonp(url).then(function(data) {
            var rows = $(data.contents).find('.specificationTable').eq(0).find('tr');
            var headers = rows.eq(0);
            var cells = rows.slice(1);
            var res = {
                keys: [],
                items: []
            };

            headers.find('th').each(function() {
                res.keys.push($(this).text().trim().replace(/\s/g, '').toLowerCase());
            });

            cells.each(function() {
                var obj = {};

                var name = $(this).find('td:nth-child(1)').text().trim();
                var dataType = $(this).find('td:nth-child(2)').text().trim();
                var description = $(this).find('td:nth-child(3)').text().trim();

                if (!_.contains(excluded, name)) {
                    res.items.push({
                        'name': name,
                        'description': description,
                        'label': name.split(/(?=[A-Z])/).join(' '),
                        'placeholder': dataType,
                        'value': '',
                        'type': ''
                    });
                }
            });

            d.resolve(res);
        });

        return d.promise();
    },
    getSpecifications: function(url) {
        var d = $.Deferred();

        jsonp(url).then(function(data) {
            var table = $(data.contents).find('.specificationTable');
            var ths = table.find('th');
            var tds = table.find('td');
            var res = [];
            var keys = [];

            table.each(function() {
                if (ths[0]) {
                    ths.each(function() {
                        keys.push($(this).text().trim().toLowerCase());
                    });
                }

                if (tds[0]) {
                    var obj = {};

                    tds.each(function(i, val) {
                        obj[keys[i]] = $(val).text();
                    });

                    res.push(obj);
                }
            });

            d.resolve(res);
        });

        return d.promise();
    },
    getApiMethods: function(urls) {
        var d = $.Deferred();
        var promises = [];

        var d1 = getApiMethod('http://services.issuu.com/api');
        var d2 = getApiMethod('http://developers.issuu.com/api/widget/overlay.html');

        $.when(d1, d2).then(function(v1, v2) {
            var res = v1.concat(v2);
            console.log(res);
            d.resolve(res);
        });

        return d.promise();
    }
};
