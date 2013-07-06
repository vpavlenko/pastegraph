import json

from django.views.decorators.http import require_POST

from main_app.utils import Graphviz
from file_keeper import save_file


@require_POST
def plot(request):
    # ajax request
    # params: graph_source, graph_options, plot_options
    graph_source = request.POST['graph_source']
    graph_options = request.POST['graph_options']
    plot_options = request.POST['plot_options']

    mime, base64 = Graphviz.render(graph_source, graph_options, plot_options)
    hash_ = save_file(mime, base64)
    data = {'image_hash': hash_}
    return json.dumps(data)
