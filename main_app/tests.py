from django.test import TestCase

from utils import Graph


class UtilsTestCase(TestCase):
    def test_directed_graph_description(self):
        graph_source = '''0 1 0
1 0 1
0 0 0'''
        graph_options = {'source_type': 'adjacency_matrix', 'directed': 'true'}

        expected_description = '''graph
G {
fontsize = 4.0;
ratio = auto;
1 [shape = circle, height=.1, width=.1];
2 [shape = circle, height=.1, width=.1];
3 [shape = circle, height=.1, width=.1];
2 -> 1 [ label = "" ];
2 -> 1 [ label = "" ];
2 -> 1 [ label = "" ];
}'''
        self.assertEqual(Graph(graph_source, graph_options).to_graphviz_description(), expected_description)
