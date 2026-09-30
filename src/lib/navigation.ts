import type { NavigationItem, PrimaryNavigationItem } from "@/types/navigation";

export function isActiveRoute(pathname: string, href?: string, exact = false): boolean {
  if (!href?.startsWith("/") || href.startsWith("//")) return false;
  const path = pathname.replace(/\/$/, "") || "/";
  const target = href.replace(/\/$/, "") || "/";
  return path === target || (!exact && target !== "/" && path.startsWith(`${target}/`));
}
function isItemActive(pathname: string, item: NavigationItem): boolean {
  return isActiveRoute(pathname, item.href) || Boolean(item.children?.some(child => isItemActive(pathname, child)));
}
export function isNavigationActive(pathname: string, item: PrimaryNavigationItem): boolean {
  return isItemActive(pathname, item) || Boolean(item.groups?.some(group => group.items.some(child => isItemActive(pathname, child))));
}
