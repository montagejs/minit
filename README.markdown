[![Build Status](https://travis-ci.org/montagejs/minit.png?branch=master)](http://travis-ci.org/montagejs/minit)

Minit – the Montage Initializer
===============================

Minit helps you build [Montage](http://montagejs.org/) applications by generating template applications and components for you.

Usage
-----

Run `minit` with your chosen template inside the directory you wish to create the template in. Templates such as "component" will search for a `package.json` and place their generated files in the correct directory underneath it, in this case `ui/`

Run `minit --help` for details of the templates available and their usages. The templates are defined in the [templates directory](https://github.com/montagejs/minit/tree/master/templates).

```bash
~$ minit --help

  Usage: minit [options] [command]

  Commands:

    create:app [options]
    create:component [options]
    create:package [options]
    create:package-json [options]
    create:test [options]

  Options:

    -h, --help                  output usage information
    -V, --version               output the version number
```

```bash
~$ minit create:app --help

  Usage: create:app [options]

  Options:

    -h, --help              output usage information
    -n, --name <name>       application name
    -p, --package-home [path]   package home
    -d, --destination [path]    where the template will be expanded relative to the package-home
    -c, --copyright [path]  copyright file
```

```bash
~$ minit create:package --help

  Usage: create:package [options]

  Options:

    -h, --help              output usage information
    -n, --name <name>       package name
    -p, --package-home [path]   package home
    -d, --destination [path]    where the template will be expanded relative to the package-home
    -c, --copyright [path]  copyright file
```

```bash
~$ minit create:component --help

  Usage: create:component [options]

  Options:

    -h, --help                  output usage information
    -n, --name <name>           module name
    -p, --package-home [path]   package home
    -d, --destination [path]    where the template will be expanded relative to the package-home
    -e, --exported-name [name]  exported name
    -j, --jsdoc [module]        jsdoc module
    -c, --copyright [path]      copyright file
```

```bash
~$ minit create:package-json --help

  Usage: create:package-json [options]

  Options:

    -h, --help                 output usage information
    -n, --name <name>          package name
    -p, --package-home [path]   package home
    -d, --destination [path]    where the template will be expanded relative to the package-home
    -a, --author [name]        author
    -m, --montage-path [name]  path to montage
```

```bash
~$ minit create:spec --help

  Usage: create:spec [options]

  Options:

    -h, --help                 output usage information
    -p, --package-home [path]  absolute path to the package's home directory
    -d, --destination [path]   where the template will be expanded relative to the package-home's test directory
    -n, --name <name>          module name
    -t, --title [name]         title of the test
```

```bash
~$ minit create:test --help

  Usage: create:test [options]

  Options:

    -h, --help                 output usage information
    -p, --package-home [path]  absolute path to the package's home directory
    -d, --destination [path]   where the template will be expanded relative to the package-home's test directory
    -n, --name <name>          module name
    -t, --title [name]         title of the test
```

Using minit as a package
-----

The minit package exports a create function that accepts a template name and an options object. The available options
are the same as the command line options except that they are camel cased (--package-home becomes packageHome).
The create function returns a promise.

```javascript
var minitCreate = require("minit").create;

minitCreate(templateName, options).done();

```

