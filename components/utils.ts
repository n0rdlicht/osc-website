import fs from "fs";
import path from "path";

export type Metadata = {
  title: string;
  publishedAt: string;
};

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  let match = frontmatterRegex.exec(fileContent);
  let frontMatterBlock = match![1];
  let content = fileContent.replace(frontmatterRegex, "").trim();
  let frontMatterLines = frontMatterBlock.trim().split("\n");
  let metadata: Partial<Metadata> = {};

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(": ");
    let value = valueArr.join(": ").trim();
    value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes
    metadata[key.trim() as keyof Metadata] = value;
  });

  return { metadata: metadata as Metadata, content };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  let rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

export function parseSlug(fileBasename: string) {
  let prefix = fileBasename.indexOf("-");
  if (prefix && +fileBasename.slice(0, prefix)) {
    return fileBasename.slice(prefix + 1);
  }
  return fileBasename;
}

function getMDXData(dir: string) {
  let mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file));
    let slug = parseSlug(path.basename(file, path.extname(file)));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getPosts(dir?: string) {
  return getMDXData(path.join(process.cwd(), "content", dir || ""));
}
