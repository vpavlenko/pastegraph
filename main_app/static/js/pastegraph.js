$(document).ready(function() {
    // TODO: add state logic

    // AVAILABLE_STATES = ['create_new', 'show_paste'];
    // state = 'create_new';

    function handle_error(action, jqXHR, textStatus, errorThrown) {
        $('#error').text('An error occured during ' + action + ': ' + textStatus);
    }

    $('#plot-button').ON_ACTION(function() {
        $.post('plot.ajax', $('#graph-form').serialize())
        .done(function(data, textStatus, jqXHR) {
            alert(data);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            handle_error('sending grah data to plot', jqXHR, textStatus, errorThrown);
        })
    })
})