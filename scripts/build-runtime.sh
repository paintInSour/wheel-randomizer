#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

npx --yes esbuild "$ROOT_DIR/assets/js/ui/icons.js" --loader:.js=jsx --format=iife --outfile="$ROOT_DIR/assets/js/ui/icons.runtime.js"
npx --yes esbuild "$ROOT_DIR/assets/js/ui/Wheel.js" --loader:.js=jsx --format=iife --outfile="$ROOT_DIR/assets/js/ui/Wheel.runtime.js"
npx --yes esbuild "$ROOT_DIR/assets/js/App.js" --loader:.js=jsx --format=iife --outfile="$ROOT_DIR/assets/js/App.runtime.js"
npx --yes esbuild "$ROOT_DIR/assets/js/main.js" --loader:.js=jsx --format=iife --outfile="$ROOT_DIR/assets/js/main.runtime.js"

echo "Runtime files rebuilt successfully."
