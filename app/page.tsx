"use client";

import { useEffect, useMemo, useState } from "react";

const SHEET_ID = "1japAvkYshUBq_D55JOwZCvYfqUGM_OJeJ0kx-GIW-Zk";

const DATA_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=DATA`;
const TEAM_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=TEAM`;

function parseCSVLine(line: string) {
  return line.split(",").map((v) => v.replace(/"/g, "").trim());
}

function parseDate(dateStr: string) {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
}

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  const [view, setView] = useState("months");
  const [month, setMonth] = useState("");
  const [city, setCity] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(DATA_URL);
      const text = await res.text();

      const rows = text.split("\n").slice(1);

      const parsed = rows.map((row) => {
        const c = parseCSVLine(row);

        return {
          date: c[0],
          city: c[1],
          venue: c[2],
          address: c[3],
          departureCity: c[5],
          arrivalCity: c[6],
          departureTime: c[7],
          arrivalTime: c[8],
          transport: c[9],
          hotel: c[10],
          balance: c[11],
          doors: c[12],
          show: c[13],
          catering: c[14],
          production: c[15],
        };
      });

      const today = new Date();

      const filtered = parsed.filter((item) => {
        const d = parseDate(item.date);
        return d >= today && (d.getMonth() === 3 || d.getMonth() === 4);
      });

      setData(filtered);
    }

    load();
  }, []);

  const months = [...new Set(data.map((d) => parseDate(d.date).getMonth()))];

  return (
    <main style={{ padding: 20 }}>
      <h1>Tournée</h1>

      {view === "months" &&
        months.map((m) => (
          <button
            key={m}
            onClick={() => {
              setMonth(m);
              setView("cities");
            }}
          >
            Mois {m + 1}
          </button>
        ))}

      {view === "cities" &&
        data
          .filter((d) => parseDate(d.date).getMonth() === month)
          .map((d, i) => (
            <div key={i} onClick={() => setCity(d)}>
              {d.city}
            </div>
          ))}

      {city && (
        <div>
          <h2>{city.city}</h2>
          <p>{city.venue}</p>
          <p>{city.date}</p>
          <p>{city.departureCity} → {city.arrivalCity}</p>
          <p>{city.doors} / {city.show}</p>
        </div>
      )}
    </main>
  );
}