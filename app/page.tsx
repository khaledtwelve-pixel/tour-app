
async function getData() {
  const res = await fetch(
    "https://docs.google.com/spreadsheets/d/1Gw5lRqEonLr_8OAYSC3QLtNSMhyDF2X3mW0g_ZDXl64/export?format=csv&gid=0",
    { cache: "no-store" }
  );

  const text = await res.text();
  const rows = text.split("\n").slice(1).filter(Boolean);

  const clean = (str: string) => (str || "").replace(/"/g, "").trim();

  return rows.map((row) => {
    const cols = row.split(",");

    return {
      date: clean(cols[0]),
      city: clean(cols[1]),
      venue: clean(cols[2]),
      address: clean(cols[3]),
    };
  });
}

export default async function Page() {
  const data = await getData();

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Tournée</h1>

      {data.map((item, i) => (
        <div key={i} className="mb-4 p-4 border rounded">
          <p>{item.date}</p>
          <h2 className="text-xl">{item.city}</h2>
          <p>{item.venue}</p>
          <p>{item.address}</p>
        </div>
      ))}
    </main>
  );
}