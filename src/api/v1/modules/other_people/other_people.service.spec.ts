import { Test, TestingModule } from '@nestjs/testing';
import { OtherPeopleService } from './other_people.service';

describe('OtherPeopleService', () => {
  let service: OtherPeopleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtherPeopleService],
    }).compile();

    service = module.get<OtherPeopleService>(OtherPeopleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
