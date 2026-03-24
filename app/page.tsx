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
      travelType: clean(cols[4]),
      departureCity: clean(cols[5]),
      arrivalCity: clean(cols[6]),
      departureTime: clean(cols[7]),
      arrivalTime: clean(cols[8]),
      transport: clean(cols[9]),
    };
  });
}

export default async function Page() {
  const data = await getData();

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Tournée</h1>

      {data.map((item, i) => (
        <div key={i} className="mb-6 p-6 border rounded-xl shadow">
          <h2 className="text-2xl font-bold">{item.city}</h2>
          <p className="text-sm text-gray-500 mb-2">{item.date}</p>

          <p className="font-semibold">{item.venue}</p>
          <p className="mb-4">{item.address}</p>

          <div className="text-sm text-gray-600">
            <p>🚐 Voyage: {item.travelType}</p>
            <p>
              {item.departureCity} → {item.arrivalCity}
            </p>
            <p>
              {item.departureTime} → {item.arrivalTime}
            </p>
            <p>Transport: {item.transport}</p>
          </div>
        </div>
      ))}
    </main>
  );
}