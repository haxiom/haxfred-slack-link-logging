haxfred-slack-link-logging
==================

## Config

The only required parameter is the [benicio](https://github.com/haxiom/benicio) endpoint.

```json
{
  "linkLogging": {
    "endpoint": "localhost:3000"
  }
}
```

You can also pass in an array of domains to blacklist from being logged.


```json
{
  "linkLogging": {
    "endpoint": "localhost:3000",
    "blacklist": [
      "gist.github.com",
      "someotherdomain.com"
    ]
  }
}
```

## Development

```bash
npm i
```

## Testing

```bash
npm t
```
