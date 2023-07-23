import { Request, Response, NextFunction } from 'express';
import { JoiRequestValidationError } from '@global/helpers/error-handler';
import { ObjectSchema } from 'joi';

type IJoiDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => void;

export function joiValidation(schema: ObjectSchema): IJoiDecorator {
  return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      const { error } = await Promise.resolve(schema.validate(req.body));
      if (error?.details) {
        return next(new JoiRequestValidationError(error.details[0].message));
      }
      return originalMethod.apply(this, [req, res, next]);
    };
    return descriptor;
  };
}