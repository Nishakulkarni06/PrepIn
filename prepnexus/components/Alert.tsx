"use client";

export default function Alert({
  message,
  type = "success",
}: {
  message: string;
  type?: "success" | "error";
}) {
  const base = "top-5 center px-4 py-2 rounded shadow-md z-50 text-white text-center transition-all duration-300";
  const bg = type === "success" ? "bg-green-600" : "bg-red-600";

  return (
    <div className={`${base} ${bg}`}>
      {message}
    </div>
  );
}
