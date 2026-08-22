import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { PageBody, PageHero, Prose } from '@/components/layout/page-shell'
import { REHBER_YAZILARI, rehberBul } from '@/features/content/rehber'
import type { Crumb } from '@/components/ui/breadcrumb'

type Props = { params: Promise<{ slug: string }> }

/** Yazılar statik; hepsi derleme anında üretilir. */
export function generateStaticParams() {
  return REHBER_YAZILARI.map((y) => ({ slug: y.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const yazi = rehberBul(slug)
  if (!yazi) return { title: 'Yazı bulunamadı' }
  return {
    title: yazi.title,
    description: yazi.summary,
    alternates: { canonical: `/blog/${yazi.slug}` },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const yazi = rehberBul(slug)
  if (!yazi) notFound()

  const digerleri = REHBER_YAZILARI.filter((y) => y.slug !== yazi.slug).slice(0, 3)
  const crumbs: Crumb[] = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: yazi.title },
  ]

  return (
    <>
      <PageHero eyebrow={yazi.tag} title={yazi.title} description={yazi.summary} crumbs={crumbs}>
        <p className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] text-white/55">
          <Clock size={13} aria-hidden="true" />
          {yazi.readMinutes} dakika okuma
        </p>
      </PageHero>

      <PageBody>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <article>
            <Prose>
              {yazi.body.map((bolum) => (
                <section key={bolum.heading}>
                  <h2>{bolum.heading}</h2>
                  {bolum.paragraphs.map((p) => (
                    <p key={p.slice(0, 40)}>{p}</p>
                  ))}
                  {bolum.list ? (
                    <ul>
                      {bolum.list.map((m) => (
                        <li key={m.slice(0, 40)}>{m}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </Prose>

            <Card className="mt-8 flex flex-wrap items-center justify-between gap-4 bg-brand-50 p-5">
              <div>
                <b className="block text-sm font-semibold text-ink-900">
                  Aracınıza uyan ürünü görün
                </b>
                <p className="mt-1 text-[13px] text-ink-600">
                  Uyumluluk motor kodu seviyesinde doğrulanır.
                </p>
              </div>
              <Link
                href={yazi.relatedHref}
                prefetch={false}
                className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-brand-600 hover:underline"
              >
                {yazi.relatedLabel}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </Card>
          </article>

          <aside>
            <span className="ocm-eyebrow">Diğer yazılar</span>
            <div className="mt-4 space-y-3">
              {digerleri.map((y) => (
                <Link key={y.slug} href={`/blog/${y.slug}`} prefetch={false}>
                  <Card interactive className="p-4">
                    <span className="text-[11px] font-semibold tracking-wider text-brand-600 uppercase">
                      {y.tag}
                    </span>
                    <b className="mt-1.5 block text-[14.5px] leading-snug font-semibold text-ink-900">
                      {y.title}
                    </b>
                    <p className="mt-1.5 line-clamp-2 text-[12.5px] text-ink-600">{y.summary}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </PageBody>
    </>
  )
}
