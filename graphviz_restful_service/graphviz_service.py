#!/usr/bin/env python3

import base64
import subprocess
import json
import http.server
import socketserver

PORT = 9999
ALLOWED_GRAPHVIZ_UTILITIES = ['dot', 'neato']


def graphviz_process(params):
    if params['graphviz_utility'] not in ALLOWED_GRAPHVIZ_UTILITIES:
        raise ValueError('Unsupported Graphviz utility "{0}"'.format(params['graphviz_utility']))
    process = subprocess.Popen(args=[params['graphviz_utility'],
                                     '-T{0}'.format(params['image_type'])],
                               stdin=subprocess.PIPE,
                               stdout=subprocess.PIPE,
                               stderr=subprocess.PIPE)
    output, errors = process.communicate(params['description'].encode('ascii'))
    mime = 'image/{0}'.format(params['image_type'])
    return mime, base64.b64encode(output).decode('ascii'), errors


class GraphvizHandler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        self.log_message('received POST from {0}:{1}'.format(*self.client_address))
        input_data = self.rfile.read(int(self.headers.get('Content-Length'))).decode('utf-8')
        self.log_message('json: {0}'.format(input_data))
        params = json.loads(input_data)
        mime, base64_output, errors = graphviz_process(params)

        if errors:
            error_message = 'Errors during graphviz execution: {0}'.format(errors.decode('ascii'))
            self.send_response(400, error_message)
            self.log_message(error_message)
        else:
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()

            data = {'mime': mime, 'base64': base64_output}
            self.wfile.write(json.dumps(data).encode('utf-8'))


socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(("", PORT), GraphvizHandler)

print("serving at port", PORT)
httpd.serve_forever()
