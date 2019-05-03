# bookexchange app using firestorm

> A Vue.js project

## Build Setup

``` bash

#clone repo
cd directory
git clone https://github.com/fabizeid/bookexchange.git 

sudo npm install -g firebase-tools

# install dependencies
npm install

#if node-saas/vendor does not exist (bug)
npm rebuild node-sass

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# 
firebase deploy
firebase deploy --only firestore:rules
firebase serve (for local server)

#debugging node
node --inspect --debug-brk build/dev-server.js
or set it up in script of package.json:     "dbg": "node --inspect --debug-brk build/dev-server.js",
or kill -SIGUSR1 nodejs_pid
then chrome://inspect

#for functions cd functions directory and:
# for https triggered functions
 "npm run serve": "firebase serve --only functions",
# for everything else
"npm run shell": "firebase experimental:functions:shell",
 "npm run start": "npm run shell",
 "npm run deploy": "firebase deploy --only functions",
 "npm run logs": "firebase functions:log"

firebase deploy --only functions:function1,functions:function2
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

M-x magit-status to start magit then ? for all commands, s for staging and c for commiting C-c C-c after commit message:
https://www.emacswiki.org/emacs/Magit