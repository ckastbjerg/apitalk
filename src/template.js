var $ = require('./vendor/jquery/jquery.js');

var templates = {
    'methods': require('./templates/methods.handlebars'),
    'form': require('./templates/form.handlebars')
};

module.exports = {
    append: function(templateName, data, toElement) {
        var template = templates[templateName];
        var html = template({
            data: data
        });
        $(html).appendTo(toElement);
    }
};
