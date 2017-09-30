import Dexie from 'dexie';

const db = new Dexie('FortransDb');

db.version(1).stores({
    lines: `&numero, nome, numeroNome, tipoLinha`,
    schedules: `++id, [lineNumber+date], tables`,
});

export default db;
