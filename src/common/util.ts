import { v5 } from 'uuid';
import { NoMoreJobException } from './exception';

export const uuidTransformer = {
  to: (uuid: string | undefined) => uuid ? Buffer.from(uuid.replace(/-/g, ''), 'hex') : uuid,
  from: (bin: Buffer) => `${bin.toString('hex', 0, 4)}-${bin.toString('hex', 4, 6)}-${bin.toString('hex', 6, 8)}-${bin.toString('hex', 8, 10)}-${bin.toString('hex', 10, 16)}`,
};

export const createUUID = (name: string) => v5(name, process.env.NAMESPACE_UUID);

export const getDateForDb = () => new Date().toISOString().replace(/T|Z/g, ' ').slice(0, -5);

// [TODO] needs to connect with prometheus
// [TODO] will it needs dependency?
export class HistoryMonitor {
  // [TODO] type-safe logic needed
  private failedJob: Record<string, undefined>[];

  insertFailedJob(record: Record<string, undefined>) {
    this.failedJob.push(record);
  }

  getFailedJobs() {
    if (this.failedJob.length > 0) {
      return this.failedJob[0];
    }
    throw new NoMoreJobException();
  }
}
