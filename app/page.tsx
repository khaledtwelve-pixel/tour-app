"use client";

import { useEffect, useMemo, useState } from "react";

type TourItem = {
  date: string;
  city: string;
  venue: string;
};

type TeamItem = {
  role: string;
  name: string;
  phone: string;
};

const SHEET_ID = "1japAvkYshUBq_D55JOwZCvYfqUGM_OJeJ0kx-GIW-Zk";
const DATA_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=DATA`;
const TEAM_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=TEAM`;

function clean(str: string) {
  return (str || "").replace(/"/g, "").trim();
}

function parseCSV(csv: string) {
  const lines = csv.split("\n").filter(Boolean);
  const headers = lines[0].split(",").map(clean);

  return lines.slice(1).map((line) => {
    const values = line.split(",").map(clean);
    const obj: any = {};
    headers.forEach((h, i) => (obj[h] = values[i]));
    return obj;
  });
}

function getMonth(date: string) {
  if (!date) return "";
  const parts = date.split("/");
  if (parts.length !== 3) return "";

  const month = parseInt(parts[1]);

  if (month === 4) return "AVRIL";
  if (month === 5) return "MAI";

  return "";
}

export default function Page() {
  const [tourData, setTourData] = useState<TourItem[]>([]);
  const [teamData, setTeamData] = useState<TeamItem[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [dataRes, teamRes] = await Promise.all([
        fetch(DATA_URL),
        fetch(TEAM_URL),
      ]);

      const data = parseCSV(await dataRes.text());
      const team = parseCSV(await teamRes.text());

      setTourData(data);
      setTeamData(team);
    }

    load();
  }, []);

  const topContacts = useMemo(() => {
    return teamData.filter((p) =>
      [
        "Régisseur artiste",
        "Régisseur général",
        "Administrateur de tournée",
      ].includes(p.role)
    );
  }, [teamData]);

  const cities = useMemo(() => {
    if (!selectedMonth) return [];
    return tourData.filter((item) => getMonth(item.date) === selectedMonth);
  }, [tourData, selectedMonth]);

  return (
    <main
      className="min-h-screen p-5"
      style={{
        background:
          "linear-gradient(180deg, #1499f5 0%, #45bcff 40%, #8ee2ff 72%, #c7f3ff 100%)",
      }}
    >
      <div className="mx-auto max-w-3xl">

        {/* HEADER */}
        <div className="mb-8 pt-4 text-white">
          <p className="mb-2 font-black uppercase" style={{ color: "#ff5ca8" }}>
            PAUL MIRABEL
          </p>

          <h1 className="m-0 font-black italic" style={{ fontSize: "80px" }}>
            par amour
          </h1>
        </div>

        {/* ACCUEIL */}
        {!selectedMonth && (
          <div className="space-y-4">

            {/* MOIS */}
            {["AVRIL", "MAI"].map((month) => (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                className="block w-full rounded-[24px] bg-white px-6 py-6 text-left"
                style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
              >
                <span className="text-3xl font-black uppercase text-slate-900">
                  {month}
                </span>
              </button>
            ))}

            {/* TEAM */}
            <div className="mt-6 space-y-3">
              {topContacts.map((person, i) => (
                <div
                  key={i}
                  className="rounded-[24px] bg-white px-5 py-4"
                  style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
                >
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-pink-500">
                    {person.role}
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {person.name}
                  </p>

                  <a
                    href={`tel:${person.phone}`}
                    className="mt-2 block text-sm text-blue-600 underline"
                  >
                    {person.phone}
                  </a>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* VILLES */}
        {selectedMonth && (
          <div className="space-y-4">

            <button
              onClick={() => setSelectedMonth(null)}
              className="rounded-full bg-white px-4 py-2 font-bold"
              style={{ color: "#ec4899" }}
            >
              ← Retour
            </button>

            {cities.map((item, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-[24px] bg-white"
                style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
              >
                <div
                  className="px-5 py-4"
                  style={{
                    background:
                      "linear-gradient(90deg, #ec4899 0%, #f472b6 35%, #60a5fa 100%)",
                  }}
                >
                  <p className="text-white text-sm font-bold">{item.date}</p>
                  <h2 className="text-white text-3xl font-black">
                    {item.city}
                  </h2>
                </div>

                <div className="px-5 py-5">
                  <p className="text-xl font-bold text-slate-900">
                    {item.venue}
                  </p>
                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}