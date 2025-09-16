export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "default-no-store";
export const runtime = "nodejs";

import LoginClient from "./LoginClient";

export default function Page() {
  return <LoginClient />;
}
