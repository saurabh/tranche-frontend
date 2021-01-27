git branch
git checkout dev-build
git pull origin earning
yarn build
git add .
git commit -m 'new build'
git push origin dev-build
git checkout earning