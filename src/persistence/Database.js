import Dexie from 'dexie';

const db = new Dexie('FortransDb');

db.version(4).stores({
    lines: `&numero, nome, numeroNome, tipoLinha, lastAccess`,
    schedules: `++id, [lineNumber+date], lineNumber, date, tables`,
});

db.version(3).stores({
    lines: `&numero, nome, numeroNome, tipoLinha, lastAccess`,
    schedules: `++id, lineNumber, date, tables`,
});

db.version(2).stores({
    lines: `&numero, nome, numeroNome, tipoLinha, lastAccess`,
    schedules: `++id, [lineNumber+date], tables`,
}).upgrade(t => {
    return t.lines.toCollection().modify(line => {
        line.lastAccess = new Date();
        return line;
    });
});

db.version(1).stores({
    lines: `&numero, nome, numeroNome, tipoLinha`,
    schedules: `++id, [lineNumber+date], tables`,
});

export default db;
