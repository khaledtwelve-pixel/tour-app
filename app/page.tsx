"use client";

import { useEffect, useMemo, useState } from "react";

const ARTISTS = {
  paul: "1japAvkYshUBq_D55JOwZCvYfqUGM_OJeJ0kx-GIW-Zk",
};

type TourItem = {
  date: string;
  city: string;
  venue: string;
  address?: string;
  Capacite?: string;
  travelType?: string;
  departureCity?: string;
  arrivalCity?: string;
  departureTime?: string;
  arrivalTime?: string;
  hotel?: string;
  hotelSalle?: string;
  transport?: string;
  Balance?: string;
  Doors?: string;
  ShowOrder?: string;
  Restauration?: string;
  ProductionLocal?: string;
  runnerName?: string;
  runnerPhone?: string;
  accueille?: string;
  accueillePhone?: string;
  regisseur?: string;
  regisseurPhone?: string;
};

function parseCSVLine(line: string) {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') inQuotes = !inQuotes;
    else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else current += char;
  }

  result.push(current.trim());
  return result.map((v) => v.replace(/"/g, ""));
}

function parseCSV(csv: string) {
  const lines = csv.split("\n").filter(Boolean);
  const headers = parseCSVLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const obj: any = {};
    headers.forEach((h, i) => (obj[h] = values[i] || ""));
    return obj;
  });
}

function Detail({ title, value }: any) {
  if (!value) return null;

  return (
    <div className="rounded-xl bg-white p-3 shadow">
      <p className="text-xs text-pink-500 font-bold uppercase">{title}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}

export default function Page() {
  const [artist, setArtist] = useState<keyof typeof ARTISTS>("paul");
  const [data, setData] = useState<TourItem[]>([]);
  const [selected, setSelected] = useState<any>(null);

  const SHEET_ID = ARTISTS[artist];

  useEffect(() => {
    fetch(
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=DATA`
    )
      .then((r) => r.text())
      .then((csv) => setData(parseCSV(csv)));
  }, [artist]);

  return (
    <main className="p-4 bg-blue-200 min-h-screen">

      {/* HEADER */}
      <h1 className="text-3xl font-black text-pink-500 mb-4">
        BACKSTAGE
      </h1>

      {/* LISTE VILLES */}
      {!selected &&
        data.map((item, i) => (
          <button
            key={i}
            onClick={() => setSelected(item)}
            className="block w-full bg-white p-4 rounded-xl mb-3 shadow"
          >
            <p className="text-xs">{item.date}</p>
            <p className="text-xl font-bold">{item.city}</p>
            <p>{item.venue}</p>
          </button>
        ))}

      {/* DETAIL */}
      {selected && (
        <div className="space-y-3">

          <button onClick={() => setSelected(null)}>
            ← Retour
          </button>

          <Detail title="Ville" value={selected.city} />
          <Detail title="Date" value={selected.date} />
          <Detail title="Salle" value={selected.venue} />
          <Detail title="Adresse" value={selected.address} />
          <Detail title="Capacité" value={selected.Capacite} />

          <Detail title="Voyage" value={selected.travelType} />
          <Detail
            title="Horaires"
            value={`${selected.departureTime} → ${selected.arrivalTime}`}
          />

          <Detail title="Hôtel" value={selected.hotel} />
          <Detail title="Transport" value={selected.transport} />

          <Detail title="Balances" value={selected.Balance} />
          <Detail title="Portes" value={selected.Doors} />
          <Detail title="Show" value={selected.ShowOrder} />

          <Detail title="Restauration" value={selected.Restauration} />
          <Detail title="Production" value={selected.ProductionLocal} />

          <Detail
            title="Runner"
            value={`${selected.runnerName} ${selected.runnerPhone}`}
          />

          <Detail
            title="Accueil"
            value={`${selected.accueille} ${selected.accueillePhone}`}
          />

          <Detail
            title="Régisseur"
            value={`${selected.regisseur} ${selected.regisseurPhone}`}
          />

          {selected.address && (
            <a
              href={`https://maps.google.com?q=${encodeURIComponent(
                selected.address
              )}`}
              target="_blank"
              className="block bg-pink-500 text-white text-center p-3 rounded-xl"
            >
              Ouvrir Maps
            </a>
          )}
        </div>
      )}
    </main>
  );
}