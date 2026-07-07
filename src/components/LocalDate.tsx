"use client";

export default function LocalDate({ date, prefix }: { date: string; prefix: string }) {
  const d = new Date(date);
  return (
    <span>
      {prefix} {d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
      {" "}
      {d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
}
