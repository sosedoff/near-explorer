import React from "react";

import TransactionsApi, * as T from "../../libraries/explorer-wamp/transactions";

import FlipMove from "../utils/FlipMove";
import autoRefreshHandler from "../utils/autoRefreshHandler";

import TransactionAction from "./TransactionAction";

export interface OuterProps {
  accountId?: string;
  blockHash?: string;
  count: number;
}

export default class extends React.Component<OuterProps> {
  static defaultProps = {
    count: 15,
  };

  fetchTransactions = async (count: number, paginationIndexer?: number) => {
    return await new TransactionsApi().getTransactions({
      signerId: this.props.accountId,
      receiverId: this.props.accountId,
      blockHash: this.props.blockHash,
      limit: count,
      paginationIndexer: paginationIndexer,
    });
  };

  config = {
    fetchDataFn: this.fetchTransactions,
    count: this.props.count,
    category: "Transaction",
  };

  autoRefreshTransactions = autoRefreshHandler(Transactions, this.config);

  render() {
    return <this.autoRefreshTransactions />;
  }
}

interface InnerProps extends OuterProps {
  items: T.Transaction[];
}

class Transactions extends React.Component<InnerProps> {
  render() {
    const { items } = this.props;
    return (
      <FlipMove duration={1000} staggerDurationBy={0}>
        {items &&
          items.map((transaction) => (
            <TransactionAction
              key={transaction.hash}
              actions={transaction.actions}
              transaction={transaction}
            />
          ))}
      </FlipMove>
    );
  }
}
