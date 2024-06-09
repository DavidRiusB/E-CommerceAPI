import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

// Custom decorator to validate precision and scale of a decimal number
export function IsDecimalWithPrecision(
  precision: number,
  scale: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDecimalWithPrecision',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [precision, scale],
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'number') return false;
          const [precision, scale] = args.constraints;
          const regex = new RegExp(
            `^\\d{1,${precision - scale}}(\\.\\d{1,${scale}})?$`,
          );
          return regex.test(value.toString());
        },
        defaultMessage(args: ValidationArguments) {
          const [precision, scale] = args.constraints;
          return `The value must be a decimal number with a maximum of ${precision} digits and ${scale} decimal places.`;
        },
      },
    });
  };
}
