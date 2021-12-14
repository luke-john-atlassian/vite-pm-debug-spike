import { Fragment } from "react";

import { TrackedEditor } from "../../../backend/backend";

export function TransactionOverview({
  transaction,
}: {
  transaction: TrackedEditor["transactionHistory"][number];
}) {
  return (
    <Fragment>
      <h3>Transaction Overview</h3>
      <pre>
        <code>{JSON.stringify(transaction, null, 4)}</code>
      </pre>
    </Fragment>
  );
}
