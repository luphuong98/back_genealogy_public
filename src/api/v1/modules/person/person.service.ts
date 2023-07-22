import { Inject, Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from '../../services/base/base.abstract.service';
import { Person } from '../../entities/person.entity';
import { PersonRepositoryInterface } from './interfaces/person.interface';
import { CreatePersonDto } from './dtos/create-person.dto';

@Injectable()
export class PersonService extends BaseServiceAbstract<Person> {
  constructor(
    @Inject('PersonRepositoryInterface')
    private readonly person_repository: PersonRepositoryInterface,
  ) {
    super(person_repository);
  }

  async createNewPerson(
    create_dto: CreatePersonDto,
    parent_id?: string,
  ): Promise<Person> {
    if (!parent_id) {
      const newPerson = this.person_repository.create(create_dto);
      return newPerson;
    }
    const parentNode = await this.person_repository.findOneByCondition({
      id: parent_id,
    });

    if (!parentNode) {
      return null;
    }

    const newPerson = this.person_repository.create({
      ...create_dto,
      parent: parentNode._id,
      ancestors: parentNode.ancestors.concat(parentNode),
    });
    return newPerson;
  }
}
