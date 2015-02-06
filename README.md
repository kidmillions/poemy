# poemy
poem collaboration app

<img src="http://s14.postimg.org/m6nhvq8zz/Screen_Shot_2015_02_06_at_3_40_19_PM.png"/>

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
