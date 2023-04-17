# Configuration

You can modify server configurations by editing the `appsettings.json` file.

## Require an API key

You can require that users provide a password, called an API key, to publish packages.
To do so, you can insert the desired API key in the `ApiKey` field.

```json
{
    "ApiKey": "SERVER API KEY",
    ...
}
```
