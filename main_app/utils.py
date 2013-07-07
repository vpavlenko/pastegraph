import collections
import json

import requests

from django.conf import settings


def convert_into_numbers(s):
    lines = s.strip().split('\n')
    return [[int(word) for word in line.split()] for line in lines]


def to_bool(json_data):
    if json_data in ['true', 'false']:
        return eval(json_data.capitalize())
    else:
        return bool(eval(json_data))


class Graph:
    '''
    graph_options:
        directed: bool
        source_type in ['adjacency_matrix', 'edges_list']
    '''

    def __init__(self, graph_source, graph_options={}):
        self.graph_source = graph_source
        self.graph_options = graph_options
        self.edges = collections.defaultdict(lambda: set())
        self._recognize_graph()

    def _recognize_graph(self):
        self.raw_numbers = convert_into_numbers(self.graph_source)
        source_type = self.graph_options['source_type']
        if source_type == 'adjacency_matrix':
            self._from_adjacency_matrix()
        elif source_type == 'edges_list':
            self._from_edges_list()
        else:
            raise ValueError('Unknown source_type "{0}"'.format(source_type))
        self.directed = to_bool(self.graph_options['directed'])

    def _from_adjacency_matrix(self):
        lines = self.raw_numbers
        self.num_vertices = len(lines)
        assert all(self.num_vertices == len(line) for line in lines)
        for i in range(self.num_vertices):
            for j in range(self.num_vertices):
                if lines[i][j]:
                    self.add_edge(i + 1, j + 1)

    def _from_edges_list(self):
        lines = self.raw_numbers
        min_vertex = min(min(line) for line in lines)
        max_vertex = max(max(line) for line in lines)
        self.num_vertices = max_vertex - min_vertex + 1
        for u, v in lines:
            self.add_edge(u, v)

    def add_edge(self, i, j):
        self.edges[i].add(j)

    def to_graphviz_description(self):
        description = []
        description.append('digraph' if self.directed else 'graph')
        description.append('''G {
fontsize = 4.0;
ratio = auto;''')
        for v in self.edges:
            description.append('{0} [shape = circle, height=.1, width=.1];'.format(v))
        for v in self.edges:
            for w in self.edges[v]:
                if self.directed or v < w:
                    description.append('{0} {2} {1} [ label = "" ];'.format(
                        v, w, '->' if self.directed else '--'))
        description.append('}')
        return '\n'.join(description)


class Graphviz:
    @classmethod
    def render(cls, graph_source, graph_options, plot_options):
        '''
        Return a tuple (mime-type, base-64-encoded-file)
        '''
        description = Graph(graph_source, graph_options).to_graphviz_description()
        graphviz_utility = plot_options['graphviz_utility']
        image_type = plot_options['image_type']
        assert graphviz_utility in ['dot', 'neato']
        params = {'description': description,
                  'graphviz_utility': graphviz_utility,
                  'image_type': image_type}
        r = requests.post(settings.GRAPHVIZ_URL, data=json.dumps(params), timeout=40000).json()
        return r['mime'], r['base64']
