#!/bin/sh

set -e

VERSION=$1
BRANCH=$2

if [ -z "${VERSION}" ]; then
  echo "Version not specified; Exiting."
  exit 1;
fi
if [ -z "${BRANCH}" ]; then
  echo "Version not specified; Exiting."
  exit 1;
fi

if [ ! "${BRANCH}" = "refs/heads/main" ]; then
  echo "Branch is ${BRANCH}; README.md not updated."
  exit 0;
fi

sed -i -e "s/NEXT_VERSION/v${VERSION}/g" ./README.md
