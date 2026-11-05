# Search and AI discoverability

Production origin: https://graphcam.harazizsingh.com

## Implementation

- Route metadata and product facts live in `src/lib/seo.ts`.
- Public pages include canonical URLs, social cards, and linked WebSite, WebPage, and WebApplication JSON-LD.
- The homepage FAQ is visible to visitors and generated from the same facts as its FAQPage schema.
- The root defaults to `noindex, follow`; public marketing routes explicitly opt into indexing. Account and personal workspace pages are excluded from the sitemap.
- `public/robots.txt` permits crawling, including of noindex pages so crawlers can read that directive. This does not change authentication or authorize access to private data.
- `public/sitemap.xml` lists only public informational pages. Update it when those routes change. URL fragments are not separate pages.
- `public/social-card.png` is a static 1200 × 630 preview image.

## Verification and maintenance

After deployment, check page source for canonical URLs and parse the JSON-LD, fetch `/robots.txt` and `/sitemap.xml`, and verify account pages stay non-indexable. Check structured data with Schema.org Validator; Google only supports some schema types as rich results, and FAQ rich results have restricted eligibility.

Submit the sitemap in Google Search Console and Bing Webmaster Tools using the site owner's accounts. Inspect the indexed homepage and check hosting/CDN crawler rules; repository changes cannot override a CDN block. Track organic visits, AI referrals, and conversions where analytics are already available. Revisit content and sample AI-search citations quarterly. A third-party audit score does not establish actual citation visibility, and indexing or citations are not guaranteed.

Keep product descriptions factual. Do not add invented reviews, prices, credentials, or automatic freshness dates. Preserve the existing app logic and Lovable integration. AI search bots and AI training bots serve different purposes; these changes do not add any special training permissions.

## Validation for this change

Production build and TypeScript checks pass before and after the changes. ESLint passes for all changed TypeScript files. All 4 existing tests pass. Browser smoke check: selecting the quadratic sample updates the plotted function and its mathematical details. The trained model and inference code are unchanged; a new end-to-end model classification was not run.

Local HTTP checks verify one canonical URL, one robots meta tag, one H1 on each public page, valid JSON-LD, visible FAQ/schema agreement, public-only sitemap URLs, crawler configuration, social image delivery, and non-indexable 404 responses. Workspace/account routes remain noindex and contain no public product JSON-LD.

These checks verify the local application, not production deployment, indexing, or AI citations. Merge and deploy the branch before performing the live-site checks above.
