import { v5 } from 'uuid';

export const uuidTransformer = {
  to: (uuid: string | undefined) => uuid ? Buffer.from(uuid.replace(/-/g, ''), 'hex') : uuid,
  from: (bin: Buffer) => `${bin.toString('hex', 0, 4)}-${bin.toString('hex', 4, 6)}-${bin.toString('hex', 6, 8)}-${bin.toString('hex', 8, 10)}-${bin.toString('hex', 10, 16)}`,
};

export const createUUID = (name: string) => v5(name, process.env.NAMESPACE_UUID);

export const getDateForDb = () => new Date().toISOString().replace(/T|Z/g, ' ').slice(0, -5);
