import { sql, type Kysely, type Transaction } from 'kysely'
import type { Database } from './types'

/**
 * Çözümleme hem normal bağlantıyla hem de açık bir işlem (transaction) içinde
 * çalışabilir. İşlem desteği KURU ÇALIŞMA (dry-run) için gerekli: ölçüm modunda
 * içe aktarma ve çözümleme aynı işlemde çalıştırılıp sonunda geri alınır, böylece
 * gerçek süre ölçülürken veritabanına tek satır yazılmaz.
 */
export type Baglanti = Kysely<Database> | Transaction<Database>

/**
 * ÇÖZÜMLEME MOTORU — Katman 2 (assertion) → Katman 3 (product_compatibility)
 * Referans: 03-FINAL-MIMARI.md §2.3
 *
 * Politika (sırayla):
 *   1. Aktif bir MANUAL iddia varsa → o kazanır.                 VERIFIED / INCOMPATIBLE
 *   2. Kaynaklar UYUMLU/UYUMSUZ diye çelişiyorsa → kimse kazanmaz.  CONFLICTED
 *   3. Yıl aralıkları ayrık (kesişmiyor) ise → çelişki.             CONFLICTED
 *   4. Hepsi hemfikirse → en yüksek trust_level'lı kaynak kazanır.  SOURCED / INCOMPATIBLE
 *   5. Hiç iddia yoksa → satır yok (= "bilinmiyor", gri rozet).
 *
 * KRİTİK: CONFLICTED durumu arayüzde ASLA "uyumlu" gösterilmez.
 */
export async function resolveCompatibility(db: Baglanti): Promise<{
  resolved: number
  conflicts: number
  removed: number
}> {
  // 1) İddialardan çözümlenmiş uyumluluğu üret (upsert)
  const upsert = await sql<{ count: string }>`
    WITH active AS (
      SELECT a.id, a.product_id, a.engine_id, a.source_id, a.assertion_type,
             a.year_from, a.year_to, a.month_from, a.month_to, a.restriction,
             a.asserted_at, s.kind, s.trust_level
      FROM compatibility_assertion a
      JOIN data_source s ON s.id = a.source_id
      WHERE a.is_active AND s.is_active
    ),
    agg AS (
      SELECT product_id,
             engine_id,
             bool_or(kind = 'MANUAL')                                    AS has_manual,
             count(*) FILTER (WHERE assertion_type = 'COMPATIBLE')       AS n_compat,
             count(*) FILTER (WHERE assertion_type = 'INCOMPATIBLE')     AS n_incompat,
             count(DISTINCT source_id)                                   AS n_sources,
             -- yıl aralıkları ayrık mı? (en geç başlangıç > en erken bitiş)
             (max(year_from) FILTER (WHERE year_from IS NOT NULL)
                > min(year_to) FILTER (WHERE year_to IS NOT NULL))       AS year_disjoint
      FROM active
      GROUP BY product_id, engine_id
    ),
    pick AS (
      SELECT DISTINCT ON (product_id, engine_id)
             product_id, engine_id, id AS assertion_id, source_id, assertion_type,
             year_from, year_to, month_from, month_to, restriction, trust_level, kind
      FROM active
      ORDER BY product_id, engine_id,
               (kind = 'MANUAL') DESC, trust_level DESC, asserted_at DESC, id DESC
    ),
    upserted AS (
      INSERT INTO product_compatibility (
        engine_id, product_id, status, year_from, year_to, month_from, month_to,
        restriction, winning_assertion_id, source_id, confidence, has_conflict, updated_at
      )
      SELECT
        p.engine_id,
        p.product_id,
        CASE
          WHEN g.has_manual AND p.assertion_type = 'COMPATIBLE'   THEN 'VERIFIED'
          WHEN g.has_manual AND p.assertion_type = 'INCOMPATIBLE' THEN 'INCOMPATIBLE'
          WHEN g.n_compat > 0 AND g.n_incompat > 0                THEN 'CONFLICTED'
          WHEN coalesce(g.year_disjoint, false) AND g.n_sources > 1 THEN 'CONFLICTED'
          WHEN p.assertion_type = 'INCOMPATIBLE'                  THEN 'INCOMPATIBLE'
          ELSE 'SOURCED'
        END::compat_status,
        p.year_from, p.year_to, p.month_from, p.month_to, p.restriction,
        p.assertion_id,
        p.source_id,
        CASE WHEN g.has_manual THEN 100 ELSE p.trust_level END,
        -- MANUAL bir karar varsa çakışma ÇÖZÜLMÜŞ demektir; admin kuyruğunda
        -- tekrar görünmemelidir.
        (NOT g.has_manual) AND (
          (g.n_compat > 0 AND g.n_incompat > 0)
          OR (coalesce(g.year_disjoint, false) AND g.n_sources > 1)
        ),
        now()
      FROM pick p
      JOIN agg g USING (product_id, engine_id)
      ON CONFLICT (engine_id, product_id) DO UPDATE SET
        status               = EXCLUDED.status,
        year_from            = EXCLUDED.year_from,
        year_to              = EXCLUDED.year_to,
        month_from           = EXCLUDED.month_from,
        month_to             = EXCLUDED.month_to,
        restriction          = EXCLUDED.restriction,
        winning_assertion_id = EXCLUDED.winning_assertion_id,
        source_id            = EXCLUDED.source_id,
        confidence           = EXCLUDED.confidence,
        has_conflict         = EXCLUDED.has_conflict,
        updated_at           = now()
      RETURNING 1
    )
    SELECT count(*)::text AS count FROM upserted
  `.execute(db)

  // 2) Artık hiç aktif iddiası kalmayan satırları sil ("bilinmiyor"a dön)
  const removed = await sql<{ count: string }>`
    WITH deleted AS (
      DELETE FROM product_compatibility pc
      WHERE NOT EXISTS (
        SELECT 1
        FROM compatibility_assertion a
        JOIN data_source s ON s.id = a.source_id
        WHERE a.product_id = pc.product_id
          AND a.engine_id  = pc.engine_id
          AND a.is_active AND s.is_active
      )
      RETURNING 1
    )
    SELECT count(*)::text AS count FROM deleted
  `.execute(db)

  // 3) Çakışma kuyruğunu senkronla — admin "Veri Çakışmaları" ekranı bunu okur
  await sql`
    INSERT INTO data_conflict (entity_type, product_id, engine_id, field, candidates, severity)
    SELECT 'COMPATIBILITY',
           pc.product_id,
           pc.engine_id,
           NULL,
           (
             SELECT jsonb_agg(jsonb_build_object(
                      'assertionId', a.id,
                      'sourceId',    s.id,
                      'sourceCode',  s.code,
                      'sourceName',  s.name,
                      'trustLevel',  s.trust_level,
                      'value',       a.assertion_type,
                      'yearFrom',    a.year_from,
                      'yearTo',      a.year_to,
                      'assertedAt',  a.asserted_at
                    ) ORDER BY s.trust_level DESC)
             FROM compatibility_assertion a
             JOIN data_source s ON s.id = a.source_id
             WHERE a.product_id = pc.product_id AND a.engine_id = pc.engine_id
               AND a.is_active AND s.is_active
           ),
           'HIGH'::conflict_severity
    FROM product_compatibility pc
    WHERE pc.has_conflict
      AND NOT EXISTS (
        SELECT 1 FROM data_conflict c
        WHERE c.entity_type = 'COMPATIBILITY'
          AND c.product_id = pc.product_id
          AND c.engine_id  = pc.engine_id
          AND c.status = 'OPEN'
      )
  `.execute(db)

  // 4) Artık çelişmeyen açık kayıtları kapat
  await sql`
    UPDATE data_conflict c
    SET status = 'RESOLVED', resolved_at = now()
    WHERE c.status = 'OPEN'
      AND c.entity_type = 'COMPATIBILITY'
      AND NOT EXISTS (
        SELECT 1 FROM product_compatibility pc
        WHERE pc.product_id = c.product_id
          AND pc.engine_id  = c.engine_id
          AND pc.has_conflict
      )
  `.execute(db)

  const conflicts = await sql<{ count: string }>`
    SELECT count(*)::text AS count FROM data_conflict WHERE status = 'OPEN'
  `.execute(db)

  return {
    resolved: Number(upsert.rows[0]?.count ?? 0),
    removed: Number(removed.rows[0]?.count ?? 0),
    conflicts: Number(conflicts.rows[0]?.count ?? 0),
  }
}

/**
 * TÜRETİLMİŞ İNDEKS — engine_category_index yeniden hesaplanır.
 * Programatik SEO'nun kapı bekçisi: product_count = 0 olan araç×kategori
 * sayfası ÜRETİLMEZ ve sitemap'e girmez (03-FINAL-MIMARI.md §11).
 *
 * Yalnızca VERIFIED ve SOURCED sayılır — CONFLICTED sayfayı doğurmaz.
 */
export async function rebuildEngineCategoryIndex(db: Baglanti): Promise<number> {
  await sql`TRUNCATE engine_category_index`.execute(db)

  const res = await sql<{ count: string }>`
    WITH rows AS (
      INSERT INTO engine_category_index (
        engine_id, category_id, product_count, verified_count, brand_count,
        min_price, max_price, updated_at
      )
      SELECT pc.engine_id,
             p.category_id,
             count(DISTINCT p.id),
             count(DISTINCT p.id) FILTER (WHERE pc.status = 'VERIFIED'),
             count(DISTINCT p.brand_id),
             min(pr.price_net * (1 + pr.tax_rate / 100.0)),
             max(pr.price_net * (1 + pr.tax_rate / 100.0)),
             now()
      FROM product_compatibility pc
      JOIN product p ON p.id = pc.product_id AND p.status = 'ACTIVE'
      LEFT JOIN product_variant v ON v.product_id = p.id AND v.is_default
      LEFT JOIN price pr ON pr.variant_id = v.id AND pr.customer_group = 'RETAIL'
      WHERE pc.status IN ('VERIFIED', 'SOURCED')
      GROUP BY pc.engine_id, p.category_id
      RETURNING 1
    )
    SELECT count(*)::text AS count FROM rows
  `.execute(db)

  return Number(res.rows[0]?.count ?? 0)
}
