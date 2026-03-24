
"use client";

import { useEffect, useMemo, useState } from "react";

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
  hotelSalle: string;
  balance: string;
  doors: string;
  showOrder: string;
  restauration: string;
  productionLocal: string;
};

const SHEET_ID = "1japAvkYshUBq_D55JOwZCvYfqUGM_OJeJ0kx-GIW-Zk";
const DATA_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=DATA`;

function parseCSVLine(line: string) {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function clean(str: string) {
  return (str || "").replace(/"/g, "").trim();
}

function csvToObjects(csv: string) {
  const lines = csv
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map(clean);

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line).map(clean);
    const row: Record<string, string> = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    return row;
  });
}

function parseFrenchDate(dateStr: string) {
  const value = clean(dateStr);
  if (!value) return null;

  const [day, month, year] = value.split("/").map(Number);
  if (!day || !month || !year) return null;

  return new Date(year, month - 1, day);
}

function monthLabelFromDate(dateStr: string) {
  const date = parseFrenchDate(dateStr);
  if (!date) return "";

  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  return months[date.getMonth()];
}

function monthNumberFromDate(dateStr: string) {
  const date = parseFrenchDate(dateStr);
  if (!date) return null;
  return date.getMonth() + 1;
}

function isFutureOrToday(dateStr: string) {
  const date = parseFrenchDate(dateStr);
  if (!date) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date >= today;
}

function sortByDate(items: TourItem[]) {
  return [...items].sort((a, b) => {
    const da = parseFrenchDate(a.date)?.getTime() ?? 0;
    const db = parseFrenchDate(b.date)?.getTime() ?? 0;
    return da - db;
  });
}

function InfoCard({
  title,
  value,
}: {
  title: string;
  value?: string;
}) {
  if (!value) return null;

  return (
    <div
      className="overflow-hidden rounded-[24px] bg-white"
      style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
    >
      <div
        className="px-5 py-4"
        style={{
          background:
            "linear-gradient(90deg, #1637c9 0%, #1d4ed8 40%, #38bdf8 100%)",
        }}
      >
        <p className="m-0 text-2xl font-black uppercase text-white">{title}</p>
      </div>

      <div className="px-5 py-5">
        <p className="m-0 text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

export default function Page() {
  const [tourData, setTourData] = useState<TourItem[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<TourItem | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(DATA_URL, { cache: "no-store" });
        const csv = await res.text();
        const raw = csvToObjects(csv);

        const mapped: TourItem[] = raw.map((row) => ({
          date: row.date || "",
          city: row.city || "",
          venue: row.venue || "",
          address: row.address || "",
          travelType: row.travelType || "",
          departureCity: row.departureCity || "",
          arrivalCity: row.arrivalCity || "",
          departureTime: row.departureTime || "",
          arrivalTime: row.arrivalTime || "",
          transport: row.transport || "",
          hotelSalle: row.hotelSalle || "",
          balance: row.Balance || row.balance || "",
          doors: row.Doors || row.doors || "",
          showOrder: row.ShowOrder || row.showOrder || "",
          restauration: row.Restauration || row.restauration || "",
          productionLocal: row.ProductionLocal || row.productionLocal || "",
        }));

        const filtered = sortByDate(
          mapped.filter((item) => {
            const month = monthNumberFromDate(item.date);
            return isFutureOrToday(item.date) && (month === 4 || month === 5);
          })
        );

        setTourData(filtered);
      } catch (error) {
        console.error("Erreur Google Sheets :", error);
      }
    }

    loadData();
  }, []);

  const months = useMemo(() => {
    return Array.from(
      new Set(
        tourData.map((item) => monthLabelFromDate(item.date)).filter(Boolean)
      )
    );
  }, [tourData]);

  const cities = useMemo(() => {
    if (!selectedMonth) return [];
    return tourData.filter(
      (item) => monthLabelFromDate(item.date) === selectedMonth
    );
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
        <div className="mb-8 pt-4 text-white">
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
        </div>

        {!selectedMonth && !selectedCity && (
          <div className="space-y-4">
            <h2 className="mb-2 text-2xl font-black text-white">Choisis un mois</h2>

            {months.map((month) => (
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
          </div>
        )}

        {selectedMonth && !selectedCity && (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedMonth(null)}
              className="rounded-full bg-white px-4 py-2 font-bold"
              style={{ color: "#ec4899" }}
            >
              ← Retour aux mois
            </button>

            <h2 className="text-2xl font-black text-white">{selectedMonth}</h2>

            {cities.map((item, i) => (
              <button
                key={`${item.city}-${item.date}-${i}`}
                onClick={() => setSelectedCity(item)}
                className="block w-full overflow-hidden rounded-[24px] bg-white text-left"
                style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
              >
                <div
                  className="px-5 py-4"
                  style={{
                    background:
                      "linear-gradient(90deg, #ec4899 0%, #f472b6 35%, #60a5fa 100%)",
                  }}
                >
                  <p className="m-0 text-sm font-extrabold uppercase text-white">
                    {item.date}
                  </p>
                  <h2 className="mt-2 text-3xl font-black uppercase text-white">
                    {item.city}
                  </h2>
                </div>

                <div className="px-5 py-5">
                  <p className="m-0 text-xl font-bold text-slate-900">
                    {item.venue}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{item.address}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {selectedCity && (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedCity(null)}
              className="rounded-full bg-white px-4 py-2 font-bold"
              style={{ color: "#ec4899" }}
            >
              ← Retour aux villes
            </button>

            <div
              className="overflow-hidden rounded-[24px] bg-white"
              style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
            >
              <div
                className="px-5 py-5"
                style={{
                  background:
                    "linear-gradient(90deg, #ec4899 0%, #f472b6 35%, #60a5fa 100%)",
                }}
              >
                <p className="m-0 text-sm font-extrabold uppercase text-white">
                  {selectedCity.date}
                </p>
                <h2 className="mt-2 text-4xl font-black uppercase text-white">
                  {selectedCity.city}
                </h2>
                <p className="mt-2 text-lg font-bold text-white">
                  {selectedCity.venue}
                </p>
              </div>
            </div>

            <InfoCard title="Salle" value={selectedCity.address} />
            <InfoCard
              title="Voyage"
              value={
                selectedCity.departureCity || selectedCity.arrivalCity
                  ? `${selectedCity.departureCity} → ${selectedCity.arrivalCity}`
                  : ""
              }
            />
            <InfoCard
              title="Horaires voyage"
              value={
                selectedCity.departureTime || selectedCity.arrivalTime
                  ? `${selectedCity.departureTime} → ${selectedCity.arrivalTime}`
                  : ""
              }
            />
            <InfoCard title="Transport" value={selectedCity.transport} />
            <InfoCard title="Hôtel / Salle" value={selectedCity.hotelSalle} />
            <InfoCard title="Balances" value={selectedCity.balance} />
            <InfoCard title="Ouverture des portes" value={selectedCity.doors} />
            <InfoCard title="Première partie / Show" value={selectedCity.showOrder} />
            <InfoCard title="Restauration" value={selectedCity.restauration} />
            <InfoCard title="Production locale" value={selectedCity.productionLocal} />
          </div>
        )}
      </div>
    </main>
  );
}