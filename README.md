# poemy
poem collaboration app

![screenshot](screenie_1.png "screenie")

#CONFIG

should be like

```
var config = {
    //port for server listenting
    port: '3000',
    //where the poem database is, don't forget the path
    databaseUrl: 'host:port/test'
};

module.exports = config
```

User validation inspired by and in somecases shamelessly copied from https://github.com/braitsch/node-login, rewritten to remove custom cryptology and instead use bcrypt

User Authentication created with the help of this great article https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec

# TODO
- make log-ins persistant over sessions
- auto-ridirect to home after long in
- caching in poem documents to prevent n+1 problem
- store sessions in database
- switch to https...?
- move controller logic to services
- change model so that lines know what user posted them
- poem types and validations (Chris)
- profile pages (Chris will create UI frontend)
- create poem with type choice
- Titles after completion on poem page
- Line Count
- Contributions Count
- Top Contributers Page
- About Page (more like 'OH GOD WHY?!' page)
- poetry types educational info
- skip poem function
- fix notifications
- front-end validations
