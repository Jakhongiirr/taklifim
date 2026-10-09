"use client";

import { useState } from "react";
import { authApi } from "@/lib/api-client";
import { Button } from "./ui";

export default function LogoutButton() {
  const [pending, setPending] = useState(false);
  return (
    <Button
      variant="secondary"
      size="sm"
      loading={pending}
      onClick={async () => {
        setPending(true);
        await authApi("/logout").catch(() => undefined);
        // Full reload, so no cached data from this session survives.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign("/admin/login");
      }}
    >
      Log out
    </Button>
  );
}
