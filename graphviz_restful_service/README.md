Graphviz RESTful service
========================

Run the script `graphviz_service.py` on your server.
Send the POST request to this script with the following parameters:
    - `description`: description of a graph in a graphviz format
    - `graphviz_utility`: one of {`dot`, `neato`}
    - `image_type`: one of {`png`, `svg`}

The script sends two parameters in response:
    - `mime`: mime-type of an image
    - `base64`: content of output image represented by base64-encoded string