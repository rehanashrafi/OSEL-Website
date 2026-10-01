import type {
  NavigationGroup,
  NavigationItem,
  PrimaryNavigationItem,
} from "@/types/navigation";
import { productFamilies } from "@/data/products";

// Canonical V2 destinations. Source mapping is documented in ROUTES.md.
export const pages = {
  home: { label: "Home", href: "/" },
  about: { label: "About Us", href: "/about" },
  management: { label: "Management", href: "/about/management" },
  events: { label: "Events and Awards", href: "/about/events-and-awards" },
  manufacturing: { label: "Manufacturing", href: "/about/manufacturing" },
  clients: { label: "Clients", href: "/about/clients" },
  products: { label: "All Products", href: "/products" },
  led: { label: "LED Displays", href: "/products/led-displays" },
  hearing: { label: "Hearing Aids", href: "/products/hearing-aids" },
  mobile: { label: "Mobile Phones", href: "/products/mobile-phones" },
  investors: { label: "Investor Hub", href: "/investors" },
  investorInformation: {
    label: "Investor Information",
    href: "/investors/investor-information",
  },
  announcements: {
    label: "Corporate Announcements",
    href: "/investors/corporate-announcements",
  },
  regulation: {
    label: "Disclosure under Regulation 46",
    href: "/investors/regulation-46",
  },
  financial: {
    label: "Financial Information",
    href: "/investors/financial-information",
  },
  governance: {
    label: "Corporate Governance",
    href: "/investors/corporate-governance",
  },
  transcripts: {
    label: "Conference Call Transcripts",
    href: "/investors/conference-call-transcripts",
  },
  recordings: {
    label: "Audio/Video Recording of Transcript",
    href: "/investors/audio-video-recordings",
  },
  odr: { label: "Smart ODR", href: "/investors/smart-odr" },
  annualReports: { label: "Annual Reports", href: "/investors/annual-reports" },
  agm: {
    label: "AGM/EGM Video Recording and Transcript",
    href: "/investors/agm-egm-recordings",
  },
  ratings: { label: "External Ratings", href: "/investors/external-ratings" },
  annualReturn: { label: "Annual Return", href: "/investors/annual-return" },
  csr: {
    label: "Annual Action Plan for CSR",
    href: "/investors/annual-action-plan-for-csr",
  },
  shareholding: {
    label: "Shareholding Patterns",
    href: "/investors/shareholding-patterns",
  },
  candidature: {
    label: "Notice of Candidature u/s 160",
    href: "/investors/notice-of-candidature",
  },
  subsidiaries: {
    label: "Audited Financial Statements of Each Subsidiary",
    href: "/investors/subsidiary-financial-statements",
  },
  disclosures: { label: "Disclosures", href: "/investors/disclosures" },
  ipo: { label: "IPO", href: "/investors/ipo" },
  policies: { label: "Policies", href: "/investors/policies" },
  careers: { label: "Careers", href: "/careers" },
  openings: { label: "Current Openings", href: "/careers/current-openings" },
  life: { label: "Life at OSEL", href: "/careers/life-at-osel" },
  resources: { label: "Resources", href: "/resources" },
  news: { label: "News", href: "/resources/news" },
  blogs: { label: "Blogs", href: "/resources/blogs" },
  downloads: { label: "Downloads", href: "/downloads" },
  distributor: {
    label: "Distributor Enquiries",
    href: "/distributor-enquiries",
  },
  contact: { label: "Contact Us", href: "/contact" },
  demo: { label: "Book a Demo", href: "/contact/book-a-demo" },
  laboratory: {
    label: "Hearing Aid Test Laboratory",
    href: "/contact/hearing-aid-test-laboratory",
  },
  privacy: { label: "Privacy Policy", href: "/privacy-policy" },
  terms: { label: "Terms and Conditions", href: "/terms-and-conditions" },
  disclaimer: { label: "Disclaimer", href: "/disclaimer" },
} satisfies Record<string, NavigationItem>;

export const allProducts: NavigationItem = {
  ...pages.products,
  label: "Explore all products",
};
export const enquiry: NavigationItem = {
  ...pages.contact,
  label: "Enquire Now",
};
export const productNavigation: readonly NavigationGroup[] = [
  {
    label: "LED Displays",
    items: [
      pages.led,
      ...productFamilies.map((family) => ({
        label: family.name,
        href: `${pages.led.href}/${family.slug}`,
        children: family.products.map((product) => ({
          label: product.name,
          href: `${pages.led.href}/${product.slug}`,
        })),
      })),
    ],
  },
  { label: "Products", items: [pages.products, pages.hearing, pages.mobile] },
];
export const investorNavigation: readonly NavigationGroup[] = [
  {
    label: "Investor Hub",
    items: [
      pages.investors,
      pages.investorInformation,
      pages.announcements,
      pages.regulation,
      pages.disclosures,
      pages.ipo,
    ],
  },
  {
    label: "Financials & Reports",
    items: [
      pages.financial,
      pages.annualReports,
      pages.annualReturn,
      pages.shareholding,
      pages.ratings,
      pages.subsidiaries,
    ],
  },
  {
    label: "Governance & Communications",
    items: [
      pages.governance,
      pages.policies,
      pages.csr,
      pages.candidature,
      pages.odr,
      pages.transcripts,
      pages.recordings,
      pages.agm,
    ],
  },
];
export const companyNavigation: readonly NavigationItem[] = [
  pages.about,
  pages.management,
  pages.events,
  pages.manufacturing,
  pages.clients,
];
export const careerNavigation: readonly NavigationItem[] = [
  pages.careers,
  pages.openings,
  pages.life,
];
export const resourceNavigation: readonly NavigationItem[] = [
  pages.resources,
  pages.downloads,
  pages.news,
  pages.blogs,
];
export const partnerNavigation: readonly NavigationItem[] = [
  pages.distributor,
  pages.demo,
  pages.laboratory,
];
export const brandNavigation: readonly NavigationItem[] = [
  { label: "OSEL Tech", href: "https://www.oseltech.com/" },
  { label: "OSEL Hearing", href: "https://oselhearing.com/" },
];
export const primaryNavigation: readonly PrimaryNavigationItem[] = [
  { id: "home", ...pages.home },
  {
    id: "about",
    ...pages.about,
    groups: [
      { label: "Company", items: companyNavigation },
      { label: "Our Brands", items: brandNavigation },
    ],
  },
  {
    id: "products",
    ...pages.products,
    label: "Products",
    groups: productNavigation,
  },
  {
    id: "investors",
    ...pages.investors,
    label: "Investors",
    groups: investorNavigation,
  },
  {
    id: "careers",
    ...pages.careers,
    groups: [{ label: "Careers", items: careerNavigation }],
  },
  {
    id: "resources",
    ...pages.resources,
    groups: [{ label: "Resources", items: resourceNavigation }],
  },
  {
    id: "partners",
    ...pages.distributor,
    label: "Partner With Us",
    groups: [{ label: "Connect", items: partnerNavigation }],
  },
];
export const footerNavigation: readonly NavigationGroup[] = [
  {
    label: "Products",
    items: [pages.products, pages.led, pages.hearing, pages.mobile],
  },
  {
    label: "Company",
    items: [
      ...companyNavigation,
      ...careerNavigation,
      pages.distributor,
      pages.contact,
    ],
  },
  {
    label: "Investors",
    items: [
      pages.investors,
      pages.investorInformation,
      pages.announcements,
      pages.regulation,
      pages.financial,
      pages.governance,
      pages.ipo,
      pages.policies,
    ],
  },
  {
    label: "Resources",
    items: [...resourceNavigation, pages.demo, pages.laboratory],
  },
];
export const socialNavigation: readonly NavigationItem[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/oseldevices/" },
  { label: "YouTube", href: "https://www.youtube.com/@Osel_Devices" },
  { label: "Instagram", href: "https://www.instagram.com/osel_devices/" },
  { label: "Facebook", href: "https://www.facebook.com/OselDevice/" },
  { label: "X", href: "https://x.com/OselDevices" },
];
export const legalNavigation: readonly NavigationItem[] = [
  pages.privacy,
  pages.terms,
  pages.disclaimer,
];
