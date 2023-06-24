# webhooks.deno.dev Local Proxy
## Description
This is a simple proxy for https://webhooks.deno.dev that can be used to test webhooks locally. It will forward all requests to the specified URL and log the request and response to the console.

## Usage
```bash
deno run --allow-net --allow-env main.ts [uuid] [proxy to url]
```

## Example

The following command will forward all requests made to https://webhooks.deno.dev/w/12345678-1234-1234-1234-123456789012 to http://localhost:8001/webhooks.
```bash
deno run --allow-net --allow-env main.ts 12345678-1234-1234-1234-123456789012 http://localhost:8001/webhooks
```
