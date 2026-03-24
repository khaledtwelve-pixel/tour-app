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