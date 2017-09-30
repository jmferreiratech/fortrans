import Dexie from 'dexie';

const dbVersion = 1;

const db = new Dexie('FortransDb');
db.version(dbVersion).stores({
    lines: `&numero, nome, numeroNome, tipoLinha`,
});

export default db;
