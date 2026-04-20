import type { AnyProject } from "@/data/portfolio";
import { SITE_URL } from "@/lib/site";

/**
 * Choose the schema.org type for a project's `mainEntity`. Defaults to
 * CreativeWork. Projects that are shipped products with a live URL upgrade
 * to SoftwareApplication (desktop/electron/native apps) or WebSite (hosted
 * marketing / product sites). Keep this aligned with the intent of the
 * project's case study — the portfolio page is an ItemPage *about* the
 * work, so the live site can keep its own schema without conflict.
 */
function resolveSchemaType(
  project: AnyProject,
): "SoftwareApplication" | "WebSite" | "CreativeWork" {
  const slug = "slug" in project ? project.slug : "";
  const softwareSlugs = new Set([
    "dash",
    "lhr-autonomy",
    "fsae",
    "pitlane",
    "agentworkspaces",
  ]);
  const websiteSlugs = new Set([
    "trophysim",
    "pitlane-site",
    "invest-check",
    "personal-website-v3",
    "lsr",
  ]);
  if (softwareSlugs.has(slug)) return "SoftwareApplication";
  if (websiteSlugs.has(slug)) return "WebSite";
  return "CreativeWork";
}

type Props = {
  project: AnyProject;
};

export function ProjectJsonLd({ project }: Props) {
  const slug = "slug" in project ? project.slug : "";
  const pageUrl = `${SITE_URL}/projects/${slug}`;
  const description = project.overview ?? project.tagline;
  const schemaType = resolveSchemaType(project);
  const imageUrl = project.image
    ? project.image.startsWith("http")
      ? project.image
      : `${SITE_URL}${project.image}`
    : undefined;

  const mainEntity: Record<string, unknown> = {
    "@type": schemaType,
    name: project.title,
    description,
    ...(project.link ? { url: project.link } : {}),
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(project.tech?.length ? { keywords: project.tech.join(", ") } : {}),
  };

  if (schemaType === "SoftwareApplication") {
    mainEntity.applicationCategory = "DeveloperApplication";
    mainEntity.operatingSystem = "Any";
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Portfolio",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: `${SITE_URL}/#index`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: pageUrl,
      },
    ],
  };

  const itemPage = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    url: pageUrl,
    name: `${project.title} — Gray Marshall`,
    description,
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#gray`,
      name: "Gray Marshall",
      url: SITE_URL,
    },
    mainEntity,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemPage) }}
      />
    </>
  );
}
