import {
  HttpException,
  HttpStatus,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';

const validationOptions: ValidationPipeOptions = {
  transform: true, // This tells the ValidationPipe to transform the payload into a DTO instance
  whitelist: true, // This tells the ValidationPipe to strip away any properties that do not have any decorators
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, // This tells the ValidationPipe to throw an exception if validation fails
  exceptionFactory: (errors: ValidationError[]) =>
    new HttpException(
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: errors.reduce(
          (accumulator, currentValue) => ({
            ...accumulator,
            [currentValue.property]: Object.values(
              currentValue.constraints ?? {},
            ).join(', '),
          }),
          {},
        ),
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    ),
};

export default validationOptions;
