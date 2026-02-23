import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

function Settings() {
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("IDR");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setBudget(data.monthly_budget || "");
      setCurrency(data.currency || "IDR");
    }
  };

  const saveSettings = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("user_settings")
      .upsert({
        user_id: user.id,
        monthly_budget: Number(budget),
        currency,
      });

    setLoading(false);

    if (error) {
      toast.error("Failed to save settings");
      return;
    }

    toast.success("Settings saved");
  };

  const clearTransactions = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete ALL transactions?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("transactions")
      .delete()
      .neq("id", 0);

    if (error) {
      toast.error("Failed to clear data");
      return;
    }

    toast.success("All transactions deleted");
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">

      <h1 className="text-3xl font-semibold mb-8">
        Settings
      </h1>

      {/* ===== MONTHLY BUDGET ===== */}
      <div className="bg-slate-800 p-6 rounded-2xl mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Monthly Budget
        </h2>

        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Enter monthly budget"
          className="w-full p-3 rounded-lg bg-slate-700 text-white outline-none"
        />
      </div>

      {/* ===== CURRENCY SELECTOR ===== */}
      <div className="bg-slate-800 p-6 rounded-2xl mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Currency
        </h2>

        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full p-3 rounded-lg bg-slate-700 text-white outline-none"
        >
          <option value="IDR">IDR (Rp)</option>
          <option value="USD">USD ($)</option>
          <option value="SGD">SGD ($)</option>
          <option value="EUR">EUR (€)</option>
        </select>
      </div>

      {/* SAVE BUTTON */}
      <button
        onClick={saveSettings}
        disabled={loading}
        className="w-full bg-emerald-500 hover:bg-emerald-600 transition p-3 rounded-xl font-semibold mb-10"
      >
        {loading ? "Saving..." : "Save Settings"}
      </button>

      {/* ===== DANGER ZONE ===== */}
      <div className="bg-red-500/10 border border-red-500 p-6 rounded-2xl">
        <h2 className="text-lg font-semibold text-red-400 mb-4">
          Danger Zone
        </h2>

        <button
          onClick={clearTransactions}
          className="bg-red-500 hover:bg-red-600 transition px-6 py-3 rounded-xl font-semibold"
        >
          Clear All Transactions
        </button>
      </div>

    </div>
  );
}

export default Settings;