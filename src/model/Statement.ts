enum type {
  credit,
  debit,
}

export interface IStatement {
  description?: string;
  amount: number;
  created_at: Date;
  type: type;
}
