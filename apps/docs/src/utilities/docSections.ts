export interface DocSection {
  id: string;
  text: string;
  depth: number;
}

const toPlainText = (value: string) => value
  .replace(/<[^>]+>/g, ' ')
  .replace(/[`*_~]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

export const getDocSections = (body: string): DocSection[] => (
  [...body.matchAll(/<Section\s+[^>]*id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/Section>/g)]
    .map((section) => {
      const [, id, sectionBody] = section;
      const markdownHeading = sectionBody.match(/^(#{2,6})\s+(.+)$/m);
      const htmlHeading = sectionBody.match(/<h([2-6])[^>]*>([\s\S]*?)<\/h\1>/i);

      if (markdownHeading) {
        return {
          id,
          text: toPlainText(markdownHeading[2]),
          depth: markdownHeading[1].length,
        };
      }

      if (htmlHeading) {
        return {
          id,
          text: toPlainText(htmlHeading[2]),
          depth: Number(htmlHeading[1]),
        };
      }

      return {
        id,
        text: 'Untitled Section',
        depth: 2,
      };
    })
);
