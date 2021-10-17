import { NextFunction, Request, Response } from 'express';
import { customers } from '../infra/database/customersMock';
import { ICustomer } from '../model/Customer';

export const verifyIfExistsAccountByCPF = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cpf } = req.headers;

  const customer = customers.find(
    (customer: ICustomer) => customer.cpf === cpf
  );

  if (!customer) {
    return res.status(404).json({
      message: "Client don't exists!",
    });
  }

  req.customer = customer;

  next();
};
