$(document).ready(function() {

    var current_plot_method = undefined;

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

    function handle_error(action, jqXHR, textStatus, errorThrown) {
        $('#error').html($('<pre>').html('An error occured during ' + action + ': <br>' + jqXHR.responseText));
        $('#error').show();
    }

    js_error = function(report) {
        $('#error').text(report);
        $('#error').show();
    }

    function clean_errors() {
        $('#error').hide();
        $('#error').html('');
    }

    function switch_to_method(name) {
        clean_errors();
    }
    
    function light_update() {
        clean_errors();

        if (current_plot_method == 'springy-simple') {
            $('#springy-simple-link').click();
        }
    }

    function hard_update() {
        clean_errors();

        $('#' + current_plot_method + '-link').click();
    }

    $('#graphviz-link').click(function() {
        clean_errors();

        current_plot_method = 'graphviz';
        
        $('#graphviz-plot-result').removeClass('ajax-loader-rendering');
        $('#graphviz-plot-result').removeClass('ajax-loader-loading');

        $('#graphviz-plot-img').hide();
        $('#ajax-loader').show();
        $('#graphviz-plot-result').addClass('ajax-loader-rendering');
        // $('#plot').hide();
        $.post('plot/', $('#graph-form').serialize())
        .done(function(data, textStatus, jqXHR) {
            // $('#plot').html($('<img>').attr('src', 'file/get/' + data['image_hash']));
            $('#graphviz-plot-result').removeClass('ajax-loader-rendering');
            $('#graphviz-plot-result').addClass('ajax-loader-loading');
            $('#graphviz-plot-img').attr('src', 'file/get/' + data['image_hash']).load(function() {
                $('#graphviz-plot-result').removeClass('ajax-loader-loading');
                $('#ajax-loader').hide();
                $('#graphviz-plot-img').show();
            });
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            $('#ajax-loader').hide();            
            handle_error('sending graph data to plot', jqXHR, textStatus, errorThrown);
        })
    })

    $('#springy-simple-link').click(function() {
        clean_errors();

        current_plot_method = 'springy-simple';

        var graph = build_graph();
        if (graph !== undefined) {
            var canvas = $('<canvas width="640" height="400" />')
            $('#springy-simple-plot-result').html(canvas);
            canvas.springy({graph: graph});
        }
    });

    $('#source-type-to-adjacency-matrix').click(function() {
        clean_errors();

        if (!$('#source-type-to-adjacency-matrix').hasClass('source-type-selected')) {
            $('#source-textarea').val(graph_to_adjacency_matrix(build_graph()));
        }

        $('.source-type-choice').removeClass('source-type-selected');
        $('#source-type-to-adjacency-matrix').addClass('source-type-selected');

        $('input[name=source_type]').val('adjacency_matrix');

        return false;
    });

    $('#source-type-to-edge-list').click(function() {
        clean_errors();

        if (!$('#source-type-to-edge-list').hasClass('source-type-selected')) {
            $('#source-textarea').val(graph_to_edge_list(build_graph()));
        }

        $('.source-type-choice').removeClass('source-type-selected');
        $('#source-type-to-edge-list').addClass('source-type-selected');

        $('input[name=source_type]').val('edges_list');

        return false;
    });

    $('input[name=directional]').click(function() {
        $('input[name=directed]').val($('input[name=directional]').prop('checked'));
    });

    $('#source-textarea').keyup(function() {
        light_update();
    });

    $('#directional-checkbox').click(function() {
        hard_update();
    });

    // perform on start

    $('#springy-simple-link').click();
})