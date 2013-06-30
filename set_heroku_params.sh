#!/bin/bash

set -x

for line in `cat env_params.txt`; do
    heroku config:set "$line"
done

heroku config:set DEBUG='False'

