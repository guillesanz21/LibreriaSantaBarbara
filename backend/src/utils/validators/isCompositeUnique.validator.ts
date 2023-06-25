import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { DataSource } from 'typeorm';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

type ValidationEntity =
  | {
      id?: number | string;
    }
  | undefined;

// * This is a custom validator that checks if the value is unique in the database table
@Injectable()
@ValidatorConstraint({ name: 'IsCompositeUnique', async: true })
export class IsCompositeUniqueConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments) {
    const repository = validationArguments.constraints[0] as string; // The repository name
    // One of the properties to check for uniqueness
    const uniquePropertyNumber1 = validationArguments.property as
      | string
      | number;
    // The other property to check for uniqueness
    const uniquePropertyNumber2 = validationArguments.constraints[1] as
      | string
      | number;
    const currentObject = validationArguments.object as ValidationEntity; // The current object being validated
    const entity = (await this.dataSource.getRepository(repository).findOne({
      where: {
        [uniquePropertyNumber1]: value,
        [uniquePropertyNumber2]: currentObject[uniquePropertyNumber2],
      },
    })) as ValidationEntity;

    if (entity?.id === currentObject?.id) {
      return true;
    }

    return !entity;
  }

  defaultMessage(args: ValidationArguments) {
    const repository = args.constraints[0] as string;
    const uniquePropertyNumber2 = args.constraints[1] as string | number;
    return `Table '${repository}' already has a composite unique value ('${args.property}', '${uniquePropertyNumber2})' with the values provided`;
  }
}

export function IsCompositeUnique(
  repository: string,
  uniquePropertyNumber2: string | number,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [repository, uniquePropertyNumber2],
      validator: IsCompositeUniqueConstraint,
    });
  };
}
