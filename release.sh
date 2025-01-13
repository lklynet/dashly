#!/bin/bash
version=$1
if [ -z "$version" ]; then
  echo "Usage: $0 <version>"
  exit 1
fi

git add .
git commit -m "Release $version"
git tag -a "$version" -m "Release $version"
git push origin main
git push origin "$version"