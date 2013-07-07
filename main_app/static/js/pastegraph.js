$(document).ready(function() {

    // famous Ajax setup for Django CSRF Protection
    $(function(){
        $.ajaxSetup({ 
             beforeSend: function(xhr, settings) {
                 function getCookie(name) {
                     var cookieValue = null;
                     if (document.cookie && document.cookie != '') {
                         var cookies = document.cookie.split(';');
                         for (var i = 0; i < cookies.length; i++) {
                             var cookie = jQuery.trim(cookies[i]);
                             // Does this cookie string begin with the name we want?
                             if (cookie.substring(0, name.length + 1) == (name + '=')) {
                                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                 break;
                             }
                         }
                     }
                     return cookieValue;
                 }
                 if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                     // Only send the token to relative URLs i.e. locally.
                     xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                 }
             } 
        });
    });


    // TODO: add state logic

    // AVAILABLE_STATES = ['create_new', 'show_paste'];
    // state = 'create_new';

    function handle_error(action, jqXHR, textStatus, errorThrown) {
        $('#error').html('An error occured during ' + action + ': <br>' + jqXHR.responseText);
    }

    $('#plot-button').click(function() {
        $.post('plot/', $('#graph-form').serialize())
        .done(function(data, textStatus, jqXHR) {
            alert(data);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            handle_error('sending grah data to plot', jqXHR, textStatus, errorThrown);
        })
    })
})