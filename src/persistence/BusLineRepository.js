import db from "./Database";

class BusLineRepository {

    all() {
        return db.lines
            .orderBy("numero")
            .toArray()
            .then(lines => {
                if (lines.length)
                    return lines;
                return fetch("https://etufor-proxy.herokuapp.com/api/linhas/")
                    .then(response => {
                        if (!response.ok)
                            throw new Error(response.statusText);
                        return response.json();
                    })
                    .then(lines => lines.map(line => ({...line, lastAccess: new Date()})))
                    .then(lines => db.lines.bulkAdd(lines))
                    .then(() => this.all());
            });
    }

    byLineNumber(lineNumber) {
        return db.lines
            .where({numero: parseInt(lineNumber, 10)})
            .first();
    }

    update(line) {
        return db.lines
            .put(line);
    }
}

export default () => new BusLineRepository();
