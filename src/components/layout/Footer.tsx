import { ArrowUpRight } from "lucide-react";
import {
  footerNavigation,
  legalNavigation,
  socialNavigation,
  // enquiry,
} from "@/data/navigation";
import { Brand } from "@/components/ui/Brand";
// import { EnquiryButton } from "@/components/ui/EnquiryButton";
import { NavigationLink } from "@/components/ui/NavigationLink";
import { FooterMotion } from "./FooterMotion";

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-line bg-secondary">
      <FooterMotion>
        <div className="site-container">
          {/* <div className="grid gap-10 border-b border-line py-16 md:py-24 lg:grid-cols-[1fr_auto] lg:items-end">
            <div data-footer-reveal>
              <p className="text-label mb-8 flex items-center gap-3 text-subdued">
                <span aria-hidden="true" className="h-1.5 w-1.5 bg-brand" />
                The next connection
              </p>
              <h2 className="display-lg">
                Let’s build what’s
                <br />
                <span className="text-subdued">seen next.</span>
              </h2>
            </div>
            <div data-footer-reveal className="pb-1">
              <EnquiryButton />
              {!enquiry.href && (
                <p className="body-sm mt-4 text-muted">
                  Contact details coming soon.
                </p>
              )}
            </div>
          </div> */}

          <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.4fr_1fr_1fr_1.3fr_1fr]">
            <div data-footer-reveal>
              <Brand />
              <p className="body-sm mt-5 max-w-60 text-subdued">
                Display technology.
                <br />
                Precision manufacturing.
              </p>
              <div className="mt-5 flex flex-wrap gap-x-4">
                {socialNavigation.map((item) => (
                  <NavigationLink
                    key={item.label}
                    item={item}
                    className="body-sm"
                  />
                ))}
              </div>
            </div>
            {footerNavigation.map((group) => (
              <div key={group.label} data-footer-reveal>
                <h3 className="text-label mb-5 text-muted">{group.label}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <NavigationLink item={item} className="body-sm" />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div
            data-footer-reveal
            className="flex flex-wrap items-center justify-between gap-5 border-t border-line py-6 text-xs text-muted"
          >
            <p>© ÖSEL Devices Limited</p>
            <div className="flex flex-wrap items-center gap-6">
              {legalNavigation.map((item) => (
                <NavigationLink key={item.label} item={item} />
              ))}
              <a
                href="#top"
                className="animated-link flex min-h-11 items-center gap-3 text-subdued"
              >
                Back to top
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div
            aria-hidden="true"
            data-footer-reveal
            className="brand-outline pb-5 pt-8 text-center"
          >
            ÖSEL
          </div>
        </div>
      </FooterMotion>
    </footer>
  );
}
