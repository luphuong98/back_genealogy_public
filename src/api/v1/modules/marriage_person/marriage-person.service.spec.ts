import { Test, TestingModule } from '@nestjs/testing';
import { MarriagePersonService } from './marriage-person.service';

describe('MarriagePersonService', () => {
  let service: MarriagePersonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarriagePersonService],
    }).compile();

    service = module.get<MarriagePersonService>(MarriagePersonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
