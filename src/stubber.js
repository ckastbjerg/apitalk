var $ = require('./vendor/jquery/jquery.js');
var api = require('./api');

require('./vendor/chance/chance.js');

var initialized = false,
    documentCategories = null,
    documentTypes = null;

function init() {
    $('.js-stubbed-data-btn').on('click', function() {
        collect().then(function() {
            var data = generate();
            updateForm(data);
        });
    });
}

function updateForm(data) {
    $('.js-form').find('input').each(function() {
        var value = data[$(this).attr('name')];

        if (value) {
            $(this).val(value);
        }
    });
}

function collect() {
    var d = $.Deferred();

    if (initialized) {
        d.resolve();
    }

    var dc = api.getSpecifications('http://services.issuu.com/api/documentcategories.html');
    var dt = api.getSpecifications('http://services.issuu.com/api/documenttypes.html');

    $.when(dc, dt).done(function(categories, types) {
        documentCategories = categories;
        documentTypes = types;
        initialized = true;
        d.resolve();
    });

    return d.promise();
}

function generate() {
    return {
        'commentsAllowed': chance.bool().toString(),
        'downloadable': chance.bool().toString(),
        'description': chance.paragraph(),
        'format': 'json',
        'page': 1,
        'infoLink': chance.url(),
        'language': chance.country().toLowerCase(),
        'category': chance.pick(documentCategories).code,
        'type': chance.pick(documentTypes).code,
        // FIXME: 'protected' is not available for upload_url...
        'access': chance.pick(['private', 'public', 'protected']),
        'explicit': chance.bool().toString(),
        'ratingsAllowed': chance.bool().toString(),
        'tags': chance.word() + ', ' + chance.word() + ', ' + chance.word(),
        'title': chance.sentence({
            'words': 5
        }),
        'soundUrl': chance.url(),
        'slurpUrl': 'http://www.education.gov.yk.ca/pdf/pdf-test.pdf',
        'publishDate': chance.date().toISOString()
    };
}

module.exports.init = init;
