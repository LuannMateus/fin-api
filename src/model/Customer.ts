import { IStatement } from './Statement';

export interface ICustomer {
  cpf: string;
  name: string;
  id: string;
  statement: IStatement[];
}
