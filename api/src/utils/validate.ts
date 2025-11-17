import {Request, Response, NextFunction} from 'express';
import {ContextRunner } from 'express-validator';

const validate = (validations: ContextRunner[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array({onlyFirstError: true}) });
      }
    }

    next();
  };
};
export default validate;