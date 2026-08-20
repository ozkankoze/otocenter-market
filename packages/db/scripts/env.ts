import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Minimal .env yükleyici — monorepo kökündeki .env dosyasını okur.
 * (Harici bağımlılık eklememek için dotenv yerine bu kullanılıyor.)
 */
export function loadEnv(): void {
  const here = dirname(fileURLToPath(import.meta.url))
  const candidates = [
    resolve(here, '../.env'),
    resolve(here, '../../../.env'),
    resolve(process.cwd(), '.env'),
  ]

  for (const file of candidates) {
    if (!existsSync(file)) continue
    for (const rawLine of readFileSync(file, 'utf8').split('\n')) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      const eq = line.indexOf('=')
      if (eq === -1) continue
      const key = line.slice(0, eq).trim()
      let value = line.slice(eq + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (!(key in process.env)) process.env[key] = value
    }
    return
  }
}
