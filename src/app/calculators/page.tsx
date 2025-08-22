export default function CalculatorsHub() {
  const items: [string, string][] = [
    ["iv", "IV"],
    ["ev", "EV"],
    ["damages", "Dégâts"],
    ["stats", "Statistiques"],
    ["catch", "Capture"],
    ["happiness", "Bonheur"],
    ["sos", "SOS"],
    ["encounters", "Rencontres"],
    ["ranges", "Ranges d'attaques"],
  ];
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Calculateurs</h1>
      <ul className="list-disc pl-6">
        {items.map(([path, label]) => (
          <li key={path}>
            <a className="text-blue-600 underline" href={`/calculators/${path}`}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
