import { EditorialSite } from "@/components/editorial/EditorialSite";
import { ProfileJsonLd } from "@/components/seo/ProfileJsonLd";

export default function Home() {
  return (
    <>
      <ProfileJsonLd />
      <EditorialSite />
    </>
  );
}
