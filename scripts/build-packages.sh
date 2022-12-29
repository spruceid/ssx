#!/bin/bash

echo "[SSX Build Packages] Prebuild ssx-sdk for ssx-gnosis-extension"
yarn core build
yarn sdk build
yarn gnosis build
yarn middleware build
yarn react build
echo "[SSX Build Packages] Building all SSX Packages"
npx lerna run build
npx lerna bootstrap
