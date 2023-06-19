import { Controller, Get } from '@nestjs/common';
import { historyMonitor } from 'src/main';

@Controller('monitor')
export class MonitorController {
  @Get('/')
  getAll() {
    const failedJobs = historyMonitor.getAllFailedJobs();
    if (!failedJobs) {
      return 'no failed jobs :)';
    }
    return failedJobs;
  }
}
