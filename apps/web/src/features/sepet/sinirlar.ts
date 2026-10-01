/**
 * Sepet sınırları — İSTEMCİ tarafı kopyası.
 *
 * Asıl sınır sunucuda (`@ocm/db` → `SATIR_ADET_SINIRI`, `SEPET_SATIR_SINIRI`,
 * `UCRETSIZ_KARGO_ESIGI_KURUS`) uygulanır. Bu dosya yalnızca arayüzün aynı
 * sınırı göstermesi içindir; `@ocm/db` tarayıcı paketine alınamadığı (pg
 * sürücüsünü taşıdığı) için sayılar burada tekrar yazıldı. Değişirse ikisi
 * birlikte değişmeli — uyuşmazlıkta sunucu kazanır, para tarafı etkilenmez.
 */
export const SATIR_ADET_SINIRI = 99
export const SEPET_SATIR_SINIRI = 50
export const UCRETSIZ_KARGO_ESIGI_KURUS = 50_000
