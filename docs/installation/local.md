# Installation

Private Extension Repository is a self-contained executable. After you download the executable run the command

``` bash
$ ./extensions-web
```

## dotnet runtime

You can also download the server dotnet binaries of server. You will need to use `dotnet run` command to start the server

``` bash
$ dotnet run ./extensions-web
```

## Multiple servers

You can run multuple instances of the private extension repository server. The server will start on default port `5000`, pass `--urls` option to use different port.

``` bash
$ dotnet run ./extensions-web --urls=https://localhost:5500

or 

$ ./extensions-web --urls=https://localhost:5500
```


NOTE: The server uses in-memmory data base and common location to store extensions. Make sure you have each instance of the server is self contained in it's own directory