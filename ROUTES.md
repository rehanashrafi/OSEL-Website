# OSEL navigation and route coverage

Source: https://oseldevices.com/ (header and footer links inspected 2026-09-30), plus https://oseldevices.com/products/led-displays/.

All pages are intentionally minimal Server Component skeletons. The existing shared layout and theme are preserved.

| Existing source path/category | Canonical V2 route | Page component |
| --- | --- | --- |
| / | / | home/HomePage |
| /about-us/ | /about | about/AboutPage |
| /management/ | /about/management | about/ManagementPage |
| /events-and-awards/ | /about/events-and-awards | about/EventsAndAwardsPage |
| /manufacturing/ | /about/manufacturing | about/ManufacturingPage |
| /clients/ | /about/clients | about/ClientsPage |
| /products/ | /products | products/ProductsPage |
| /products/led-displays/ | /products/led-displays | products/LedDisplaysPage |
| /hearing-aids/ | /products/hearing-aids | products/HearingAidsPage |
| /philips-mobile/ | /products/mobile-phones | products/MobilePhonesPage |
| /investor/ | /investors | investors/InvestorsPage |
| /investor-information/ | /investors/investor-information | investors/InvestorInformationPage |
| /corporate-announcements/ | /investors/corporate-announcements | investors/CorporateAnnouncementsPage |
| /disclosure-under-regulation-46-of-sebi-lodr-regulations-2015/ | /investors/regulation-46 | investors/Regulation46Page |
| /financial-information/ | /investors/financial-information | investors/FinancialInformationPage |
| # navigation category | /investors/corporate-governance | investors/CorporateGovernancePage |
| /conference-call-transcripts/ | /investors/conference-call-transcripts | investors/ConferenceCallTranscriptsPage |
| /audio-video-recording-of-transcript/ | /investors/audio-video-recordings | investors/AudioVideoRecordingsPage |
| /smart-odr/ | /investors/smart-odr | investors/SmartOdrPage |
| /annual-report/ | /investors/annual-reports | investors/AnnualReportsPage |
| /agm-egm-video/ | /investors/agm-egm-recordings | investors/AgmEgmRecordingsPage |
| /external-ratings/ | /investors/external-ratings | investors/ExternalRatingsPage |
| /annual-return/ | /investors/annual-return | investors/AnnualReturnPage |
| /annual-action-plan-for-csr/ | /investors/annual-action-plan-for-csr | investors/CsrActionPlanPage |
| /shareholding-patterns/ | /investors/shareholding-patterns | investors/ShareholdingPatternsPage |
| /notice-of-candidature-u-s-160/ | /investors/notice-of-candidature | investors/NoticeOfCandidaturePage |
| /audited-financial-statements-of-each-subsidiary/ | /investors/subsidiary-financial-statements | investors/SubsidiaryFinancialStatementsPage |
| /disclosures/ | /investors/disclosures | investors/DisclosuresPage |
| # document category | /investors/ipo | investors/IpoPage |
| # document category | /investors/policies | investors/PoliciesPage |
| /careers/ | /careers | careers/CareersPage |
| /current-openings/ | /careers/current-openings | careers/CurrentOpeningsPage |
| /life-at-osel/ | /careers/life-at-osel | careers/LifeAtOselPage |
| /resources/ | /resources | resources/ResourcesPage |
| /news/ | /resources/news | resources/NewsPage |
| /blogs/ | /resources/blogs | resources/BlogsPage |
| /downloads/ | /downloads | downloads/DownloadsPage |
| /distributor-enquires/ | /distributor-enquiries | distributor/DistributorEnquiriesPage |
| /contact-us/ | /contact | contact/ContactPage |
| /book-a-demo/ | /contact/book-a-demo | contact/BookDemoPage |
| /hearing-aid-test-laboratory-2/ | /contact/hearing-aid-test-laboratory | contact/HearingAidTestLaboratoryPage |
| /privacy-policy/ | /privacy-policy | legal/PrivacyPolicyPage |
| /terms-and-conditions/ | /terms-and-conditions | legal/TermsAndConditionsPage |
| /disclaimer/ | /disclaimer | legal/DisclaimerPage |

Legacy /led-screens/ is normalized to /products/led-displays/. No duplicate legacy route implementations are introduced.

## LED dynamic route

One /products/led-displays/[slug] route renders LedProductDetailPage for the five family slugs and nine verified product slugs in src/data/products.ts. generateStaticParams pre-renders known entries; invalid slugs return 404.

## Documents and categories

The existing Corporate Governance, IPO and Policies menu categories have route foundations. Their PDF links (committee composition, independent director information, investor contact, IPO filings and policies) remain deferred to later document work; no documents were imported and individual PDFs are not represented as fabricated pages. The old Other grouping is redistributed across the investor groups without dropping any linked HTML page.

## Code splitting

App Router route splitting and Server Components are used by default. Products and investors share a minimal loading fallback. No ordinary page is wrapped in dynamic() or ssr:false. Future heavy client sections can be dynamically imported at their owning page boundary when implemented.

No discovered navigation HTML page remains without a route foundation. Source-linked external brand sites remain external. Article content, job details, forms and documents are outside this task.
