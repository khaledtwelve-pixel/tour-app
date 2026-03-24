  return rows.map((row) => {
    const cols = row.split(",");
    return {
      date: cols[0],
      city: cols[1],
      venue: cols[2],
      address: cols[3],
    };
  });
}
