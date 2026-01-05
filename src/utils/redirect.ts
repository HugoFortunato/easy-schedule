// Wrapper para redirect que funciona em runtime mas não tem tipos no Next.js 15
// @ts-expect-error - redirect exists in next/navigation at runtime
import { redirect as nextRedirect } from 'next/navigation';

export function redirect(path: string): never {
  return nextRedirect(path);
}

