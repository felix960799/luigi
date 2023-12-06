#!/usr/bin/env bash

set -e # exit on errors

BASE_DIR="$( cd "$(dirname "$0")" ; pwd -P )"

source $BASE_DIR/../scripts/shared/bashHelpers.sh


runApp() {
  local PORT=$1

  echo ""
  echo "Starting webserver on port $PORT"
  pwd
  npm run start &
  PID=$!

  echo "Webserver running with PID $PID"
  # wait until example is built and running
  local SLEEPSECS=1 # sleep time between webserver availability check
  local WAITCOUNT=0
  until $(curl --output /dev/null --silent --head --fail http://localhost:$PORT); do
    if [ $WAITCOUNT -gt 15 ]; then
      echo "Starting Webserver on $PORT timed out."
      exit 1;
    fi
    printf '.'
    sleep $SLEEPSECS
    WAITCOUNT=$(($WAITCOUNT + $SLEEPSECS))
  done
  echo ""
  echo "Webserver was ready after $WAITCOUNT seconds"
}

cd $BASE_DIR/../client-frameworks-support/testing-utilities/test
#Run acutal test
PORT=8181
runApp $PORT
npm run e2e:run
killWebserver $PORT
