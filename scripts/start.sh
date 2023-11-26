#!/usr/bin/env bash

yarn lint

# build css first
yarn run build-css

# start development server
yarn run start:craco