import { PORTFOLIO } from "@/data/portfolio";
import { SITE_URL } from "@/lib/site";

/**
 * Home-page JSON-LD — emits Person, WebSite, and ProfilePage as a linked
 * @graph so Google treats them as one entity. ProfilePage (added by Google
 * in 2024) explicitly marks this as a named-individual profile, which
 * helps with sitelinks + knowledge-panel-style rendering for searches on
 * "Gray Marshall."
 */
export function ProfileJsonLd() {
  const P = PORTFOLIO;
  const personId = `${SITE_URL}/#gray`;
  const websiteId = `${SITE_URL}/#website`;
  const profilePageId = `${SITE_URL}/#profilepage`;

  const worksFor = [
    { name: "PitLane Systems", url: "https://www.pitlanesystems.com" },
    { name: "Longhorn Sim Racing", url: "https://www.longhornsimracing.org" },
    { name: "Trophy Sim Solutions", url: "https://www.trophysim.com" },
    { name: "Longhorn Racing", url: "https://www.longhornracing.org" },
  ];

  const person = {
    "@type": "Person",
    "@id": personId,
    name: P.name,
    givenName: "Gray",
    familyName: "Marshall",
    alternateName: "Matthew Gray Marshall",
    url: SITE_URL,
    mainEntityOfPage: { "@id": profilePageId },
    image: `${SITE_URL}/assets/headshot.jpg`,
    jobTitle: P.role,
    description: P.tagline,
    email: `mailto:${P.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Austin",
      addressRegion: "TX",
      addressCountry: "US",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: P.education.school,
      sameAs: "https://www.utexas.edu",
    },
    worksFor: worksFor.map((o) => ({
      "@type": "Organization",
      name: o.name,
      url: o.url,
    })),
    knowsAbout: Array.from(new Set(Object.values(P.skills).flat())),
    sameAs: [
      `https://${P.github}`,
      `https://${P.linkedin}`,
    ],
  };

  const website = {
    "@type": "WebSite",
    "@id": websiteId,
    url: SITE_URL,
    name: "graymarshall.dev",
    alternateName: "Gray Marshall — Portfolio",
    description:
      "Portfolio of Gray Marshall — real-time systems, race-car telemetry, and production web platforms.",
    inLanguage: "en-US",
    publisher: { "@id": personId },
    author: { "@id": personId },
  };

  const profilePage = {
    "@type": "ProfilePage",
    "@id": profilePageId,
    url: SITE_URL,
    name: `${P.name} | ${P.role}`,
    description: P.tagline,
    inLanguage: "en-US",
    isPartOf: { "@id": websiteId },
    dateModified: new Date().toISOString(),
    mainEntity: { "@id": personId },
    about: { "@id": personId },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [person, website, profilePage],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
