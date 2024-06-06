async function getData(contentId: string) {
  try {
    const response = await fetch(`https://w-test.store/api/contents/${contentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error(error);
  }
  return [];
}

export default async function Page({ params }: { params: { contentId: string } }) {
  const data = await getData(params.contentId);
  return (
    <div className="page-container">
      <div style={{ textAlign: "center", padding: "40px 0" }}>{data.title}</div>
      <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
    </div>
  );
}
