

"use client";

import { useEffect, useMemo, useState } from "react";

type TourItem = {
  date: string;
  city: string;
  venue: string;
  capacite: string;
  travelType: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  hotel: string;
  hotelSalle: string;
  transport: string;
  balance: string;
  doors: string;
  showOrder: string;
  restauration: string;
  productionLocal: string;
};

type TeamItem = {
  role: string;
  name: string;
  phone: string;
  email: string;
};

const SHEET_ID = "1japAvkYshUBq_D55JOwZCvYfqUGM_OJeJ0kx-GIW-Zk";
const DATA_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=DATA`;
const TEAM_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=TEAM`;

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

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [day, month, year] = value.split("/").map(Number);
    return new Date(year, month - 1, day);
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  return null;
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

function DetailCard({
  title,
  value,
  extra,
}: {
  title: string;
  value?: string;
  extra?: string;
}) {
  if (!value && !extra) return null;

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
        {value ? <p className="m-0 text-2xl font-bold text-slate-900">{value}</p> : null}
        {extra ? <p className="mt-2 text-sm text-slate-600">{extra}</p> : null}
      </div>
    </div>
  );
}

export default function Page() {
  const [tourData, setTourData] = useState<TourItem[]>([]);
  const [teamData, setTeamData] = useState<TeamItem[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<TourItem | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [dataRes, teamRes] = await Promise.all([
          fetch(DATA_URL, { cache: "no-store" }),
          fetch(TEAM_URL, { cache: "no-store" }),
        ]);

        const dataCsv = await dataRes.text();
        const teamCsv = await teamRes.text();

        const rawData = csvToObjects(dataCsv);
        const rawTeam = csvToObjects(teamCsv);

        const mappedData: TourItem[] = rawData.map((row) => ({
          date: row.date || "",
          city: row.city || "",
          venue: row.venue || "",
          capacite: row.Capacite || row.capacite || "",
          travelType: row.travelType || "",
          departureCity: row.departureCity || "",
          arrivalCity: row.arrivalCity || "",
          departureTime: row.departureTime || "",
          arrivalTime: row.arrivalTime || "",
          hotel: row.hotel || "",
          hotelSalle: row.hotelSalle || "",
          transport: row.transport || "",
          balance: row.Balance || row.balance || "",
          doors: row.Doors || row.doors || "",
          showOrder: row.ShowOrder || row.showOrder || "",
          restauration: row.Restauration || row.restauration || "",
          productionLocal: row.ProductionLocal || row.productionLocal || "",
        }));

        const mappedTeam: TeamItem[] = rawTeam.map((row) => ({
          role: row.role || "",
          name: row.name || "",
          phone: row.phone || "",
          email: row.email || "",
        }));

        const filtered = sortByDate(
          mappedData.filter((item) => {
            const month = monthNumberFromDate(item.date);
            return isFutureOrToday(item.date) && (month === 4 || month === 5);
          })
        );

        setTourData(filtered);
        setTeamData(mappedTeam);
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

  const topContacts = useMemo(() => {
    const wanted = [
      "Régisseur artiste",
      "Regisseur artiste",
      "Régisseur général",
      "Regisseur général",
      "Administrateur de tournée",
      "Administration tournée",
      "Admin tournée",
    ];

    return teamData.filter((person) => wanted.includes(person.role));
  }, [teamData]);

  const mapsQuery = selectedCity
    ? `${selectedCity.venue} ${selectedCity.city}`
    : "";

  const mapsLink = mapsQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        mapsQuery
      )}`
    : "";

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

            {topContacts.length > 0 && (
              <div className="mb-6 space-y-3">
                {topContacts.map((person, i) => (
                  <div
                    key={i}
                    className="rounded-[24px] bg-white px-5 py-4"
                    style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
                  >
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-pink-500">
                      {person.role}
                    </p>
                    <p className="mt-1 text-xl font-bold text-slate-900">{person.name}</p>
                    {person.phone ? (
                      <a
                        href={`tel:${person.phone}`}
                        className="mt-2 block text-sm text-blue-600 underline"
                      >
                        {person.phone}
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            )}

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

            <DetailCard
              title="Date / Ville"
              value={selectedCity.city}
              extra={selectedCity.date}
            />

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
                <p className="m-0 text-2xl font-black uppercase text-white">
                  Salle
                </p>
              </div>

              <div className="px-5 py-5">
                <p className="m-0 text-2xl font-bold text-slate-900">
                  {selectedCity.venue}
                </p>
                {selectedCity.capacite ? (
                  <p className="mt-2 text-sm text-slate-600">
                    Capacité : {selectedCity.capacite}
                  </p>
                ) : null}

                {mapsLink ? (
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-block rounded-full bg-pink-500 px-4 py-2 text-sm font-bold text-white"
                  >
                    Ouvrir dans Maps
                  </a>
                ) : null}
              </div>
            </div>

            <DetailCard title="Voyage" value={selectedCity.travelType} />
            <DetailCard
              title="Horaires de voyage"
              value={
                selectedCity.departureTime || selectedCity.arrivalTime
                  ? `${selectedCity.departureTime} → ${selectedCity.arrivalTime}`
                  : ""
              }
              extra={
                selectedCity.departureCity || selectedCity.arrivalCity
                  ? `${selectedCity.departureCity} → ${selectedCity.arrivalCity}`
                  : ""
              }
            />
            <DetailCard title="Hôtel" value={selectedCity.hotel} />
            <DetailCard title="Hôtel / Salle" value={selectedCity.hotelSalle} />
            <DetailCard title="Transport" value={selectedCity.transport} />
            <DetailCard title="Balances" value={selectedCity.balance} />
            <DetailCard title="Ouverture des portes" value={selectedCity.doors} />
            <DetailCard title="Début du show" value={selectedCity.showOrder} />
            <DetailCard title="Restauration" value={selectedCity.restauration} />
            <DetailCard title="Production locale" value={selectedCity.productionLocal} />
          </div>
        )}
      </div>
    </main>
  );
}