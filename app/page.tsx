
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
    <main
      className="min-h-screen p-6"
      style={{
        background:
          "linear-gradient(180deg, #55c7ff 0%, #8ee3ff 45%, #b7f0ff 100%)",
      }}
    >
      <div className="mx-auto max-w-2xl">
        <div
          className="mb-8 rounded-[28px] px-8 py-10 text-white shadow-2xl"
          style={{
            background:
              "linear-gradient(180deg, #1d4ed8 0%, #2563eb 35%, #38bdf8 100%)",
          }}
        >
          <p
            className="mb-2 text-sm tracking-wide"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            PAUL MIRABEL
          </p>

          <h1
            className="m-0 leading-none font-black italic"
            style={{
              fontSize: "clamp(48px, 9vw, 90px)",
              color: "#ffffff",
              textShadow: "0 4px 18px rgba(0,0,0,0.15)",
            }}
          >
            par amour
          </h1>

          <div className="mt-6 inline-block rounded-full bg-white/90 px-5 py-2">
            <p
              className="m-0 text-sm font-extrabold tracking-wide"
              style={{ color: "#ec4899" }}
            >
              TOURNÉE / PLANNING
            </p>
          </div>
        </div>

        {data.map((item, i) => (
          <div
            key={i}
            className="mb-6 overflow-hidden rounded-[26px] bg-white shadow-xl"
            style={{
              border: "3px solid rgba(255,255,255,0.55)",
              boxShadow: "0 18px 40px rgba(14, 116, 144, 0.16)",
            }}
          >
            <div
              className="px-6 py-5 text-white"
              style={{
                background:
                  "linear-gradient(90deg, #ec4899 0%, #f472b6 35%, #60a5fa 100%)",
              }}
            >
              <p
                className="m-0 text-xs font-bold tracking-[0.2em]"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                {item.date}
              </p>
              <h2 className="mt-2 text-3xl font-black uppercase">{item.city}</h2>
            </div>

            <div className="px-6 py-6">
              <div
                className="mb-5 rounded-2xl px-5 py-4"
                style={{ background: "#fdf2f8" }}
              >
                <p className="m-0 text-xs font-extrabold uppercase tracking-[0.2em] text-pink-500">
                  Salle
                </p>
                <p className="mt-2 text-xl font-bold text-slate-900">{item.venue}</p>
                <p className="mt-1 text-sm text-slate-600">{item.address}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div
                  className="rounded-2xl px-5 py-4"
                  style={{ background: "#eff6ff" }}
                >
                  <p className="m-0 text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600">
                    Voyage
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {item.departureCity} → {item.arrivalCity}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {item.departureTime} → {item.arrivalTime}
                  </p>
                </div>

                <div
                  className="rounded-2xl px-5 py-4"
                  style={{ background: "#f0fdf4" }}
                >
                  <p className="m-0 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-600">
                    Transport
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {item.transport || item.travelType}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{item.travelType}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}