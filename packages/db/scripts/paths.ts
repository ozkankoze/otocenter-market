/**
 * Depo köküne göre yol yardımcıları.
 *
 * Betiklerde mutlak yol (/home/claude/...) sabitlenmişti; bu, projeyi başka
 * bir bilgisayara taşıyınca sessizce yanlış yere yazıyor ya da hiç çalışmıyordu.
 * Her şey depo köküne göre çözülüyor.
 */
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/** packages/db/scripts → depo kökü */
export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')

/** Üretilen ara dosyalar (içe aktarma şablonu, kontrol çıktıları) */
export const ARTIFACTS_DIR = resolve(REPO_ROOT, 'veri')

/** Sitede yayınlanan ürün görselleri */
export const PRODUCT_IMAGE_DIR = resolve(REPO_ROOT, 'apps/web/public/urun')

export function fromRepo(...parts: string[]): string {
  return resolve(REPO_ROOT, ...parts)
}
