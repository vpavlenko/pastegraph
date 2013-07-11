$(document).ready(function() {
    function to_2d_array(lines) {
        return jQuery.map(lines.split("\n"), function(line) {
            return [$.trim(line).split(' ')];
        });
    }

    build_graph = function() {
        // Build graph from #source using #graph-options.
        // Return instance of Springy.Graph class.

        var graph = new Springy.Graph();
        var lines = to_2d_array($.trim($('#source-textarea').val()));
        var directed = $('input[name=directional]').prop('checked');

        if ($('#source-type-to-adjacency-matrix').hasClass('source-type-selected')) {
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

    function enumerate_vertices(graph) {
        var enumeration = {};
        var num_vertices = 0;

        for (var node_index in graph.nodes) {
            var node = graph.nodes[node_index];
            enumeration[node.id] = num_vertices++;
        }

        return enumeration;
    }

    graph_to_adjacency_matrix = function(graph) {
        // Convert Springy.Graph instance to string
        // describing it.

        var enumeration = enumerate_vertices(graph);
        var num_vertices = graph.nodes.length;

        var matrix = [];
        for (var i = 0; i < num_vertices; ++i) {
            matrix[i] = [];
            for (var j = 0; j < num_vertices; ++j) {
                matrix[i][j] = 0;
            }
        }

        for (var edge_index in graph.edges) {
            var edge = graph.edges[edge_index];
            matrix[enumeration[edge.source.id]][enumeration[edge.target.id]] = 1;
            if (edge.data['directional'] === 'false') {
                matrix[enumeration[edge.target.id]][enumeration[edge.source.id]] = 1;
            }
        }

        var lines = [];
        for (var row_id in matrix) {
            lines.push(matrix[row_id].join(' '));
        }

        return lines.join('\n');
    }

    graph_to_edge_list = function(graph) {
        var enumeration = enumerate_vertices(graph);
        var edge_list = [];

        for (var edge_index in graph.edges) {
            var edge = graph.edges[edge_index];
            edge_list.push((enumeration[edge.source.id] + 1) + " " + (enumeration[edge.target.id] + 1));
        }

        return edge_list.join('\n');
    }
})