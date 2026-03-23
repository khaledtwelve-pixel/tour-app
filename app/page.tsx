"use client";

import { useState } from "react";

type EventType = {
  city: string;
  venue: string;
  hotel: string;
  schedule: {
    hotelDeparture: string;
    soundcheck: string;
    doors: string;
    show: string;
  };
  distances: {
    gareHotel: string;
    hotelSalle: string;
    gareSalle: string;
  };
  runner: {
    name: string;
    phone: string;
  };
};

export default function Home() {
  const [selected, setSelected] = useState<EventType | null>(null);

  const events: EventType[] = [
    {
      city: "Paris",
      venue: "Accor Arena",
      hotel: "Hôtel Bercy",
      schedule: {
        hotelDeparture: "10:00",
        soundcheck: "14:00",
        doors: "19:00",
        show: "20:30",
      },
      distances: {
        gareHotel: "10 min",
        hotelSalle: "5 min",
        gareSalle: "15 min",
      },
      runner: {
        name: "Paul",
        phone: "06 00 00 00 00",
      },
    },
    {
      city: "Lyon",
      venue: "Halle Tony Garnier",
      hotel: "Hôtel Lyon Centre",
      schedule: {
        hotelDeparture: "09:30",
        soundcheck: "13:30",
        doors: "18:30",
        show: "20:00",
      },
      distances: {
        gareHotel: "12 min",
        hotelSalle: "8 min",
        gareSalle: "18 min",
      },
      runner: {
        name: "Nina",
        phone: "06 11 11 11 11",
      },
    },
    {
      city: "Marseille",
      venue: "Dôme",
      hotel: "Hôtel Vieux Port",
      schedule: {
        hotelDeparture: "11:00",
        soundcheck: "15:00",
        doors: "19:30",
        show: "21:00",
      },
      distances: {
        gareHotel: "9 min",
        hotelSalle: "7 min",
        gareSalle: "16 min",
      },
      runner: {
        name: "Karim",
        phone: "06 22 22 22 22",
      },
    },
  ];

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    padding: 24,
    fontFamily: "Arial, sans-serif",
    background:
      "linear-gradient(180deg, #0ea5e9 0%, #38bdf8 35%, #bae6fd 100%)",
  };

  const wrapperStyle: React.CSSProperties = {
    maxWidth: 430,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  };

  const heroStyle: React.CSSProperties = {
    background: "linear-gradient(180deg, #1d4ed8 0%, #0ea5e9 100%)",
    color: "white",
    padding: 20,
    borderRadius: 20,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  };

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(6px)",
    padding: 16,
    borderRadius: 18,
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  };

  const primaryButtonStyle: React.CSSProperties = {
    display: "block",
    marginTop: 10,
    padding: 12,
    background: "#ec4899",
    color: "white",
    textAlign: "center",
    borderRadius: 12,
    textDecoration: "none",
    fontWeight: 700,
  };

  const secondaryButtonStyle: React.CSSProperties = {
    display: "block",
    marginTop: 10,
    padding: 12,
    background: "#f472b6",
    color: "white",
    textAlign: "center",
    borderRadius: 12,
    textDecoration: "none",
    fontWeight: 700,
  };

  const backButtonStyle: React.CSSProperties = {
    padding: 12,
    borderRadius: 12,
    border: "none",
    background: "#ec4899",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
  };

  if (selected) {
    return (
      <main style={pageStyle}>
        <div style={wrapperStyle}>
          <button onClick={() => setSelected(null)} style={backButtonStyle}>
            ← Retour
          </button>

          <div style={heroStyle}>
            <p style={{ margin: 0, fontSize: 14, opacity: 0.9 }}>Fiche date</p>
            <h1 style={{ margin: "8px 0 4px 0", fontSize: 34 }}>
              {selected.city}
            </h1>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
              {selected.venue}
            </p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, color: "#be185d" }}>📍 Salle</h2>
            <p style={{ marginBottom: 0 }}>
              {selected.venue} — {selected.city}
            </p>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selected.venue} ${selected.city}`}
              target="_blank"
              style={primaryButtonStyle}
            >
              🚗 Itinéraire vers la salle
            </a>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, color: "#be185d" }}>⏰ Horaires</h2>
            <p>Départ hôtel : {selected.schedule.hotelDeparture}</p>
            <p>Balance : {selected.schedule.soundcheck}</p>
            <p>Portes : {selected.schedule.doors}</p>
            <p style={{ marginBottom: 0 }}>Show : {selected.schedule.show}</p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, color: "#be185d" }}>🏨 Hôtel</h2>
            <p style={{ marginBottom: 0 }}>
              {selected.hotel} — {selected.city}
            </p>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selected.hotel} ${selected.city}`}
              target="_blank"
              style={secondaryButtonStyle}
            >
              🚗 Itinéraire vers l'hôtel
            </a>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, color: "#be185d" }}>📏 Distances</h2>
            <p>Gare → Hôtel : {selected.distances.gareHotel}</p>
            <p>Hôtel → Salle : {selected.distances.hotelSalle}</p>
            <p style={{ marginBottom: 0 }}>
              Gare → Salle : {selected.distances.gareSalle}
            </p>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, color: "#be185d" }}>💖 Runner</h2>
            <p>Nom : {selected.runner.name}</p>
            <p>Téléphone : {selected.runner.phone}</p>

            <a
              href={`tel:${selected.runner.phone.replaceAll(" ", "")}`}
              style={primaryButtonStyle}
            >
              📞 Appeler
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={wrapperStyle}>
        <div style={heroStyle}>
          <p style={{ margin: 0, fontSize: 14, opacity: 0.9 }}>Paul Mirabel</p>
          <h1 style={{ margin: "8px 0 4px 0", fontSize: 36 }}>par amour</h1>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
            Tournée / planning
          </p>
        </div>

        {events.map((event, index) => (
          <div
            key={index}
            onClick={() => setSelected(event)}
            style={{
              ...cardStyle,
              cursor: "pointer",
              border: "2px solid rgba(236,72,153,0.15)",
            }}
          >
            <h2 style={{ margin: "0 0 8px 0", color: "#be185d" }}>
              {event.city}
            </h2>
            <p style={{ margin: "0 0 4px 0", fontWeight: 700 }}>{event.venue}</p>
            <p style={{ margin: 0, color: "#475569" }}>{event.hotel}</p>
          </div>
        ))}
      </div>
    </main>
  );
}


