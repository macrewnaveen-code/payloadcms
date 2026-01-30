/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

// Wrap the generated REST_GET to cap abusive limits coming from the admin UI
// (some clients request very large limits like 10000 which causes huge DB scans)
const rawRestGet = REST_GET(config)
export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url)
    const params = url.searchParams
    const limit = params.get('limit')
    if (limit) {
      const n = Number(limit)
      if (!Number.isNaN(n) && n > 1000) {
        params.set('limit', '1000')
      }
    }
    const proxied = new Request(url.toString(), {
      method: 'GET',
      headers: req.headers,
      body: req.body,
    })
    return rawRestGet(proxied)
  } catch (err) {
    return rawRestGet(req)
  }
}
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
