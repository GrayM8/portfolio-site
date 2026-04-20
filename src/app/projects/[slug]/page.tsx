import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProjectSlugs, getProjectBySlug } from "@/data/portfolio";
import { ProjectDetail } from "./ProjectDetail";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  const description = project.overview ?? project.tagline;
  return {
    title: `${project.title} — Gray Marshall`,
    description,
    keywords: project.tech,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title: `${project.title} · Gray Marshall`,
      description,
      url: `/projects/${slug}`,
      type: "article",
      images: project.image ? [{ url: project.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} · Gray Marshall`,
      description,
      images: project.image ? [project.image] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
