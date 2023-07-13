export enum StatusEnum {
  sale = 1,
  sold = 2,
  reserved = 3,
}

export const StatusEnumKeys = Object.keys(StatusEnum).filter((v) =>
  isNaN(Number(v)),
);

export type StatusType = 'sale' | 'sold' | 'reserved';
