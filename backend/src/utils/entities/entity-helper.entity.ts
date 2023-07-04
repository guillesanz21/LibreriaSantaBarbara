import { instanceToPlain } from 'class-transformer';
import { BaseEntity } from 'typeorm';

export class EntityHelper extends BaseEntity {
  // __entity?: string;

  // @AfterLoad()
  // setEntityName() {
  //   this.__entity = this.constructor.name;
  // }

  toJSON() {
    return instanceToPlain(this);
  }
}
