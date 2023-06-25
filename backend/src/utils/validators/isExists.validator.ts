import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { Injectable } from '@nestjs/common';

// * This is a custom validator that checks if the specified entity exists within the specified repository
@Injectable()
@ValidatorConstraint({ name: 'IsExist', async: true })
export class IsExistConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments) {
    const repository = validationArguments.constraints[0] as string;
    const property = validationArguments.constraints[1] as string | number;
    const entity: unknown = await this.dataSource
      .getRepository(repository)
      .findOne({
        where: {
          [property ? property : validationArguments.property]: property
            ? value?.[property]
            : value,
        },
      });

    return Boolean(entity);
  }

  defaultMessage(args: ValidationArguments) {
    const repository = args.constraints[0] as string;
    const property = args.constraints[1] as string | number;
    return `Table '${repository}' doesn't contain a '${property}' with the value '${args.value}'`;
  }
}

export function IsExists(
  repository: string,
  property?: string | number,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [repository, property],
      validator: IsExistConstraint,
    });
  };
}
