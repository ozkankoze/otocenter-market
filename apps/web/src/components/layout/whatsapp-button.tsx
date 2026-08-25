import { DIS_BAGLANTI_REL, SITE } from '@/lib/site'

/**
 * WHATSAPP CANLI DESTEK — sağ altta sabit.
 *
 * Konumlandırma notu: mobilde altta 56px yüksekliğinde sabit bir hızlı erişim
 * barı var (site-header.tsx). Buton onun ÜSTÜNE oturur (`bottom-[72px]`),
 * masaüstünde o bar olmadığı için aşağı iner (`lg:bottom-6`). Aksi hâlde
 * mobilde "Sepet" düğmesinin üzerine biniyordu.
 *
 * `wa.me` adresi cihaza göre doğru davranır: masaüstünde WhatsApp Web ya da
 * masaüstü uygulaması, mobilde doğrudan uygulama açılır. Ayrı bir tespit
 * yapmaya gerek yok — bunu WhatsApp'ın kendi yönlendirmesi hallediyor.
 */
export function WhatsAppButton() {
  return (
    <a
      href={SITE.whatsappHref}
      target="_blank"
      rel={DIS_BAGLANTI_REL}
      title={`WhatsApp'tan ${SITE.phoneDisplay} numarasına yazın`}
      aria-label={`WhatsApp ile canlı destek — ${SITE.phoneDisplay}`}
      data-testid="whatsapp-button"
      className={[
        'group fixed right-4 bottom-[72px] z-80 inline-flex items-center gap-0 lg:right-6 lg:bottom-6',
        'rounded-full bg-[#25D366] text-white shadow-lg',
        'transition-[background-color,box-shadow,gap,padding] duration-200 ease-out',
        'hover:bg-[#1EBE5B] hover:shadow-xl focus-visible:bg-[#1EBE5B]',
        'focus-visible:ring-4 focus-visible:ring-[#25D366]/35 focus-visible:outline-none',
        // Masaüstünde hover/odakta yazı açılır; mobilde yalnızca ikon kalır.
        'lg:hover:gap-2.5 lg:focus-visible:gap-2.5',
      ].join(' ')}
    >
      <span className="inline-flex h-14 w-14 items-center justify-center">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.47 0 1.46 1.06 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z" />
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.03h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23a8.19 8.19 0 0 1 5.82 2.42 8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.21-8.23 8.21z" />
        </svg>
      </span>
      <span className="hidden max-w-0 overflow-hidden text-[14px] font-semibold whitespace-nowrap transition-[max-width,padding] duration-200 ease-out lg:inline lg:group-hover:max-w-[170px] lg:group-hover:pr-5 lg:group-focus-visible:max-w-[170px] lg:group-focus-visible:pr-5">
        WhatsApp Destek
      </span>
    </a>
  )
}
