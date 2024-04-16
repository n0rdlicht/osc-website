import { getPosts } from "@/components/utils";
import { notFound } from "next/navigation";
import Page from "@/components/page";

export async function generateStaticParams() {
  let posts = getPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function SinglePage({ params }: { params: { slug: string } }) {
  let page = getPosts().find((page) => page.slug === params.slug);

  if (!page) {
    notFound();
  }

  return <Page page={page} />;
}
