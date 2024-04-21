import { Module } from '@nestjs/common';
import { TaskService } from './tasks.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [EmailModule],
  providers: [TaskService],
})
export class TasksModule {}
