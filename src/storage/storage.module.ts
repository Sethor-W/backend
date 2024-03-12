import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageProvider } from './storage.provider';

@Module({
  providers: [StorageService, StorageProvider],
  exports: [StorageService, StorageProvider],
})
export class StorageModule {}
