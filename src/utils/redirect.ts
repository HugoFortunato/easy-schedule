// Wrapper para redirect que funciona em runtime mas não tem tipos no Next.js 15
import { redirect as nextRedirect } from "next/navigation";

export function redirect(path: string): never {
  return nextRedirect(path);
}
