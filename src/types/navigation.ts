export interface NavigationItem {
  label: string;
  href?: string;
  children?: readonly NavigationItem[];
}
export interface NavigationGroup { label: string; items: readonly NavigationItem[]; }
export interface PrimaryNavigationItem extends NavigationItem {
  id: string;
  groups?: readonly NavigationGroup[];
}
export type FooterGroup = NavigationGroup;
