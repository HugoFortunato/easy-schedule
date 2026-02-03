declare module "next/navigation" {
  export function redirect(path: string): never;
  export function permanentRedirect(path: string): never;
  export function useRouter(): {
    push: (href: string) => void;
    replace: (href: string) => void;
    prefetch: (href: string) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
  };
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
}
