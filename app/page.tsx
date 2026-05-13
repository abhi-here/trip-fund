"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";
export default function Home() {

  const [members, setMembers] =
  useState<any[]>([]);

  const [expenses, setExpenses] =
  useState<any[]>([]);

  const [expenseTitle, setExpenseTitle] =
    useState("");

  const [expenseAmount, setExpenseAmount] =
    useState("");

  const [selectedMember, setSelectedMember] =
    useState("");

  const [contributionAmount, setContributionAmount] =
    useState("");

  const [memberName, setMemberName] =
    useState("");

  const [memberShares, setMemberShares] =
    useState("");

  const [showParticipants, setShowParticipants] =
    useState(false);

  const [showContributions, setShowContributions] =
    useState(false);

  const [showExpenses, setShowExpenses] =
    useState(false);

  const [showStatus, setShowStatus] =
    useState(false);

  const [tripEnded, setTripEnded] =
  useState(false);

  const [editingExpense, setEditingExpense] =
  useState<number | null>(null);

const [editedTitle, setEditedTitle] =
  useState("");

const [editedAmount, setEditedAmount] =
  useState("");

  const [expandedDates, setExpandedDates] =
  useState<Record<string, boolean>>({});

  const [tripName, setTripName] =
  useState(() => {

    if (typeof window !== "undefined") {

      return (
        localStorage.getItem(
          "tripName"
        ) || ""
      );
    }

    return "";
  });

const [tripStartDate, setTripStartDate] =
  useState(() => {

    if (typeof window !== "undefined") {

      return (
        localStorage.getItem(
          "tripStartDate"
        ) || "2026-05-12"
      );
    }

    return "2026-05-12";
  });

const [tripEndDate, setTripEndDate] =
  useState(() => {

    if (typeof window !== "undefined") {

      return (
        localStorage.getItem(
          "tripEndDate"
        ) || "2026-05-22"
      );
    }

    return "2026-05-22";
  });

  useEffect(() => {

  const fetchData = async () => {

    const {
      data: membersData,
    } = await supabase
      .from("members")
      .select("*");

    const {
      data: expensesData,
    } = await supabase
      .from("expenses")
      .select("*");

    if (membersData) {

  setMembers(membersData);

  
}
    if (expensesData) {

      const formattedExpenses =
        expensesData.map(
          (expense: any) => ({
            ...expense,
            createdAt: new Date(
              expense.created_at + "Z"
            ),
          })
        );

      setExpenses(
        formattedExpenses
      );
    }
  };

  fetchData();

}, []);  

  useEffect(() => {

    localStorage.setItem(
      "members",
      JSON.stringify(members)
    );

  }, [members]);

  useEffect(() => {

    localStorage.setItem(
      "expenses",
      JSON.stringify(expenses)
    );

  }, [expenses]);

  useEffect(() => {

  localStorage.setItem(
    "tripName",
    tripName
  );

  localStorage.setItem(
    "tripStartDate",
    tripStartDate
  );

  localStorage.setItem(
    "tripEndDate",
    tripEndDate
  );

}, [
  tripName,
  tripStartDate,
  tripEndDate
]);
useEffect(() => {

  localStorage.setItem(
    "tripEnded",
    JSON.stringify(
      tripEnded
    )
  );

}, [tripEnded]);

  const addExpense = async () => {

  if (!expenseTitle || !expenseAmount) {
    return;
  }

  const newExpense = {
    title: expenseTitle,
    amount: Number(expenseAmount),
    createdAt: new Date(),
  };

  const { data } =
  await supabase
    .from("expenses")
    .insert([
      {
        title: newExpense.title,
        amount: newExpense.amount,
      },
    ])
    .select();

if (data) {

  const expenseToAdd = {
    ...data[0],
    createdAt: new Date(
      data[0].created_at + "Z"
    ),
  };

  setExpenses([
    ...expenses,
    expenseToAdd,
  ]);
}

  setExpenseTitle("");
  setExpenseAmount("");
};

const deleteExpense = async (
  id: number
) => {

  const { error } =
    await supabase
      .from("expenses")
      .delete()
      .eq("id", id);

  console.log(error);

  if (!error) {

    setExpenses(
      expenses.filter(
        (expense) =>
          expense.id !== id
      )
    );
  }
};



const startEditExpense = (
  expense: any
) => {

  setEditingExpense(
  expense.id
);

  setEditedTitle(
    expense.title
  );

  setEditedAmount(
    expense.amount.toString()
  );
};

const saveExpenseEdit = async (
  id: number
) => {

  const { data, error } =
    await supabase
      .from("expenses")
      .update({
        title: editedTitle,
        amount: Number(
          editedAmount
        ),
      })
      .eq("id", id)
      .select();

  console.log(error);

  if (data) {

    setExpenses(
      expenses.map((expense) => {

        if (expense.id === id) {

          return {
            ...expense,
            ...data[0],
            createdAt: new Date(
              data[0].created_at + "Z"
            ),
          };
        }

        return expense;
      })
    );
  }

  setEditingExpense(null);

  setEditedTitle("");

  setEditedAmount("");
};

const cancelExpenseEdit = () => {

  setEditingExpense(null);

  setEditedTitle("");

  setEditedAmount("");
};

const addContribution = async () => {

  if (
    !selectedMember ||
    !contributionAmount
  ) {
    return;
  }

  const member =
    members.find(
      (m) =>
        m.name === selectedMember
    );

  if (!member) {
    return;
  }

  const newDeposited =
    member.deposited +
    Number(contributionAmount);
  
  
  const { data, error } =
    await supabase
      .from("members")
      .update({
        deposited: newDeposited,
      })
      .eq("id", member.id)
      .select();
  

  if (data) {

    setMembers(
      members.map((m) => {

        if (m.id === member.id) {
          return data[0];
        }

        return m;
      })
    );
  }

  setSelectedMember("");
  setContributionAmount("");
};

  const addMember = async () => {

  if (!memberName) {
    return;
  }

  const newMember = {
    name: memberName,
    shares: Number(memberShares || 1),
    deposited: 0,
  };
const {
  data,
  error,
} =
  await supabase
    .from("members")
    .insert([newMember])
    .select();



if (data) {

  setMembers([
    ...members,
    data[0],
  ]);
}

setMemberName("");
setMemberShares("");
};
  

const deleteMember = async (
  memberName: string
) => {

  const member =
    members.find(
      (m) =>
        m.name === memberName
    );

  if (!member) {
    return;
  }

  if (member.deposited > 0) {

    alert(
      "Cannot remove participant with contributions"
    );

    return;
  }

  const confirmed =
    window.confirm(
      "Remove this participant?"
    );

  if (!confirmed) {
    return;
  }

  const { error } =
    await supabase
      .from("members")
      .delete()
      .eq("id", member.id);

  console.log(error);

  if (!error) {

    setMembers(
      members.filter(
        (m) =>
          m.id !== member.id
      )
    );
  }
};
    

    

  const totalDeposited = members.reduce(
    (sum, member) => sum + member.deposited,
    0
  );

  const totalSpent = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const remainingFund =
    totalDeposited - totalSpent;
  const totalMembers = members.reduce(
  (sum, member) =>
    sum + member.shares,
  0
);
  const totalShares = members.reduce(
    (sum, member) => sum + member.shares,
    0
  );

  const perShareExpense =
  totalShares > 0
    ? totalSpent / totalShares
    : 0;
  const creditors = members
  .map((member) => {

    const expected =
      member.shares *
      perShareExpense;

    const balance =
      member.deposited -
      expected;

    return {
      name: member.name,
      balance,
    };
  })
  .filter(
    (member) => member.balance > 0
  );

 const debtors = members
  .map((member) => {

    const expected =
      member.shares *
      perShareExpense;

    const balance =
      member.deposited -
      expected;

    return {
      name: member.name,
      balance,
    };
  })
  .filter(
    (member) => member.balance < 0
  );  

  const groupedExpenses =
  expenses.reduce(
    (groups, expense) => {

      const dateKey =
        expense.createdAt.toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        );

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(expense);

      return groups;

    },
    {} as Record<string, any[]>
  );

  const todayKey =
  new Date().toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
  
  const settlements: {
  from: string;
  to: string;
  amount: number;
}[] = [];

const creditorCopy =
  [...creditors];

const debtorCopy =
  [...debtors];

debtorCopy.forEach((debtor) => {

  let remainingDebt =
    Math.abs(debtor.balance);

  creditorCopy.forEach((creditor) => {

    if (
      remainingDebt === 0 ||
      creditor.balance === 0
    ) {
      return;
    }

    const settlementAmount =
      Math.min(
        remainingDebt,
        creditor.balance
      );

    settlements.push({
      from: debtor.name,
      to: creditor.name,
      amount: settlementAmount,
    });

    remainingDebt -=
      settlementAmount;

    creditor.balance -=
      settlementAmount;
  });
});

  return (
    <main className="min-h-screen bg-gray-100 text-black p-6">

      <div className="max-w-md mx-auto space-y-6 text-black">

        <div className="space-y-3 sticky top-0 z-10 bg-gray-100 pb-3">

  <input
    type="text"
    placeholder="Enter trip name"
    value={tripName}
    onChange={(e) =>
      setTripName(
        e.target.value
      )
    }
   className="w-full text-3xl font-bold bg-transparent outline-none truncate"
  />

  <div className="flex gap-3">

    <input
      type="date"
      value={tripStartDate}
      onChange={(e) =>
        setTripStartDate(
          e.target.value
        )
      }
      className="border rounded-xl p-2"
    />

    <input
      type="date"
      value={tripEndDate}
      onChange={(e) =>
        setTripEndDate(
          e.target.value
        )
      }
      className="border rounded-xl p-2"
    />

  </div>
  <div className="flex gap-3">

  <div
    className={`px-4 py-2 rounded-xl text-white font-medium ${
      tripEnded
        ? "bg-gray-600"
        : "bg-green-600"
    }`}
  >
    {tripEnded
      ? "Trip Ended"
      : "Trip Active"}
  </div>

  <button
    onClick={() => {

      if (!tripEnded) {

        const confirmed =
          window.confirm(
            "End this trip?"
          );

        if (confirmed) {
          setTripEnded(true);
        }

      } else {

        const confirmed =
          window.confirm(
            "Reopen this trip?"
          );

        if (confirmed) {
          setTripEnded(false);
        }

      }

    }}
    className="bg-black text-white px-4 py-2 rounded-xl"
  >
    {tripEnded
      ? "Reopen Trip"
      : "End Trip"}
  </button>

</div>

</div>

        <section className="bg-white rounded-2xl p-4 shadow">

          <button
            onClick={() =>
              setShowParticipants(
                !showParticipants
              )
            }
            className="w-full flex justify-between items-center"
          >
            <div className="text-left">

  <h2 className="text-xl font-semibold">
    Participants
  </h2>

  <p className="text-sm text-gray-500">
    Total Members: {totalMembers}
  </p>

</div>

            <div className="flex items-center gap-3">

  

  <span className="text-2xl">
    {showParticipants ? "−" : "+"}
  </span>

</div>
          </button>

          {showParticipants && (

            <>
              

              <div className="space-y-2">
                

                {members.map((member) => (

                  <div
  key={member.name}
  className="flex justify-between items-center"
>
                    <div>

  <p>
    {member.name}
  </p>

  <p className="text-sm text-gray-500">
    Covers {member.shares} people
  </p>

</div>

<button
  onClick={() =>
    deleteMember(
      member.name
    )
  }
  className="text-red-500 text-lg"
>
  ✕
</button>
                  </div>

                ))}

              </div>

            <div className="space-y-3 mt-6">


               <input
                 type="text"
                 placeholder="Participant Name"
                 value={memberName}
                 onChange={(e) =>
                   setMemberName(
                     e.target.value
                   )
                 }
                 className="w-full border rounded-xl p-3"
               />


               <input
                 type="number"
                 placeholder="How many people paying for"
                 value={memberShares}
                 onChange={(e) =>
                   setMemberShares(
                     e.target.value
                   )
                 }
                 className="w-full border rounded-xl p-3"
               />


               <button
                 onClick={addMember}
                 className="w-full bg-blue-600 text-white rounded-xl p-3 font-medium"
               >
                 Add Participant
               </button>


             </div>

  
            </>

          )}

        </section>

        <section className="bg-white rounded-2xl p-4 shadow">

          <h2 className="text-xl font-semibold mb-4">
            Fund Summary
          </h2>

          <div className="space-y-4">

  <div>
    <p className="text-sm text-gray-500">
      Total Deposited
    </p>

    <p className="text-2xl font-bold">
      ₹{totalDeposited.toLocaleString("en-IN")}
    </p>
  </div>

  <div>
    <p className="text-sm text-gray-500">
      Total Spent
    </p>

    <p className="text-2xl font-bold">
      ₹{totalSpent.toLocaleString("en-IN")}
    </p>
  </div>

  <div>
    <p className="text-sm text-gray-500">
      Remaining Fund
    </p>

    <p
      className={`text-2xl font-bold ${
        remainingFund >= 0
          ? "text-green-600"
          : "text-red-600"
      }`}
    >
      ₹{remainingFund.toLocaleString("en-IN")}
    </p>
  </div>

  <div className="bg-black text-white rounded-2xl p-4">

    <p className="text-sm opacity-80">
      Per Head Expense
    </p>

    <p className="text-4xl font-bold mt-1">
      ₹{perShareExpense
        .toFixed(0)
        .toLocaleString()}
    </p>

  </div>

</div>

        </section>

        <section className="bg-white rounded-2xl p-4 shadow">

          <button
            onClick={() =>
              setShowContributions(
                !showContributions
              )
            }
            className="w-full flex justify-between items-center"
          >
            <h2 className="text-xl font-semibold">
              Add Contribution
            </h2>

            <div className="flex items-center gap-3">

  <p className="text-sm text-gray-500">
    ₹{totalDeposited.toLocaleString("en-IN")}
  </p>

  <span className="text-2xl">
    {showContributions ? "−" : "+"}
  </span>

</div>
          </button>

          {showContributions && (

            <div className="space-y-3 mt-4">

              <select
                value={selectedMember}
                onChange={(e) =>
                  setSelectedMember(
                    e.target.value
                  )
                }
                className="w-full border rounded-xl p-3"
              >

                <option value="">
                  Select Member
                </option>

                {members.map((member) => (

                  <option
                    key={member.name}
                    value={member.name}
                  >
                    {member.name}
                  </option>

                ))}

              </select>

              <input
                type="number"
                placeholder="Contribution Amount"
                value={contributionAmount}
                onChange={(e) =>
                  setContributionAmount(
                    e.target.value
                  )
                }
                className="w-full border rounded-xl p-3"
              />

              <button
                onClick={addContribution}
                className="w-full bg-green-600 text-white rounded-xl p-3 font-medium"
              >
                Add Contribution
              </button>

            </div>

          )}

        </section>

        <section className="bg-white rounded-2xl p-4 shadow">

          <button
            onClick={() =>
              setShowExpenses(
                !showExpenses
              )
            }
            className="w-full flex justify-between items-center"
          >
            <div>
          <h2 className="text-xl font-semibold">
            Expenses
          </h2>

          <p className="text-sm text-gray-500">
            {expenses.length} expenses
          </p>
          </div>

            <div className="flex items-center gap-3">

  <p className="text-sm text-gray-500">
    ₹{totalSpent.toLocaleString("en-IN")}
  </p>

  <span className="text-2xl">
    {showExpenses ? "−" : "+"}
  </span>

</div>
          </button>

          {showExpenses && (

            <>
              <div className="space-y-3 mb-6 mt-4">

                <input
                  type="text"
                  placeholder="Expense Title"
                  value={expenseTitle}
                  onChange={(e) =>
                    setExpenseTitle(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-xl p-3"
                />

                <input
                  type="number"
                  placeholder="Amount"
                  value={expenseAmount}
                  onChange={(e) =>
                    setExpenseAmount(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-xl p-3"
                />

                <button
                  onClick={addExpense}
                  className="w-full bg-black text-white rounded-xl p-3 font-medium"
                >
                  Add Expense
                </button>

              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">

                {Object.entries(groupedExpenses).map(
  ([date, expensesForDate]: [
  string,
  any[]
]) => {

    const totalForDate =
      expensesForDate.reduce(
        (sum, expense) =>
          sum + expense.amount,
        0
      );

    const isExpanded =
  expandedDates[date] ??
  date === todayKey;

    return (

      <div
        key={date}
        className="border rounded-xl overflow-hidden"
      >

        <button
          onClick={() =>
            setExpandedDates({
              ...expandedDates,
              [date]:
                !isExpanded,
            })
          }
          className="w-full flex justify-between items-center p-3 bg-gray-50"
        >

          <div className="text-left">

            <p className="font-semibold">
              {date}
            </p>

            <p className="text-sm text-gray-500">
              ₹{totalForDate.toLocaleString(
                "en-IN"
              )}
            </p>

          </div>

          <span className="text-xl">
            {isExpanded
              ? "−"
              : "+"}
          </span>

        </button>

        {isExpanded && (

          <div className="px-3">

            {expensesForDate.map(
              (expense) => (

                <div
                  key={expense.id}
                  className="flex justify-between items-start border-b py-2"
                >

                  {editingExpense === expense.id ? (

                    <div className="w-full space-y-3">

                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) =>
                          setEditedTitle(
                            e.target.value
                          )
                        }
                        className="w-full border rounded-xl p-2"
                      />

                      <input
                        type="number"
                        value={editedAmount}
                        onChange={(e) =>
                          setEditedAmount(
                            e.target.value
                          )
                        }
                        className="w-full border rounded-xl p-2"
                      />

                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            saveExpenseEdit(
                              expense.id
                            )
                          }
                          className="bg-blue-600 text-white px-3 py-2 rounded-lg"
                        >
                          Save
                        </button>

                        <button
                          onClick={
                            cancelExpenseEdit
                          }
                          className="bg-gray-300 px-3 py-2 rounded-lg"
                        >
                          Cancel
                        </button>

                      </div>

                    </div>

                  ) : (

                    <>
                      <div>

                        <p className="text-base font-semibold">
                          ₹{expense.amount.toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        <p className="text-sm font-medium">
                          {expense.title}
                        </p>

                        <p className="text-[11px] text-gray-400">
                          {expense.createdAt.toLocaleString(
                            "en-IN",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )}
                        </p>

                      </div>

                      <div className="flex items-center gap-2 pt-1">

                        <button
                          onClick={() =>
                            startEditExpense(
                              expense
                            )
                          }
                          className="text-blue-600"
                        >
                          ✏️
                        </button>

                        <button
                          onClick={() => {

                            const confirmed =
                              window.confirm(
                                "Delete this expense?"
                              );

                            if (confirmed) {
                              deleteExpense(
                                expense.id
                              );
                            }

                          }}
                          className="text-red-500"
                        >
                          ✕
                        </button>

                      </div>
                    </>

                  )}

                </div>

              )
            )}

          </div>

        )}

      </div>

    );
  }
)}

              </div>
            </>

          )}

        </section>

       {tripEnded && (
         <section className="bg-white rounded-2xl p-4 shadow">

  <h2 className="text-xl font-semibold mb-4">
    Settlement Summary
  </h2>

  <div className="space-y-3">

    {settlements.length === 0 ? (

      <p className="text-green-600">
        All settled 🎉
      </p>

    ) : (

      settlements.map(
        (settlement, index) => (

          <div
            key={index}
            className="border rounded-xl p-3"
          >

            <p>
              <span className="font-semibold">
                {settlement.from}
              </span>

              {" pays "}

              <span className="font-semibold">
                {settlement.to}
              </span>

              {" ₹"}

              {settlement.amount.toFixed(0)}
            </p>

          </div>

        )
      )

    )}

  </div>

</section> )}

            <section className="bg-white rounded-2xl p-4 shadow">

  <button
    onClick={() =>
      setShowStatus(
        !showStatus
      )
    }
    className="w-full flex justify-between items-center"
  >

    <h2 className="text-xl font-semibold">
      Contribution Status
    </h2>

    <div className="flex items-center gap-3">

  <p className="text-sm text-gray-500">
    {totalMembers} people
  </p>

  <span className="text-2xl">
    {showStatus ? "−" : "+"}
  </span>

</div>

  </button>

  {showStatus && (

    <div className="space-y-4 mt-4">

      {members.map((member) => {

        const expected =
          member.shares *
          perShareExpense;

        const balance =
          member.deposited -
          expected;

        return (

          <div
  key={member.name}
  className={`rounded-2xl p-4 border ${
    balance >= 0
      ? "bg-green-50 border-green-200"
      : "bg-red-50 border-red-200"
  }`}
>

            <div className="flex justify-between items-start">

  <div>
    <h3 className="font-semibold text-xl">
      {member.name}
    </h3>

    <p className="text-sm text-gray-500">
      Covers {member.shares} people
    </p>
  </div>

  <div
    className={`text-right ${
      balance >= 0
        ? "text-green-700"
        : "text-red-700"
    }`}
  >

    <p className="text-sm font-medium">
      {balance >= 0
        ? "Ahead"
        : "Needs"}
    </p>

    <p className="text-2xl font-bold">
      ₹{Math.abs(balance)
        .toFixed(0)
        .toLocaleString()}
    </p>

  </div>

</div>

            <div className="flex justify-between mt-4 text-sm">

  <div>
    <p className="text-gray-500">
      Expected
    </p>

    <p className="font-semibold">
      ₹{expected
        .toFixed(0)
        .toLocaleString()}
    </p>
  </div>

  <div className="text-right">
    <p className="text-gray-500">
      Paid
    </p>

    <p className="font-semibold">
      ₹{member.deposited
        .toLocaleString("en-IN")}
    </p>
  </div>

</div>

            

          </div>

        );
      })}

    </div>

  )}

</section>

      </div>

    </main>
  );
}