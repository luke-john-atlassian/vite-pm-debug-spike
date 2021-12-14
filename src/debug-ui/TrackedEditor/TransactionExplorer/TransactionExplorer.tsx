import { useState } from "react";
import { TrackedEditor } from "../../../backend/backend";

import { TransactionList } from "./TransactionList";
import { TransactionOverview } from "./TransactionOverview";

export function TransactionExplorer({
  transactions,
}: {
  transactions: TrackedEditor["transactionHistory"];
}) {
  const [selectedTransactionIndex, setSelectedTransactionIndex] = useState(0);

  return (
    <div>
      <h2>Tracked UI</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "stretch",
        }}
      >
        <div>
          <TransactionList
            transactions={transactions}
            selectedTransactionIndex={selectedTransactionIndex}
            selectTransactionIndex={(transactionIndex: number) => {
              setSelectedTransactionIndex(transactionIndex);
            }}
          />
        </div>
        <div style={{ flexGrow: 1 }}>
          <TransactionOverview
            transaction={transactions[selectedTransactionIndex]}
          />
        </div>
      </div>
    </div>
  );
}
