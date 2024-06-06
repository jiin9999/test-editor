import Link from "next/link";

async function getData() {
  try {
    const response = await fetch("https://w-test.store/api/contents/", {
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

export default async function MainPage() {
  const data = await getData();

  return (
    <main>
      <ul>
        {data.map((content: any) => (
          <li key={content.id}>
            <Link href={`/${content.id}`}>{content.title}</Link>
          </li>
        ))}
      </ul>
      <Link href={`/write`}>글 작성</Link>
    </main>
  );
}
