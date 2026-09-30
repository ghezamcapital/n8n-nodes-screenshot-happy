# n8n-nodes-screenshot-happy

n8n community node for [Screenshot Happy](https://screenshot-api-production-ffd7.up.railway.app/) — one HTTP request in, one screenshot, PDF or visual-change alert out.

This node is not built or maintained by n8n. It uses the real, public [Screenshot Happy API](https://screenshot-api-production-ffd7.up.railway.app/docs).

## What it does

**Screenshot resource**

- **Take Screenshot** — capture the viewport as PNG or JPEG
- **Take Full Page Screenshot** — capture the whole scrollable page
- **Generate PDF** — render the page as a PDF, exactly as it looks on screen

All three accept the real API parameters: `width`/`height` (custom viewport, 200–2560px), `selector` (capture a single element via CSS selector — PNG/JPEG only), and `quality` (JPEG compression).

**Monitor resource**

- **Create** — start monitoring a URL on a schedule; Screenshot Happy diffs each capture against the last one and calls your webhook when the difference crosses a threshold
- **Get Many** — list your monitors
- **Delete** — stop monitoring a URL

To react to a detected change *inside n8n*, point the monitor's Webhook URL at an n8n **Webhook** trigger node — Screenshot Happy will `POST` a JSON payload there (`monitor_id`, `url`, `comprobado_en`, `cambio_detectado`, `diferencia_porcentaje`) when it fires.

## Current status and source

Published on npm as [`n8n-nodes-screenshot-happy`](https://www.npmjs.com/package/n8n-nodes-screenshot-happy). Not yet verified by n8n (so not yet searchable inside n8n Cloud's node panel) -- that review is in progress. This repository is the complete, public source used to publish the package with npm provenance, as required for n8n community node verification.

## Installation

### Self-hosted n8n

Follow n8n's [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation-and-management), or run:

```bash
npm install n8n-nodes-screenshot-happy
```

in your n8n installation's custom-nodes directory, then restart n8n.

Installing from source also works: copy this folder, run `npm install && npm run build`, then point n8n's `N8N_CUSTOM_EXTENSIONS` environment variable at the resulting `dist` folder.

### n8n Cloud

Once this package passes n8n's verification process, it becomes searchable directly inside the n8n node panel (n8n Cloud only allows verified community nodes). Until then it can be installed manually on a self-hosted instance.

## Credentials

Create a **Screenshot Happy API** credential with your API key (get a free one at the [Screenshot Happy homepage](https://screenshot-api-production-ffd7.up.railway.app/) — no card required, 200 screenshots/month on the Free plan). It's sent as the `x-api-key` header on every request, exactly as documented.

## Compatibility

Built against `n8n-workflow`'s current programmatic node API (`INodeType`, `IExecuteFunctions`). Tested manually against the real, production Screenshot Happy API (`GET /screenshot?url=...&format=png` → `200 OK`, verified live).

## Resources

- [Screenshot Happy documentation](https://screenshot-api-production-ffd7.up.railway.app/docs)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

MIT
