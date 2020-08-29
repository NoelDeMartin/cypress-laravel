#!/usr/bin/env bash

if [[ `git status --short` ]]; then
    echo "Git working directory not clean"
    exit
fi

# abort on errors
set -e

# test code
npm run test

# update version
hash=`git rev-parse HEAD`
current_version=`grep -Po "(?<=\"version\"\: \")\d.\d.\d(?=\")" < package.json`
new_version="$current_version-dev.$hash"

sed -i "s/^  \"version\"\: \"$current_version\"/  \"version\"\: \"$new_version\"/" package.json
sed -i "s/^  \"version\"\: \"$current_version\"/  \"version\"\: \"$new_version\"/" package-lock.json

# build
npm run build

# publish
npm publish --tag next

# clean up
git checkout .
