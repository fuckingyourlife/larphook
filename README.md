# Larphook

Larphook is a browser-based webhook sender for Larpcord. It builds valid webhook payloads with message content, username overrides, avatar overrides, embeds, fields, media URLs, author data, footer data, and request status handling.

Made by `@fallinginlove2012`.

## Features

- Send messages to Larpcord webhooks directly from the browser.
- Validate webhook URLs before sending requests.
- Customize the webhook display name per message.
- Customize the webhook avatar per message.
- Send normal message content up to the platform limit.
- Build rich embeds with title, title URL, description, color, and timestamp.
- Add embed author information with optional author icon.
- Add embed thumbnail and full-size image URLs.
- Add embed footer text with optional footer icon.
- Create up to 25 custom embed fields.
- Toggle each embed field between inline and block layout.
- Generate the final JSON payload before sending it.
- Send combined payloads with both normal content and embeds.
- Clear the composer without refreshing the page.
- Display success and error responses from the webhook request.

## Project Structure

```txt
Larphook/
  index.html
  styles.css
  script.js
README.md
LICENSE
```

## Usage

1. Open `Larphook/index.html` in your browser.
2. Paste a Larpcord webhook URL.
3. Configure the message, webhook identity, and embed data.
4. Review the generated JSON payload.
5. Click `Send Webhook`.

## Webhook Format

Larphook accepts Larpcord webhook URLs using this format:

```txt
https://larpcord.net/api/v10/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN
```

## Important

Webhook URLs are secrets. Do not commit real webhook URLs to GitHub, share them publicly, or hardcode them in the project. If a webhook URL is exposed, delete/regenerate it in Larpcord.

## Development

This project is static and does not require a build step.

To edit it, change these files:

- `Larphook/index.html` for the document structure.
- `Larphook/styles.css` for layout rules.
- `Larphook/script.js` for payload generation, validation, and sending.

## License

This project is open-source and available under the MIT License.
