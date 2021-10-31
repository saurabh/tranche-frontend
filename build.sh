git branch
git checkout dev-build-3
git pull origin dev-build-3
git pull origin hotfix
yarn build
git add .
git commit -m 'new build'
git push origin dev-build-3
git checkout hotfix
