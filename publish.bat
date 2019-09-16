npm version prerelease --preid=beta -m "Version: %s"
npm run test-core:ci
npm run build-core
git push --follow-tags


