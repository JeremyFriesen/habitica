import mongoose from 'mongoose';
import logger from './logger';
import { emitExcluding } from './socket';
import { getRecentWriterSocketIds } from './recentWriters';

export function startChangeStream () {
  const db = mongoose.connection.db;
  const changeStream = db.watch([], { fullDocument: 'updateLookup' });

  let debounceTimer = null;

  changeStream.on('change', change => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const excludeSocketIds = getRecentWriterSocketIds();
      logger.info(`db:change emitting — excluding sockets: ${[...excludeSocketIds].join(', ') || 'none'}`);
      emitExcluding('db:change', {
        operationType: change.operationType,
        ns: change.ns,
      }, excludeSocketIds);
    }, 1000);
  });

  changeStream.on('error', err => {
    logger.error('Change stream error', err);
  });

  logger.info('MongoDB change stream started');
}
