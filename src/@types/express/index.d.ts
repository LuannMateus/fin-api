interface IStatement {
  description?: string;
  amount: number;
  created_at: Date;
  type: type;
}

interface ICustomer {
  cpf: string;
  name: string;
  id: string;
  statement: IStatement[];
}

declare namespace Express {
  export interface Request {
    customer?: ICustomer;
  }
}
