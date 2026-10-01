/**
 * Kysely veritabanı tipleri.
 * TEK DOĞRULUK KAYNAĞI: `migrations/*.sql`
 * Bu dosya o SQL'in TypeScript karşılığıdır; `npm run db:check` ile
 * (Faz 3) canlı şemaya karşı doğrulanacaktır.
 */
import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

// ─────────────────────────────── ENUM'LAR ───────────────────────────────────

export const VEHICLE_FUEL_TYPES = ['DIZEL', 'BENZIN', 'LPG', 'HIBRIT', 'ELEKTRIK', 'CNG'] as const
export type VehicleFuelType = (typeof VEHICLE_FUEL_TYPES)[number]

export const PRODUCT_STATUSES = ['DRAFT', 'ACTIVE', 'ARCHIVED'] as const
export type ProductStatus = (typeof PRODUCT_STATUSES)[number]

/**
 * Çözümlenmiş uyumluluk durumu.
 * KRİTİK KURAL: yalnızca VERIFIED ve SOURCED arayüzde "uyumlu" gösterilir.
 * CONFLICTED asla yeşil rozet almaz.
 */
export const COMPAT_STATUSES = ['VERIFIED', 'SOURCED', 'CONFLICTED', 'INCOMPATIBLE'] as const
export type CompatStatus = (typeof COMPAT_STATUSES)[number]

export const ASSERTION_TYPES = ['COMPATIBLE', 'INCOMPATIBLE'] as const
export type AssertionType = (typeof ASSERTION_TYPES)[number]

export const SOURCE_KINDS = [
  'MANUAL',
  'CATALOG',
  'MANUFACTURER',
  'SUPPLIER',
  'CSV',
  'DERIVED',
] as const
export type SourceKind = (typeof SOURCE_KINDS)[number]

export const REFERENCE_TYPES = [
  'OEM',
  'CROSS_EQUIVALENT',
  'CROSS_REPLACES',
  'CROSS_REPLACED_BY',
] as const
export type ReferenceType = (typeof REFERENCE_TYPES)[number]

export const CONFLICT_STATUSES = ['OPEN', 'RESOLVED', 'IGNORED'] as const
export type ConflictStatus = (typeof CONFLICT_STATUSES)[number]

export const CONFLICT_SEVERITIES = ['HIGH', 'MEDIUM', 'LOW'] as const
export type ConflictSeverity = (typeof CONFLICT_SEVERITIES)[number]

// ── Sprint 4: import pipeline ──
export const IMPORT_STATUSES = [
  'UPLOADED',
  'PARSED',
  'VALIDATED',
  'COMMITTING',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
  'ROLLED_BACK',
] as const
export type ImportStatus = (typeof IMPORT_STATUSES)[number]

export const IMPORT_SHEETS = [
  'CATEGORY',
  'VEHICLE',
  'PRODUCT',
  'PRICE_STOCK',
  'REFERENCE',
  'COMPATIBILITY',
] as const
export type ImportSheet = (typeof IMPORT_SHEETS)[number]

export const IMPORT_ROW_STATUSES = ['VALID', 'WARNING', 'ERROR', 'SKIPPED', 'APPLIED'] as const
export type ImportRowStatus = (typeof IMPORT_ROW_STATUSES)[number]

export const IMPORT_ACTIONS = ['CREATE', 'UPDATE', 'UNCHANGED', 'NONE'] as const
export type ImportAction = (typeof IMPORT_ACTIONS)[number]

export const ATTRIBUTE_DATA_TYPES = ['NUMBER', 'TEXT', 'ENUM', 'BOOL'] as const
export type AttributeDataType = (typeof ATTRIBUTE_DATA_TYPES)[number]

// ─────────────────────────── ORTAK KOLON TİPLERİ ────────────────────────────

type Timestamp = ColumnType<Date, Date | string | undefined, Date | string>
/** pg sürücüsü NUMERIC'i number'a çevirecek şekilde yapılandırıldı (client.ts) */
type Numeric = ColumnType<number, number | string, number | string>
type Json = ColumnType<Record<string, unknown>, unknown, unknown>

// ──────────────────────────────── TABLOLAR ──────────────────────────────────

export interface DataSourceTable {
  id: Generated<number>
  code: string
  name: string
  kind: SourceKind
  trust_level: Generated<number>
  is_active: Generated<boolean>
  config: Json | null
  created_at: Generated<Timestamp>
}

export interface VehicleTypeTable {
  id: Generated<number>
  name: string
  slug: string
  icon: string | null
  sort_order: Generated<number>
  is_active: Generated<boolean>
}

export interface VehicleBrandTable {
  id: Generated<number>
  name: string
  slug: string
  logo_url: string | null
  country: string | null
  is_popular: Generated<boolean>
  sort_order: Generated<number>
  is_active: Generated<boolean>
  external_refs: Json | null
}

export interface VehicleBrandTypeTable {
  brand_id: number
  type_id: number
}

export interface VehicleModelTable {
  id: Generated<number>
  brand_id: number
  name: string
  slug: string
  code: string | null
  year_from: number | null
  year_to: number | null
  body_type: string | null
  image_url: string | null
  sort_order: Generated<number>
  is_active: Generated<boolean>
}

export interface VehicleGenerationTable {
  id: Generated<number>
  model_id: number
  name: string
  code: string | null
  year_from: number | null
  year_to: number | null
  is_facelift: Generated<boolean>
}

export interface VehicleEngineTable {
  id: Generated<number>
  generation_id: number
  model_id: number
  name: string
  slug: string
  engine_codes: Generated<string[]>
  displacement_cc: number | null
  power_kw: number | null
  power_hp: number | null
  fuel_type: VehicleFuelType
  cylinders: number | null
  valves: number | null
  year_from: number | null
  year_to: number | null
  body_note: string | null
  sort_order: Generated<number>
  is_active: Generated<boolean>
  external_refs: Json | null
}

export interface ProductBrandTable {
  id: Generated<number>
  name: string
  slug: string
  logo_url: string | null
  country: string | null
  description: string | null
  seo_title: string | null
  seo_description: string | null
  is_featured: Generated<boolean>
  sort_order: Generated<number>
  is_active: Generated<boolean>
}

export interface CategoryTable {
  id: Generated<number>
  parent_id: number | null
  code: string
  name: string
  slug: string
  path: string
  depth: Generated<number>
  icon: string | null
  image_url: string | null
  description: string | null
  seo_title: string | null
  seo_description: string | null
  seo_intro: string | null
  sort_order: Generated<number>
  is_active: Generated<boolean>
}

export interface CategoryAttributeTable {
  id: Generated<number>
  category_id: number
  key: string
  label: string
  unit: string | null
  data_type: Generated<AttributeDataType>
  enum_values: Generated<string[]>
  is_facet: Generated<boolean>
  is_filterable: Generated<boolean>
  sort_order: Generated<number>
}

export interface ProductTable {
  id: Generated<number>
  sku: string
  slug: string
  name: string
  product_code: string | null
  brand_id: number
  category_id: number
  short_description: string | null
  description: string | null
  specs: Generated<Json>
  status: Generated<ProductStatus>
  is_featured: Generated<boolean>
  sort_weight: Generated<number>
  seo_title: string | null
  seo_description: string | null
  created_at: Generated<Timestamp>
  updated_at: Generated<Timestamp>
  search_vector: ColumnType<string, never, never>
}

export interface ProductVariantTable {
  id: Generated<number>
  product_id: number
  sku: string
  name: string | null
  barcode: string | null
  pack_size: Generated<Numeric>
  unit: Generated<string>
  weight_gr: number | null
  is_default: Generated<boolean>
  is_active: Generated<boolean>
}

export interface PriceTable {
  id: Generated<number>
  variant_id: number
  price_net: Numeric
  tax_rate: Generated<number>
  list_price: Numeric | null
  currency: Generated<string>
  customer_group: Generated<string>
  valid_from: Generated<Timestamp>
  valid_to: Timestamp | null
}

export interface StockTable {
  id: Generated<number>
  variant_id: number
  warehouse_code: Generated<string>
  quantity: Generated<number>
  reserved: Generated<number>
  lead_time_days: number | null
  updated_at: Generated<Timestamp>
}

export interface ProductImageTable {
  id: Generated<number>
  product_id: number
  url: string
  alt: string | null
  sort_order: Generated<number>
  is_primary: Generated<boolean>
}

export interface CompatibilityAssertionTable {
  id: Generated<number>
  product_id: number
  engine_id: number
  source_id: number
  import_job_id: number | null
  assertion_type: Generated<AssertionType>
  year_from: number | null
  year_to: number | null
  month_from: number | null
  month_to: number | null
  restriction: string | null
  note: string | null
  expanded_from: string | null
  is_active: Generated<boolean>
  asserted_at: Generated<Timestamp>
}

export interface AttributeAssertionTable {
  id: Generated<number>
  product_id: number
  key: string
  value: ColumnType<unknown, unknown, unknown>
  source_id: number
  asserted_at: Generated<Timestamp>
}

export interface ProductCompatibilityTable {
  engine_id: number
  product_id: number
  status: CompatStatus
  year_from: number | null
  year_to: number | null
  month_from: number | null
  month_to: number | null
  restriction: string | null
  winning_assertion_id: number | null
  source_id: number | null
  confidence: Generated<number>
  has_conflict: Generated<boolean>
  verified_by_user_id: number | null
  verified_at: Timestamp | null
  updated_at: Generated<Timestamp>
}

export interface ProductReferenceTable {
  id: Generated<number>
  product_id: number
  type: ReferenceType
  brand_name: string | null
  vehicle_brand_id: number | null
  number: string
  normalized: string
  source_id: number | null
  import_job_id: number | null
  note: string | null
}

export interface DataConflictTable {
  id: Generated<number>
  entity_type: string
  product_id: number | null
  engine_id: number | null
  field: string | null
  candidates: ColumnType<unknown, unknown, unknown>
  status: Generated<ConflictStatus>
  severity: Generated<ConflictSeverity>
  resolved_assertion_id: number | null
  resolved_by_user_id: number | null
  resolved_at: Timestamp | null
  created_at: Generated<Timestamp>
}

export interface EngineCategoryIndexTable {
  engine_id: number
  category_id: number
  product_count: Generated<number>
  verified_count: Generated<number>
  brand_count: Generated<number>
  min_price: Numeric | null
  max_price: Numeric | null
  updated_at: Generated<Timestamp>
}

export interface MigrationTable {
  name: string
  applied_at: Generated<Timestamp>
}

// ─────────────────────────── VERİTABANI ARAYÜZÜ ─────────────────────────────

export interface AdminUserTable {
  id: Generated<number>
  email: string
  name: string
  role: Generated<string>
  is_active: Generated<boolean>
  created_at: Generated<Timestamp>
}

export interface ImportJobTable {
  id: Generated<number>
  file_name: string
  file_size: Generated<number>
  file_hash: string | null
  source_id: number
  status: Generated<ImportStatus>
  created_by_user_id: number | null
  rolled_back_by_user_id: number | null
  sheet_counts: Generated<Json>
  totals: Generated<Json>
  options: Generated<Json>
  error_message: string | null
  created_at: Generated<Timestamp>
  parsed_at: Timestamp | null
  validated_at: Timestamp | null
  committed_at: Timestamp | null
  rolled_back_at: Timestamp | null
}

export interface ImportStagingRowTable {
  id: Generated<number>
  import_job_id: number
  sheet: ImportSheet
  row_no: number
  raw: Json
  normalized: Json | null
  status: Generated<ImportRowStatus>
  action: Generated<ImportAction>
  entity_type: string | null
  entity_id: number | null
  messages: Generated<ColumnType<unknown, unknown, unknown>>
}

export interface ImportChangeTable {
  id: Generated<number>
  import_job_id: number
  entity_type: string
  entity_id: number
  operation: 'INSERT' | 'UPDATE'
  before: Json | null
  after: Json | null
  created_at: Generated<Timestamp>
  reverted_at: Timestamp | null
  skip_reason: string | null
}


// ─────────────────────────── SİPARİŞ VE ÖDEME (0005) ─────────────────────────

export const ORDER_STATUSES = [
  'PENDING_PAYMENT',
  'PAID',
  'PAYMENT_FAILED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const INVOICE_TYPES = ['BIREYSEL', 'KURUMSAL'] as const
export type InvoiceType = (typeof INVOICE_TYPES)[number]

export const SHIPPING_PAYERS = ['SATICI', 'ALICI'] as const
export type ShippingPayer = (typeof SHIPPING_PAYERS)[number]

/** BIGINT kuruş tutarları — client.ts INT8'i number'a çeviriyor. */
type Kurus = ColumnType<number, number, number>
/**
 * Varsayılanı veritabanında olan zaman damgası. `ZamanVarsayilanli` iç içe
 * ColumnType ürettiği için seçimde Date yerine ColumnType tipi dönüyordu.
 */
type ZamanVarsayilanli = ColumnType<Date, Date | string | undefined, Date | string>

export interface CustomerOrderTable {
  id: Generated<number>
  order_no: string
  status: Generated<OrderStatus>
  full_name: string
  email: string
  phone: string
  ship_city: string
  ship_district: string
  ship_address: string
  ship_postal_code: string | null
  invoice_type: Generated<InvoiceType>
  invoice_name: string | null
  invoice_tax_office: string | null
  invoice_tax_no: string | null
  invoice_address: string | null
  subtotal_kurus: Kurus
  shipping_kurus: Generated<number>
  shipping_payer: ShippingPayer
  total_kurus: Kurus
  currency: Generated<string>
  paid_total_kurus: number | null
  installment_count: number | null
  payment_type: string | null
  test_mode: Generated<boolean>
  failed_reason_code: string | null
  failed_reason_msg: string | null
  stock_shortage: Generated<boolean>
  cargo_company: string | null
  tracking_no: string | null
  terms_version: string
  terms_accepted_at: Timestamp
  customer_ip: string
  admin_note: string | null
  created_at: ZamanVarsayilanli
  updated_at: ZamanVarsayilanli
  paid_at: Timestamp | null
  shipped_at: Timestamp | null
}

export interface OrderItemTable {
  id: Generated<number>
  order_id: number
  variant_id: number | null
  product_id: number | null
  sku: string
  product_title: string
  product_slug: string | null
  quantity: number
  unit_price_kurus: Kurus
  tax_rate: number
  line_total_kurus: Kurus
}

export interface PaymentNotificationTable {
  id: Generated<number>
  order_no: string | null
  status: string | null
  total_amount: number | null
  hash_valid: boolean
  outcome: string
  payload: Json
  received_at: ZamanVarsayilanli
}

export interface Database {
  data_source: DataSourceTable
  vehicle_type: VehicleTypeTable
  vehicle_brand: VehicleBrandTable
  vehicle_brand_type: VehicleBrandTypeTable
  vehicle_model: VehicleModelTable
  vehicle_generation: VehicleGenerationTable
  vehicle_engine: VehicleEngineTable
  product_brand: ProductBrandTable
  category: CategoryTable
  category_attribute: CategoryAttributeTable
  product: ProductTable
  product_variant: ProductVariantTable
  price: PriceTable
  stock: StockTable
  product_image: ProductImageTable
  compatibility_assertion: CompatibilityAssertionTable
  attribute_assertion: AttributeAssertionTable
  product_compatibility: ProductCompatibilityTable
  product_reference: ProductReferenceTable
  data_conflict: DataConflictTable
  engine_category_index: EngineCategoryIndexTable
  admin_user: AdminUserTable
  import_job: ImportJobTable
  import_staging_row: ImportStagingRowTable
  import_change: ImportChangeTable
  customer_order: CustomerOrderTable
  order_item: OrderItemTable
  payment_notification: PaymentNotificationTable
  _ocm_migration: MigrationTable
}

// Kısayol tipler
export type VehicleType = Selectable<VehicleTypeTable>
export type VehicleBrand = Selectable<VehicleBrandTable>
export type VehicleModel = Selectable<VehicleModelTable>
export type VehicleEngine = Selectable<VehicleEngineTable>
export type Category = Selectable<CategoryTable>
export type Product = Selectable<ProductTable>
export type NewProduct = Insertable<ProductTable>
export type ProductUpdate = Updateable<ProductTable>
export type ProductCompatibility = Selectable<ProductCompatibilityTable>
export type ImportJob = Selectable<ImportJobTable>
export type ImportStagingRow = Selectable<ImportStagingRowTable>
export type ImportChange = Selectable<ImportChangeTable>
export type AdminUser = Selectable<AdminUserTable>
export type CustomerOrder = Selectable<CustomerOrderTable>
export type OrderItem = Selectable<OrderItemTable>
