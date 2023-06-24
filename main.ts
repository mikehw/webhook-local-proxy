import { parse } from "https://deno.land/std@0.182.0/flags/mod.ts";
const version = "1.0.0";
import { EventSource } from "https://deno.land/x/eventsource@v0.0.3/mod.ts";

const flags = parse(Deno.args, {
  boolean: ["help", "version"],
  string: ["base-url"],
});

if (flags.help) {
  console.log(`
    webhooks.deno.dev webhook proxy utility version ${version}

    Usage: deno run  --allow-net main.ts [uuid] [proxy to url]
    Example: deno run  --allow-net main.ts 12345678-1234-1234-1234-123456789012 http://localhost:8001/webhooks
    This example will proxy HTTP requests made to https://webhooks.deno.dev/w/12345678-1234-1234-1234-123456789012 and forward them to http://localhost:8001/webhooks
    To use an alternative to webhooks.deno.dev, use the --base-url flag, e.g. --base-url http://localhost:8001/sse/
    `);
  Deno.exit(0);
}

if (flags.version) {
  console.log(version);
  Deno.exit(0);
}

if (flags._.length < 2) {
  console.log("Missing arguments, expected 2 arguments: [uuid] [proxy to url]");
  Deno.exit(1);
}

const uuid = flags._[0];
const proxyTo = flags._[1] as string;
const baseUrl = flags["base-url"] || "https://webhooks.deno.dev/sse/";
console.log(`Proxying ${uuid} to ${proxyTo}`);
const sse = new EventSource(`${baseUrl}${uuid}`);
sse.onmessage = async (e) => {
  const webhook = JSON.parse(e.data) as {
    id: string;
    body: string;
    headers: Record<string, string>;
    method: string;
    ts: string;
    url: string;
  };
  const result = await fetch(proxyTo, {
    method: webhook.method,
    headers: webhook.headers,
    body: webhook.body || undefined,
  });
  console.log(`Forwarded webhook to ${proxyTo}, got response ${result.status}`);
  console.log(await result.text());
};
sse.onopen = () => {
  console.log("Connected to webhooks.deno.dev, waiting for webhooks...");
};

sse.onerror = (e) => {
  console.log(e);
  console.error("Error connecting to webhooks.deno.dev, exiting...");
  Deno.exit(1);
};
