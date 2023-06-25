import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { isValid } from '@cospired/i18n-iso-languages';

// * This is a custom validator that checks if the language code is a valid ISO 639-1 code
@Injectable()
@ValidatorConstraint({ name: 'IsISO6391', async: false })
export class IsISO6391Constraint implements ValidatorConstraintInterface {
  validate(code: string) {
    return Boolean(isValid(code));
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `Language code ${args.value} is not valid!`;
  }
}

export function IsISO6391(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsISO6391Constraint,
    });
  };
}
