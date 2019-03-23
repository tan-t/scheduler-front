#!/bin/bash -e
if [ "$TRAVIS_BRANCH" == "firebase" ] || [ "$TRAVIS_BRANCH" == "firebase-staging" ] ; then
sudo apt-get update
sudo apt-get install -y rubygems
sudo gem install hub

DEPLOY_TARGET_ENV=${TRAVIS_BRANCH}
git config credential.helper '!f() { sleep 1; echo "username=${GIT_USER}\npassword=${GIT_PASSWORD}"; }; f'
PR_BRANCH=${DEPLOY_TARGET_ENV}-PR-${TRAVIS_BUILD_NUMBER}
git clone -b ${DEPLOY_TARGET_ENV} https://github.com/tan-t/scheduler-serverless-deploy-version.git
cd scheduler-serverless-deploy-version
git checkout -b ${PR_BRANCH}
echo ${TRAVIS_COMMIT} > SHA_CORE
git add SHA_CORE
git commit -m "'preparing for deploy: functions update build # ${TRAVIS_BUILD_NUMBER}'"
git push origin ${PR_BRANCH}
hub pull-request -b ${DEPLOY_TARGET_ENV}
fi