export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "default-no-store";
export const runtime = "nodejs";

import RegisterClient from "./RegisterClient";

export default function Page() {
  return <RegisterClient />;
}
