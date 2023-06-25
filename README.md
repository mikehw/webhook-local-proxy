# webhooks.deno.dev Local Proxy
## Description
This is a simple proxy for https://webhooks.deno.dev to forward webhooks to your local machine. You can replay webhooks in the Web UI.

## Usage
```bash
deno run --allow-net main.ts [uuid] [proxy to url]
```

## Example

The following command will forward all requests made to https://webhooks.deno.dev/w/12345678-1234-1234-1234-123456789012 to http://localhost:8001/webhooks.
```bash
deno run --allow-net main.ts 12345678-1234-1234-1234-123456789012 http://localhost:8001/webhooks
```
