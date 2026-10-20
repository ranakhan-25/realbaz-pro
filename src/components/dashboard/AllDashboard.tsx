export default function AllDashboard() {
  const cards = [
    { label: "Projects", value: "38", tone: "bg-emerald-500/10 text-emerald-600" },
    { label: "Inventory", value: "1,284", tone: "bg-blue-500/10 text-blue-600" },
    { label: "Accounts", value: "৳ 42.1M", tone: "bg-violet-500/10 text-violet-600" },
    { label: "People", value: "486", tone: "bg-amber-500/10 text-amber-600" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {card.label}
            </div>
            <div className="mt-3 text-2xl font-display font-bold tracking-tight text-foreground">
              {card.value}
            </div>
            <div
              className={`mt-3 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${card.tone}`}
            >
              Consolidated view
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-4 text-sm font-semibold text-foreground">Business snapshot</div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Pipeline", "92", "Active opportunities"],
            ["Collections", "84%", "Realisation rate"],
            ["Procurement", "26", "Open orders"],
          ].map(([label, value, note]) => (
            <div key={label} className="rounded-lg border border-border bg-background p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {label}
              </div>
              <div className="mt-3 text-3xl font-display font-bold text-foreground">{value}</div>
              <div className="mt-2 text-xs text-muted-foreground">{note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
