import { enquiry } from "@/data/navigation";
import { Button } from "./Button";
export function EnquiryButton({ onNavigate }: { onNavigate?: () => void }) {
  return enquiry.href ? (
    <Button href={enquiry.href} onClick={onNavigate}>
      {enquiry.label}
    </Button>
  ) : (
    <Button disabled title="Contact details coming soon">
      {enquiry.label}
      <span className="sr-only"> (contact details coming soon)</span>
    </Button>
  );
}
