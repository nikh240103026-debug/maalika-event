# Maalika Event — website

A static, dependency-free landing page. Upload the whole folder to any static host
(Netlify, Vercel, GitHub Pages, cPanel hosting, etc.).

## Deploy with GitHub Pages

The `main` branch is deployed automatically by GitHub Actions whenever you push.

1. In the repository, open **Settings → Pages** and set **Build and deployment → Source**
   to **GitHub Actions**.
2. Open the **Actions** tab and wait for the **Deploy to GitHub Pages** workflow to finish.
3. Visit `https://nikh240103026-debug.github.io/maalika-event/`. Later pushes to `main`
   will publish automatically; you can also start a deployment from **Actions**.

The SEO metadata and sitemap currently use `https://maalikaevent.com/`. To use that
custom domain, add `maalikaevent.com` under **Settings → Pages → Custom domain** and
configure the DNS records with your domain provider. Otherwise, update the domain
references in `index.html`, `robots.txt`, and `sitemap.xml` to match the GitHub Pages URL.

```
robots.txt, sitemap.xml  search-engine files (domain: maalikaevent.com)
index.html            page content, SEO, Open Graph, LocalBusiness structured data
assets/css/styles.css all styling (colour tokens at the top)
assets/js/main.js     interactions (menu, reveal, parallax, lightbox, before/after, enquiry form)
assets/img/           optimised WebP images (800px + large versions) and og-image.jpg
```

## Before going live

1. **Replace the photos** with your own work. Keep the same file names, or update the
   `src`/`srcset` paths in `index.html`. Suggested sizes: 800px wide + 1600px wide WebP
   (1100px for portrait shots). Update each image's `alt` text to describe your photo.
2. **Before/after** (`before-hall`, `after-hall`): use a real before and after of the *same* venue.
3. **Testimonials**: replace the three placeholder `<figure class="testimonial">` blocks
   with real client words (with their permission), and remove `data-placeholder`.
4. **Business hours**: search `index.html` for `BUSINESS_HOURS`.
5. **Domain**: the site is set up for **https://maalikaevent.com/** (canonical link, Open Graph
   URLs, structured data, `robots.txt`, `sitemap.xml`). Register the domain and point it at your
   host. If you end up with a different domain, search-and-replace `maalikaevent.com` across
   `index.html`, `robots.txt` and `sitemap.xml`.
6. After launch, submit `https://maalikaevent.com/sitemap.xml` in Google Search Console and
   create a Google Business Profile for Patna — both help local search.

## Contact details used

- Phone / WhatsApp: +91 62025 40010 (`tel:+916202540010`, `https://wa.me/916202540010`)
- Alternate phone: +91 62050 76576 (`tel:+916205076576`)
- Email: ishansaini577@gmail.com
- Instagram: https://www.instagram.com/maalikaevent/

To change the WhatsApp number, update the `wa.me` links in `index.html` and
`WHATSAPP_NUMBER` at the top of `assets/js/main.js`.
