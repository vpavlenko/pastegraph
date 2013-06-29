#/bin/bash

source venv/bin/activate
pip freeze | grep -iv "distribute" | tee requirements.txt
