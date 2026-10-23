import HiddenInvitationRedirect from "@/components/site/hidden-invitation-redirect";
import NotFound from "../../not-found";

/** The site's 404, which sends the owner or an admin on to the preview. */
export default function InvitationNotFound() {
  return (
    <>
      <NotFound />
      <HiddenInvitationRedirect />
    </>
  );
}
