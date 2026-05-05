# Beauty Space — One Page Landing

Premium, minimal, vertikal tek sayfa landing — saf **HTML / CSS / JS**.
İki bağımsız uzman markası için tasarlandı:

- **Ресницы & Брови** — Карина Фельдбуш
- **Любить волосы** — Анастасия Лукашкина

Adres: **ЖК Зорге 9, Москва**

## Çalıştırma

Build adımı yok. `index.html` dosyasını tarayıcıda açmak yeterli.

İstersen yerel bir sunucu üzerinden de servis edebilirsin:

```bash
# Python 3
python3 -m http.server 5173

# veya Node (npx)
npx serve .
```

Sonra tarayıcıda: `http://localhost:5173`

## Dosya yapısı

```
.
├── index.html      # Tüm bölümlerin yapısı (Hero, Concept, Lashes, Hair, Why, Results, Pricing, Atmosphere, Reviews, Contacts, Final CTA)
├── styles.css      # Premium minimal stiller, mobile-first responsive
├── script.js       # Sticky header, mobil menü, smooth scroll, reveal-on-scroll
└── README.md
```

## Özellikler

- Sticky header + mobil hamburger menü
- Smooth scroll (header offset hesaplı)
- Mobile-first responsive: 560px / 860px / 1024px breakpoint'leri
- IntersectionObserver tabanlı yumuşak görünüm animasyonları
- Yandex Maps embed (ЖК Зорге 9)
- Tipografi: Playfair Display + Cormorant Garamond (italic) + Inter
- Renk paleti: koyu gri / siyah, milk / bej, altın aksanlar

## Özelleştirme

### Renk ve tipografi
`styles.css` üst kısmındaki `:root` token'larını değiştir:

```css
:root {
  --color-bg: #f6f3ee;
  --color-ink: #1a1a1a;
  --color-gold: #b9985a;
  --font-serif: "Playfair Display", ...;
  --font-sans: "Inter", ...;
}
```

### İletişim bilgileri
`index.html` içinde `#contacts` bölümünde telefon, WhatsApp, Telegram, Instagram bağlantılarını gerçek değerlerle değiştir:

- `tel:+70000000000`
- `https://wa.me/70000000000`
- `https://t.me/...`
- `https://instagram.com/...`

### Görseller
Şu anda Unsplash CDN üzerinden placeholder görseller kullanılıyor (Hero, servis blokları, galeri).
Kendi görsellerinle değiştirmek için:

- **Hero arkaplanı** → `styles.css` içinde `.hero__bg` selektörü
- **Lashes blok görseli** → `.service__image--lashes`
- **Hair blok görseli** → `.service__image--hair`
- **Galeri** → `.results__img[data-img="lash-1..4"]` ve `.results__img[data-img="hair-1..4"]`

### Fiyatlar
`index.html` içinde `#pricing` bölümündeki `.price-card__list` öğelerinde "от ₽" yazan yerlere gerçek fiyatları yaz.

## Tarayıcı desteği

Modern tarayıcılar (Chrome, Safari, Firefox, Edge — son 2 sürüm). `backdrop-filter` ve `aspect-ratio` kullanıldı.
