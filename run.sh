#!/bin/bash

if [[ $1 == *"i"* ]]; then
    cd app && npm install && cd ../server && npm install && cd ..
fi

cd app && npm start &
cd server && npm start &

for job in $(jobs -p); do
    wait "$job" || echo "$job returned nonzero exit code"
done

# Kill app and server on SIGTERM

_term() {
    for job in $(jobs -p); do
        kill -TERM "$job"
    done
}

trap _term SIGTERM
