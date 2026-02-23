import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [editingId, setEditingId] = useState(null);

  // ===============================
  // TYPE BADGE COMPONENT
  // ===============================
  const TypeBadge = ({ type }) => {
    const isIncome = type === "income";

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide
        ${
          isIncome
            ? "bg-emerald-500/20 text-emerald-500"
            : "bg-red-500/20 text-red-500"
        }`}
      >
        {isIncome ? "Income" : "Expense"}
      </span>
    );
  };

  // ===============================
  // FETCH DATA
  // ===============================
  const fetchTransactions = async () => {
    let query = supabase
      .from("transactions")
      .select("id,type,category,amount,created_at");

    if (filterType !== "all") query = query.eq("type", filterType);

    if (filterMonth) {
      const start = new Date(filterMonth);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);

      query = query
        .gte("created_at", start.toISOString())
        .lt("created_at", end.toISOString());
    }

    if (sortBy === "date_desc")
      query = query.order("created_at", { ascending: false });

    if (sortBy === "date_asc")
      query = query.order("created_at", { ascending: true });

    if (sortBy === "amount_desc")
      query = query.order("amount", { ascending: false });

    if (sortBy === "amount_asc")
      query = query.order("amount", { ascending: true });

    const { data } = await query;
    setTransactions(data || []);
  };

  useEffect(() => {
    fetchTransactions();
  }, [filterMonth, filterType, sortBy]);

  // ===============================
  // SAVE
  // ===============================
  const handleSave = async () => {
    if (!category || !amount) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    if (editingId) {
      await supabase
        .from("transactions")
        .update({ type, category, amount: Number(amount) })
        .eq("id", editingId);

      toast.success("Transaction updated ✏️");
    } else {
      await supabase.from("transactions").insert([
        { type, category, amount: Number(amount) },
      ]);

      toast.success("Transaction added 🎉");
    }

    await fetchTransactions();
    setCategory("");
    setAmount("");
    setType("income");
    setEditingId(null);
    setShowModal(false);
    setLoading(false);
  };

  // ===============================
  // DELETE
  // ===============================
  const confirmDelete = async () => {
    await supabase.from("transactions").delete().eq("id", deleteId);
    toast.success("Deleted 🗑️");
    setDeleteId(null);
    await fetchTransactions();
  };

  const handleEdit = (t) => {
    setEditingId(t.id);
    setType(t.type);
    setCategory(t.category);
    setAmount(t.amount);
    setShowModal(true);
  };

  return (
    <div className="space-y-6 pb-10 px-4 md:px-0">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-600 dark:text-yellow-800">
          Transactions
        </h1>

        <button
          onClick={() => {
            setEditingId(null);
            setShowModal(true);
          }}
          className="bg-emerald-500 hover:bg-emerald-600 px-5 py-3 rounded-xl font-semibold transition active:scale-95 text-white"
        >
          + Add Transaction
        </button>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 p-6 md:p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-slate-700">

        {/* FILTER */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600"
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600"
          >
            <option value="date_desc">Newest</option>
            <option value="date_asc">Oldest</option>
            <option value="amount_desc">Highest Amount</option>
            <option value="amount_asc">Lowest Amount</option>
          </select>
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="py-3">Type</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700/40 transition"
                >
                  <td className="py-4">
                    <TypeBadge type={t.type} />
                  </td>

                  <td>{t.category}</td>

                  <td
                    className={`font-semibold ${
                      t.type === "income"
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  >
                    Rp {Number(t.amount).toLocaleString()}
                  </td>

                  <td className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(t.created_at).toLocaleDateString("id-ID")}
                  </td>

                  <td className="flex gap-3">
                    <button
                      onClick={() => handleEdit(t)}
                      className="text-yellow-500 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteId(t.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD */}
        <div className="md:hidden space-y-4">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-700/40 border border-gray-200 dark:border-slate-600"
            >
              <div className="flex justify-between items-center">
                <TypeBadge type={t.type} />
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(t.created_at).toLocaleDateString("id-ID")}
                </div>
              </div>

              <div className="mt-3 font-medium">{t.category}</div>

              <div className="flex justify-between items-center mt-3">
                <div
                  className={`font-semibold ${
                    t.type === "income"
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  Rp {Number(t.amount).toLocaleString()}
                </div>

                <div className="flex gap-4 text-sm">
                  <button
                    onClick={() => handleEdit(t)}
                    className="text-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(t.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL ADD / EDIT */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 w-[420px] rounded-3xl p-8 space-y-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold">
              {editingId ? "Edit Transaction" : "Add Transaction"}
            </h2>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-100 dark:bg-slate-700 dark:text-slate-700"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className="w-full p-4 rounded-xl bg-gray-100 dark:bg-slate-700 dark:text-slate-700"
            />

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="w-full p-4 rounded-xl bg-gray-100 dark:bg-slate-700"
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-3 rounded-xl bg-gray-200 dark:bg-slate-700"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={loading}
                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 w-[420px] rounded-3xl p-8 space-y-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-red-500">
              Delete Transaction?
            </h2>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="px-5 py-3 rounded-xl bg-gray-200 dark:bg-slate-700"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-5 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;