import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from 'src/books/status/entities/status.entity';
import { StatusEnum } from 'src/books/status/status.types';

@Injectable()
export class StatusSeedService {
  constructor(
    @InjectRepository(Status)
    private repository: Repository<Status>,
  ) {}

  async run() {
    const countSale = await this.repository.count({
      where: { id: StatusEnum.sale },
    });
    if (countSale === 0) {
      await this.repository.save(
        this.repository.create({
          id: StatusEnum.sale,
          status: StatusEnum[StatusEnum.sale],
        }),
      );
    }

    const countSold = await this.repository.count({
      where: { id: StatusEnum.sold },
    });
    if (countSold === 0) {
      await this.repository.save(
        this.repository.create({
          id: StatusEnum.sold,
          status: StatusEnum[StatusEnum.sold],
        }),
      );
    }

    const countReserved = await this.repository.count({
      where: { id: StatusEnum.reserved },
    });
    if (countReserved === 0) {
      await this.repository.save(
        this.repository.create({
          id: StatusEnum.reserved,
          status: StatusEnum[StatusEnum.reserved],
        }),
      );
    }
  }
}
