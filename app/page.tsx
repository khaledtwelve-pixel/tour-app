
"use client";

import { useEffect, useState } from "react";

type TourItem = {
  date: string;
  city: string;
  venue: string;
  address: string;
  travelType: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  transport: string;
};

async function fetchData(): Promise<TourItem[]> {
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

export default function Page() {
  const [data, setData] = useState<TourItem[]>([]);
  const [selected, setSelected] = useState<TourItem | null>(null);

  useEffect(() => {
    fetchData().then(setData);
  }, []);

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #1296f3 0%, #41b8ff 38%, #86d8ff 68%, #b8ecff 100%)",
      }}
    >
      <div className="mx-auto max-w-3xl px-5 py-8">
        <section className="mb-8 pt-4 text-white">
          <p
            className="mb-2 font-black uppercase"
            style={{
              color: "#ff5ca8",
              fontSize: "clamp(22px, 4vw, 38px)",
              letterSpacing: "0.04em",
            }}
          >
            PAUL MIRABEL
          </p>

          <h1
            className="m-0 font-black italic leading-none"
            style={{
              fontSize: "clamp(58px, 11vw, 118px)",
              color: "#ffffff",
              textShadow: "0 6px 24px rgba(0,0,0,0.18)",
            }}
          >
            par amour
          </h1>

          <div className="mt-8 text-center">
            <p
              className="mb-3 font-extrabold uppercase text-white"
              style={{
                fontSize: "clamp(22px, 4vw, 40px)",
                letterSpacing: "0.03em",
              }}
            >
              LE PLANNING DE TOURNÉE
            </p>

            <div
              className="inline-block rounded-md px-5 py-3"
              style={{
                background: "#ff5ca8",
                boxShadow: "0 8px 24px rgba(236,72,153,0.35)",
              }}
            >
              <span
                className="font-black uppercase text-white"
                style={{
                  fontSize: "clamp(20px, 3.8vw, 34px)",
                  letterSpacing: "0.04em",
                }}
              >
                MARS 2026
              </span>
            </div>
          </div>
        </section>

        {!selected ? (
          <section className="space-y-5">
            {data.map((item, i) => (
              <button
                key={i}
                onClick={() => setSelected(item)}
                className="block w-full overflow-hidden rounded-[28px] bg-white text-left"
                style={{
                  boxShadow: "0 18px 50px rgba(0, 83, 135, 0.18)",
                }}
              >
                <div
                  className="px-6 py-5"
                  style={{
                    background:
                      "linear-gradient(90deg, #1d4ed8 0%, #2563eb 45%, #38bdf8 100%)",
                  }}
                >
                  <p
                    className="m-0 text-sm font-extrabold uppercase"
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      letterSpacing: "0.18em",
                    }}
                  >
                    {item.date}
                  </p>

                  <h2 className="mt-2 text-4xl font-black uppercase text-white">
                    {item.city}
                  </h2>
                </div>

                <div className="p-6">
                  <p className="text-2xl font-bold text-slate-900">{item.venue}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.address}</p>
                </div>
              </button>
            ))}
          </section>
        ) : (
          <section
            className="overflow-hidden rounded-[28px] bg-white"
            style={{
              boxShadow: "0 18px 50px rgba(0, 83, 135, 0.18)",
            }}
          >
            <div
              className="px-6 py-5"
              style={{
                background:
                  "linear-gradient(90deg, #ec4899 0%, #f472b6 35%, #60a5fa 100%)",
              }}
            >
              <button
                onClick={() => setSelected(null)}
                className="mb-4 rounded-full bg-white px-4 py-2 text-sm font-bold text-pink-500"
              >
                ← Retour
              </button>

              <p
                className="m-0 text-sm font-extrabold uppercase"
                style={{
                  color: "rgba(255,255,255,0.9)",
                  letterSpacing: "0.18em",
                }}
              >
                {selected.date}
              </p>

              <h2 className="mt-2 text-4xl font-black uppercase text-white">
                {selected.city}
              </h2>
            </div>

            <div className="space-y-4 p-6">
              <div className="rounded-3xl p-5" style={{ background: "#fff1f7" }}>
                <p className="m-0 text-xs font-extrabold uppercase tracking-[0.24em] text-pink-500">
                  Salle
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {selected.venue}
                </p>
                <p className="mt-1 text-sm text-slate-600">{selected.address}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl p-5" style={{ background: "#eef7ff" }}>
                  <p className="m-0 text-xs font-extrabold uppercase tracking-[0.24em] text-blue-600">
                    Voyage
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {selected.departureCity} → {selected.arrivalCity}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {selected.departureTime} → {selected.arrivalTime}
                  </p>
                </div>

                <div className="rounded-3xl p-5" style={{ background: "#f5faff" }}>
                  <p className="m-0 text-xs font-extrabold uppercase tracking-[0.24em] text-sky-600">
                    Transport
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {selected.transport || "—"}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {selected.travelType || "—"}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}