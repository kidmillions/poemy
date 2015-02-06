# poemy
poem collaboration app

![screenshot](screenie_1.png "screenie")

#CONFIG

should be like

```
var config = {
    //port for server listenting
    port: '3000',
    //where the poem database is
    databaseUrl: 'host:port/test'
};

module.exports = config
```

User validation inspired by and in somecases shamelessly copied from https://github.com/braitsch/node-login, rewritten to remove custom cryptology and instead use bcrypt
