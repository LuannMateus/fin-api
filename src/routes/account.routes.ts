import { Request, Response, NextFunction, Router } from 'express';
import { v4 as uuid } from 'uuid';
import { customers } from '../infra/database/customersMock';
import { verifyIfExistsAccountByCPF } from '../middlewares';

const getBalance = (statement: IStatement[]): number => {
  const balance = statement.reduce((acc, act) => {
    if (act.type === 'credit') {
      return acc + act.amount;
    } else {
      return acc - act.amount;
    }
  }, 0);

  return balance;
};

const AccountRouter = Router();

AccountRouter.get(
  '/accounts/balance',
  verifyIfExistsAccountByCPF,
  (req: Request, res: Response, next: NextFunction) => {
    const { customer } = req;

    const balance = getBalance(customer!.statement);

    return res.status(200).json({
      balance,
    });
  }
);

AccountRouter.get(
  '/accounts/:cpf',
  (req: Request, res: Response, next: NextFunction) => {
    const { cpf } = req.params;

    const customer = customers.find((customer) => customer.cpf === cpf);

    if (!customer)
      return res.status(404).json({ message: 'Customer not found!' });

    return res.status(200).json(customer);
  }
);

AccountRouter.post(
  '/accounts',
  (req: Request, res: Response, next: NextFunction) => {
    const { cpf, name } = req.body;

    const isCustomerExists = customers.some((customer) => customer.cpf === cpf);

    if (isCustomerExists)
      return res.status(400).json({ message: 'Customer already exists!' });

    const id = uuid();

    customers.push({
      cpf,
      name,
      id,
      statement: [],
    });

    return res.status(201).json(customers);
  }
);

AccountRouter.put(
  '/accounts',
  verifyIfExistsAccountByCPF,
  (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;

    const { customer } = req;

    customer!.name = name;

    return res.status(200).json(customer);
  }
);

AccountRouter.post(
  '/deposit',
  verifyIfExistsAccountByCPF,
  (req: Request, res: Response, next: NextFunction) => {
    const { description, amount, transactionType } = req.body;

    const { customer } = req;

    const statementOperation = {
      description,
      amount,
      created_at: new Date(),
      type: 'credit',
    };

    customer?.statement.push(statementOperation);

    res.status(201).json(statementOperation);
  }
);

AccountRouter.post(
  '/withdraw',
  verifyIfExistsAccountByCPF,
  (req: Request, res: Response, next: NextFunction) => {
    const { amount } = req.body;

    const { customer } = req;

    const balance = getBalance(customer?.statement || []);

    if (balance < amount) {
      return res.status(400).json({
        message: 'Insufficient funds!',
      });
    }

    const statementOperation = {
      amount,
      created_at: new Date(),
      type: 'debit',
    };

    customer?.statement.push(statementOperation);

    res.status(201).json(statementOperation);
  }
);

AccountRouter.get(
  '/statements',
  verifyIfExistsAccountByCPF,
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json(req.customer);
  }
);

AccountRouter.get(
  '/statements/date',
  verifyIfExistsAccountByCPF,
  (req: Request, res: Response, next: NextFunction) => {
    const { customer } = req;

    const { date } = req.query;

    const dateFormat = new Date(date + ' 00:00');

    const statement = customer?.statement.filter(
      (statement) =>
        statement.created_at.toDateString() ===
        new Date(dateFormat).toDateString()
    );

    return res.status(200).json(statement);
  }
);

AccountRouter.delete(
  '/accounts',
  verifyIfExistsAccountByCPF,
  (req: Request, res: Response, next: NextFunction) => {
    const { customer } = req;

    customers.forEach((item, index) => {
      if (item === customer) {
        customers.splice(index, 1);
      }
    });

    return res.status(204).end();
  }
);

export { AccountRouter };
