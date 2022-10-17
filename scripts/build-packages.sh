#!/bin/bash

echo "[SSX Build Packages] Prebuild ssx-sdk for ssx-gnosis-extension"
yarn sdk build
yarn gnosis build
echo "[SSX Build Packages] Building all SSX Packages"
npx lerna run build
npx lerna bootstrap
