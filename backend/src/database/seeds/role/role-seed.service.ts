import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/users/roles/entities/role.entity';
import { RolesEnum } from 'src/users/roles/roles.enum';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(Role)
    private repository: Repository<Role>,
  ) {}

  async run() {
    const countAdmin = await this.repository.count({
      where: { id: RolesEnum.admin },
    });
    if (!countAdmin) {
      await this.repository.save(
        this.repository.create({
          id: RolesEnum.admin,
          role: RolesEnum[RolesEnum.admin],
        }),
      );
    }

    const countStore = await this.repository.count({
      where: { id: RolesEnum.store },
    });
    if (!countStore) {
      await this.repository.save(
        this.repository.create({
          id: RolesEnum.store,
          role: RolesEnum[RolesEnum.store],
        }),
      );
    }

    const countCustomer = await this.repository.count({
      where: { id: RolesEnum.customer },
    });
    if (!countCustomer) {
      await this.repository.save(
        this.repository.create({
          id: RolesEnum.customer,
          role: RolesEnum[RolesEnum.customer],
        }),
      );
    }

    const countUnapproved = await this.repository.count({
      where: { id: RolesEnum.unapprovedStore },
    });
    if (!countUnapproved) {
      await this.repository.save(
        this.repository.create({
          id: RolesEnum.unapprovedStore,
          role: RolesEnum[RolesEnum.unapprovedStore],
        }),
      );
    }

    const countUnconfirmed = await this.repository.count({
      where: { id: RolesEnum.unconfirmed },
    });
    if (!countUnconfirmed) {
      await this.repository.save(
        this.repository.create({
          id: RolesEnum.unconfirmed,
          role: RolesEnum[RolesEnum.unconfirmed],
        }),
      );
    }

    const countGuest = await this.repository.count({
      where: { id: RolesEnum.guest },
    });
    if (!countGuest) {
      await this.repository.save(
        this.repository.create({
          id: RolesEnum.guest,
          role: RolesEnum[RolesEnum.guest],
        }),
      );
    }
  }
}
