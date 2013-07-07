import json

from django.http import HttpResponse
from django.views.decorators.http import require_POST

from main_app.utils import Graphviz
from file_keeper import save_file


GRAPH_OPTIONS = ('directed', 'source_type',)
PLOT_OPTIONS = ('graphviz_utility', 'image_type',)


@require_POST
def plot(request):
    # ajax request
    # params: graph_source, graph_options, plot_options
    graph_source = request.POST['graph_source']
    graph_options = {key: request.POST[key] for key in GRAPH_OPTIONS}
    plot_options = {key: request.POST[key] for key in PLOT_OPTIONS}

    mime, base64 = Graphviz.render(graph_source, graph_options, plot_options)
    hash_ = save_file(mime, base64)
    data = {'image_hash': hash_}
    return HttpResponse(json.dumps(data), mimetype="application/json")
