export default function ContentList(content: any) {
  return <div dangerouslySetInnerHTML={{ __html: content }}></div>;
}
