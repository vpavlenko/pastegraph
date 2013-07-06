#!/usr/bin/env python3

import http.server
import socketserver

PORT = 9999


class GraphvizHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.log_message("received POST from {0}:{1}".format(*self.client_address))
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        self.wfile.write("CODE")


httpd = socketserver.TCPServer(("", PORT), GraphvizHandler)
httpd.allow_reuse_address = True

print("serving at port", PORT)
httpd.serve_forever()
