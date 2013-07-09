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
        $('#error').show();
    }

    function js_error(report) {
        $('#error').text(report);
        $('#error').show();
    }

    function clean_errors() {
        $('#error').hide();
    }

    function switch_to_method(name) {
        clean_errors();
        $('#plot-results').show();
        $('#plot-results > *').hide();
        $('#' + name + '-plot-result').show();
        $('#error').html('');
    }

    function to_2d_array(lines) {
        return jQuery.map(lines.split("\n"), function(line) {
            return [$.trim(line).split(' ')];
        });
    }

    function build_graph() {
        // Build graph from #source using #graph-options.
        // Return instance of Springy.Graph class.
        var graph = new Springy.Graph();
        var lines = to_2d_array($('#source-textarea').val());
        var directed = $('input:radio[name=directed]:checked').val() === "true";

        if ($('input:radio[name=source_type]:checked').val() == 'adjacency_matrix') {
            var min_number = 1;
            var num_vertices = lines.length;

            for (var i = min_number; i < min_number + num_vertices; ++i) {
                graph.addNodes(i);
            }

            for (var i = 0; i < num_vertices; ++i) {
                if (lines[i].length != num_vertices) {
                    js_error('Invalid amount of numbers at line ' + (i + 1) + 
                            ': expected ' + num_vertices + ', got ' + 
                            lines[i].length);
                    return undefined;
                }
                for (var j = 0; j < num_vertices; ++j) {
                    if (lines[i][j] != 0) {
                        graph.addEdges([min_number + i, min_number + j, {directional: directed}]);
                    }
                }
            }
        } else {
            for (var i in lines) {
                if (lines[i].length != 2) {
                    js_error('Invalid amount of numbers at line ' + (parseInt(i, 10) + 1) + 
                            ': expected 2, got ' + 
                            lines[i].length);
                    return undefined;
                }
                if (!(lines[i][0] in graph.nodeSet)) {
                    graph.addNodes(lines[i][0]);
                }
                if (!(lines[i][1] in graph.nodeSet)) {
                    graph.addNodes(lines[i][1]);
                }
                graph.addEdges([lines[i][0], lines[i][1], {directional: directed}]);
            }
        }

        return graph;
    }

    $('#graphviz-plot-button').click(function() {
        switch_to_method('graphviz');
        
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
            handle_error('sending grah data to plot', jqXHR, textStatus, errorThrown);
        })
    })

    $('#springy-simple-plot-button').click(function() {
        switch_to_method('springy-simple');
        
        var graph = build_graph();
        if (graph !== undefined) {
            $('#springy-simple-canvas').springy({graph: graph});
        } else {
            $('#springy-simple-plot-result').hide();
        }
    })

    $('#source-hint-clickable').click(function() {
        $('#source-textarea').val('1 2\n1 3\n1 4\n2 3\n3 4\n4 2');
        $('input[name=source_type][value=edges_list]').prop('checked', true);
        $('#source-hint').hide();
        return false;
    });
})