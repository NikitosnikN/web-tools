/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		let path = url.pathname;

		// Serve index.html for root path
		if (path === '/') {
			path = '/matrix.html';
		}

		// Construct the file path
		const filePath = `./pages${path}`;

		try {
			// Fetch the file from the worker's KV or local storage
			const file = await env.ASSETS.fetch(filePath);
			if (file.ok) {
				return file;
			}
		} catch (error) {
			console.error('Error fetching file:', error);
		}

		// Return 404 if file not found
		return new Response('404 Not Found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;
