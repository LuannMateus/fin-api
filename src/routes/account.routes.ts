import { Request, Response, NextFunction, Router } from 'express';
import { v4 as uuid } from 'uuid';

const AccountRouter = Router();

interface Customers {
  cpf: string;
  name: string;
  id: string;
  statement: string[];
}

const customers = [] as Customers[];

AccountRouter.post(
  '/accounts',
  (req: Request, res: Response, next: NextFunction) => {
    const { cpf, name } = req.body;

    const id = uuid();

    customers.push({
      cpf,
      name,
      id,
      statement: [],
    });

    return res.send(customers);
  }
);

export { AccountRouter };
