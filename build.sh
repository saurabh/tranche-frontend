git branch
git checkout dev-build-2
git pull origin dev-build-2
git pull origin newTranche
yarn build
git add .
git commit -m 'new build'
git push origin dev-build-2
git checkout newTranche
