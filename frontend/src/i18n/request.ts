import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const c = await cookies();
  const locale = c.get("NEXT_LOCALE")?.value || "ro";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
