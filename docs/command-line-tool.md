# CLI tool for admins

The Private Extension Repository comand with command line tool (`pe`) to manage or upload extensions

## Installation

You can download the tool from npmjs.com

``` shell
npm install -g pe
```

## Download extension from the marketplace

The `download` command download the extension from marketplace. Additionally you can specify perticular version

``` shell
pe download <extension-identifier>
```

## Upload to Private Extension Repository

Use `upload` command to add an extension paget to the repository

``` shell
pe add <VSIX file location>
```
