import { Fragment } from "react";
import { TrackedEditor } from "../../../backend/backend";

export function TransactionList({
  transactions,
  selectedTransactionIndex,
  selectTransactionIndex,
}: {
  transactions: TrackedEditor["transactionHistory"];
  selectedTransactionIndex: number;
  selectTransactionIndex: (transactionIndex: number) => void;
}) {
  return (
    <Fragment>
      <h3>Transaction History</h3>
      <table>
        <thead>
          <tr>
            <th>time</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => {
            return (
              <tr
                key={transaction.time}
                onClick={() => selectTransactionIndex(index)}
                aria-selected={
                  selectedTransactionIndex === index ? "true" : "false"
                }
                style={{
                  background:
                    selectedTransactionIndex === index ? "blue" : undefined,
                  color:
                    selectedTransactionIndex === index ? "white" : undefined,
                  cursor: "pointer",
                }}
              >
                <td>{transaction.time}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Fragment>
  );
}
