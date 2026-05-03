import { Test, TestingModule } from '@nestjs/testing';
import { ProvisioningService } from './provisioning.service';

describe('ProvisioningService', () => {
  let service: ProvisioningService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProvisioningService],
    }).compile();

    service = module.get<ProvisioningService>(ProvisioningService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
