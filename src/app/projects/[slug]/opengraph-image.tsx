import { getProjectBySlug } from "@/data/portfolio";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Project — Gray Marshall";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Params = Promise<{ slug: string }>;

function splitTitle(title: string): string[] {
  // Break long titles into up to 3 visually balanced lines at word boundaries.
  const words = title.split(/\s+/);
  if (words.length <= 2) return [title];
  if (words.length === 3) return [words[0], `${words[1]} ${words[2]}`];
  if (words.length === 4) return [`${words[0]} ${words[1]}`, `${words[2]} ${words[3]}`];
  // 5+ words → 3 lines
  const third = Math.ceil(words.length / 3);
  return [
    words.slice(0, third).join(" "),
    words.slice(third, third * 2).join(" "),
    words.slice(third * 2).join(" "),
  ];
}

export default async function Image({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return renderOgImage({
      kicker: "Case · not found",
      title: ["Project", "not found"],
      italicSecondLine: true,
      footerLeft: `graymarshall.dev/projects/${slug}`,
    });
  }

  return renderOgImage({
    kicker: `Case · ${project.slug}`,
    title: splitTitle(project.title),
    italicSecondLine: splitTitle(project.title).length >= 2,
    description: project.tagline,
    footerLeft: `graymarshall.dev/projects/${project.slug}`,
    footerRight: `${project.status.toUpperCase()} · ${project.year.toUpperCase()}`,
  });
}
