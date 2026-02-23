import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import AnimatedCounter from "../components/AnimatedCounter";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [latestTransactions, setLatestTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTransactions(data);
      setLatestTransactions(data.slice(0, 5));
    }
  };

  // === CALCULATIONS ===
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const cashFlow = totalIncome - totalExpense;

  // saving rate
  const savingRate =
  totalIncome > 0
    ? ((cashFlow / totalIncome) * 100)
    : 0;

const savingRateFixed = Number(savingRate.toFixed(1));

const savingRateColor =
  savingRateFixed >= 30
    ? "text-emerald-400"
    : savingRateFixed >= 10
    ? "text-yellow-400"
    : "text-red-400";

  return (
    <div className="pb-10">

      {/* HEADER */}
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-10">
        Dashboard Overview
      </h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* SAVING RATE */}
<div className="p-6 bg-slate-800 rounded-2xl">
  <p className="text-slate-400 mb-2">Saving Rate</p>

  <h2 className={`text-3xl font-bold ${savingRateColor}`}>
  {savingRateFixed}%
</h2>

  <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
    <div
      className={`h-full ${
        savingRate >= 30
          ? "bg-emerald-400"
          : savingRate >= 10
          ? "bg-yellow-400"
          : "bg-red-400"
      }`}
      style={{ width: `${Math.min(savingRateFixed, 100)}%` }}
    />
  </div>
</div>

        {/* INCOME */}
        <div className="p-6 bg-slate-800 rounded-2xl">
          <p className="text-white mb-2">Total Income</p>
          <h2 className="text-3xl font-bold text-emerald-400">
            Rp <AnimatedCounter value={totalIncome} />
          </h2>
        </div>

        {/* EXPENSE */}
        <div className="p-6 bg-slate-800 rounded-2xl">
          <p className="text-white mb-2">Total Expense</p>
          <h2 className="text-3xl font-bold text-red-400">
            Rp <AnimatedCounter value={totalExpense} />
          </h2>
        </div>

        {/* CASH FLOW */}
        <div className="p-6 bg-slate-800 rounded-2xl">
          <p className="text-white mb-2">Cash Flow</p>
          <h2 className="text-3xl font-bold text-indigo-400">
            Rp <AnimatedCounter value={cashFlow} />
          </h2>
        </div>

      </div>

      {/* ===== LATEST TRANSACTIONS ===== */}
      <div className="mt-10 p-6 bg-slate-800 rounded-2xl">

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">
            Latest Transactions
          </h3>
        </div>

        {latestTransactions.length === 0 ? (
          <p className="text-slate-400">No transactions yet.</p>
        ) : (
          <div className="space-y-4">

            {latestTransactions.map((trx) => (
              <div
                key={trx.id}
                className="flex justify-between items-center bg-slate-700 p-4 rounded-xl text-white"
              >
                <div>
                  <p className="font-medium capitalize">
                    {trx.category}
                  </p>
                  <p className="text-sm text-white">
                    {new Date(trx.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>

                <p
                  className={`font-semibold text-white ${
                    trx.type === "income"
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {trx.type === "income" ? "+" : "-"} Rp{" "}
                  {Number(trx.amount).toLocaleString("id-ID")}
                </p>
              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Dashboard;