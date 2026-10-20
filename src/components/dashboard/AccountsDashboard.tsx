export default function AccountsDashboard() {
  const metrics = [
    { label: "Cash flow", value: "৳ 2.4M", tone: "bg-emerald-500/10 text-emerald-600" },
    { label: "Receivables", value: "৳ 18.7M", tone: "bg-blue-500/10 text-blue-600" },
    { label: "Payables", value: "৳ 11.1M", tone: "bg-orange-500/10 text-orange-600" },
    { label: "Budget variance", value: "+6.8%", tone: "bg-violet-500/10 text-violet-600" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {metric.label}
            </div>
            <div className="mt-3 text-2xl font-display font-bold tracking-tight text-foreground">
              {metric.value}
            </div>
            <div
              className={`mt-3 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${metric.tone}`}
            >
              Updated today
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-4 text-sm font-semibold text-foreground">Recent accounting activity</div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-160 text-left text-sm">
            <thead className="border-b border-border text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-semibold">Voucher</th>
                <th className="px-3 py-2 font-semibold">Type</th>
                <th className="px-3 py-2 font-semibold">Project</th>
                <th className="px-3 py-2 font-semibold">Date</th>
                <th className="px-3 py-2 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["ACC-2048", "Invoice", "Riverside Horizon", "03-Sept-2026", "৳ 1.8M"],
                ["ACC-2051", "Payment", "Meridian Tower", "02-Sept-2026", "৳ 2.4M"],
                ["ACC-2057", "Journal", "Greenfield Court", "01-Sept-2026", "৳ 0.9M"],
              ].map(([voucher, type, project, date, amount]) => (
                <tr key={voucher} className="hover:bg-foreground/3">
                  <td className="px-3 py-3 font-medium text-foreground">{voucher}</td>
                  <td className="px-3 py-3 text-muted-foreground">{type}</td>
                  <td className="px-3 py-3 text-muted-foreground">{project}</td>
                  <td className="px-3 py-3 text-muted-foreground">{date}</td>
                  <td className="px-3 py-3 text-right font-mono text-foreground">{amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
