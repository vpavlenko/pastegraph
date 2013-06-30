#!/bin/bash

for line in `cat env_params.txt`; do
    export "$line"
done

export DEBUG='True'