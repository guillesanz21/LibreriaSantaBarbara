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
@ValidatorConstraint({ name: 'IsUnique', async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments) {
    const repository = validationArguments.constraints[0] as string; // The repository name
    const uniqueProperty = validationArguments.property as string; // The property to check for uniqueness
    const currentObject = validationArguments.object as ValidationEntity; // The current object being validated
    const entity = (await this.dataSource.getRepository(repository).findOne({
      where: {
        [uniqueProperty]: value,
      },
    })) as ValidationEntity;

    if (entity?.id === currentObject?.id) {
      return true;
    }

    return !entity;
  }

  defaultMessage(args: ValidationArguments) {
    const repository = args.constraints[0] as string;
    return `Table '${repository}' already has an unique '${args.property}' with the value '${args.value}'`;
  }
}

export function IsUnique(
  repository: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [repository],
      validator: IsUniqueConstraint,
    });
  };
}
