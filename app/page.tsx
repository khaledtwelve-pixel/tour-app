
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

  const months = ["AVRIL", "MAI"];

  const topContacts = useMemo(() => {
    return teamData.filter((p) =>
      [
        "Régisseur artiste",
        "Régisseur général",
        "Administrateur de tournée",
      ].includes(p.role)
    );
  }, [teamData]);

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
          <p
            className="mb-2 font-black uppercase"
            style={{ color: "#ff5ca8", fontSize: "28px" }}
          >
            PAUL MIRABEL
          </p>

          <h1
            className="m-0 font-black italic"
            style={{ fontSize: "80px" }}
          >
            par amour
          </h1>
        </div>

        {/* PAGE ACCUEIL */}
        {!selectedMonth && (
          <div className="space-y-4">

            {/* MOIS */}
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

            {/* CONTACTS */}
            {topContacts.length > 0 && (
              <div className="mt-6 space-y-3">
                {topContacts.map((person, i) => (
                  <