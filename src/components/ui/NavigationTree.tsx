import type { NavigationItem } from "@/types/navigation";
import { NavigationLink } from "./NavigationLink";

export function NavigationTree({ items, onNavigate }: { items: readonly NavigationItem[]; onNavigate?: () => void }) {
  return <ul>{items.map(item => <li key={item.href ?? item.label}>
    {item.children?.length ? <details><summary className="body-md min-h-11 cursor-pointer py-3 text-subdued marker:text-muted">{item.label}</summary><div className="mb-3 border-l border-line pl-4"><NavigationLink item={item} onNavigate={onNavigate} className="body-sm" /><NavigationTree items={item.children} onNavigate={onNavigate} /></div></details> : <NavigationLink item={item} onNavigate={onNavigate} className="body-sm w-full py-2" />}
  </li>)}</ul>;
}
