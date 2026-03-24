"use client";

import { useEffect, useState } from "react";

type EventItem = {
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
  returnType: string;
  gareHotel: string;
  gareSalle: string;
  hotelSalle: string;
  runnerName: string;
  runnerPhone: string;
  balance: string;
  doors: string;
  showOrder: string;
  restauration: string;
  productionLocal: string;
  regisseur: string;
  accueille: string;
};

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1Gw5lRqEonLr_8OAYSC3QLtNSMhyDF2X3mW0g_ZDXl64/gviz/tq?tqx=out:csv&sheet=DATA";

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

function csvToObjects(csv: string): EventItem[] {
  const lines = csv
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row: Record<string, string> = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    return {
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
      returnType: row.returnType || "",
      gareHotel: row.gareHotel || "",
      gareSalle: row.gareSalle || "",
      hotelSalle: row.hotelSalle || "",
      runnerName: row.runnerName || "",
      runnerPhone: row.runnerPhone || "",
      balance: row.balance || "",
      doors: row.doors || "",
      showOrder: row.showOrder || "",
      restauration: row.restauration || "",
      productionLocal: row.productionLocal || "",
      regisseur: row.regisseur || "",
      accueille: row.accueille || "",
    };
  });
}

export default function Home() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selected, setSelected] = useState<EventItem | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(SHEET_CSV_URL);
        const csv = await response.text();
        const parsed = csvToObjects(csv);
        setEvents(parsed);
      } catch (error) {
        console.error("Erreur chargement Google Sheet :", error);
      }
    }

    loadData();
  }, []);

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: "#8fd3ff",
    padding: 24,
    fontFamily: "Arial, sans-serif",
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: 430,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  };

  const cardStyle: React.CSSProperties = {
    background: "white",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  };

  const pinkButton: React.CSSProperties = {
    background: "#e91e63",
    color: "white",
    border: "none",
    borderRadius: 14,
    padding: 14,
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
    textDecoration: "none",
    display: "block",
    textAlign: "center",
    boxSizing: "border-box",
  };

  if (selected) {
    return (
      <main style={pageStyle}>
        <div style={containerStyle}>
          <button onClick={() => setSelected(null)} style={pinkButton}>
            ← Retour
          </button>

          <div
            style={{
              background: "linear-gradient(180deg, #2e2bbf 0%, #56c7ff 100%)",
              color: "white",
              borderRadius: 20,
              padding: 20,
            }}
          >
            <p style={{ margin: 0, opacity: 0.9 }}>{selected.date}</p>
            <h1 style={{ margin: "8px 0 4px", fontSize: 36 }}>{selected.city}</h1>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{selected.venue}</p>
          </div>

          <div style={cardStyle}>
            <h2>📍 Salle</h2>
            <p style={{ margin: "8px 0", fontWeight: 700 }}>{selected.venue}</p>
            <p style={{ margin: "8px 0", color: "#555" }}>{selected.address}</p>
          </div>

          <div style={cardStyle}>
            <h2>🚌 Voyage</h2>
            <p><strong>Type :</strong> {selected.travelType}</p>
            <p><strong>Départ :</strong> {selected.departureCity}</p>
            <p><strong>Arrivée :</strong> {selected.arrivalCity}</p>
            <p><strong>Heure départ :</strong> {selected.departureTime}</p>
            <p><strong>Heure arrivée :</strong> {selected.arrivalTime}</p>
            <p><strong>Transport :</strong> {selected.transport}</p>
            <p><strong>Retour :</strong> {selected.returnType}</p>
          </div>

          <div style={cardStyle}>
            <h2>📏 Distances</h2>
            <p><strong>Gare → Hôtel :</strong> {selected.gareHotel}</p>
            <p><strong>Gare → Salle :</strong> {selected.gareSalle}</p>
            <p><strong>Hôtel → Salle :</strong> {selected.hotelSalle}</p>
          </div>

          <div style={cardStyle}>
            <h2>⏰ Horaires</h2>
            <p><strong>Balance :</strong> {selected.balance}</p>
            <p><strong>Ouverture portes :</strong> {selected.doors}</p>
            <p><strong>Ordre show :</strong> {selected.showOrder}</p>
          </div>

          <div style={cardStyle}>
            <h2>🍽️ Restauration</h2>
            <p>{selected.restauration}</p>
          </div>

          <div style={cardStyle}>
            <h2>👤 Runner</h2>
            <p><strong>Nom :</strong> {selected.runnerName}</p>
            <p><strong>Téléphone :</strong> {selected.runnerPhone}</p>
            {selected.runnerPhone && (
              <a href={`tel:${selected.runnerPhone}`} style={{ ...pinkButton, marginTop: 12 }}>
                Appeler le runner
              </a>
            )}
          </div>

          <div style={cardStyle}>
            <h2>🎭 Contacts</h2>
            <p><strong>Production locale :</strong> {selected.productionLocal}</p>
            <p><strong>Régisseur :</strong> {selected.regisseur}</p>
            <p><strong>Accueil :</strong> {selected.accueille}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <div
          style={{
            background: "linear-gradient(180deg, #2e2bbf 0%, #56c7ff 100%)",
            color: "white",
            borderRadius: 20,
            padding: 20,
          }}
        >
          <p style={{ margin: 0, opacity: 0.9 }}>Paul Mirabel</p>
          <h1 style={{ margin: "8px 0 4px", fontSize: 36 }}>par amour</h1>
          <p style={{ margin: 0, fontSize: 18 }}>Tournée / planning</p>
        </div>

        {events.map((event, index) => (
          <div
            key={index}
            onClick={() => setSelected(event)}
            style={{
              ...cardStyle,
              cursor: "pointer",
              border: "2px solid rgba(233,30,99,0.15)",
            }}
          >
            <h2 style={{ margin: "0 0 8px", color: "#be185d" }}>{event.city}</h2>
            <p style={{ margin: "0 0 4px", fontWeight: 700 }}>{event.venue}</p>
            <p style={{ margin: 0, color: "#555" }}>{event.date}</p>
          </div>
        ))}
      </div>
    </main>
  );
}