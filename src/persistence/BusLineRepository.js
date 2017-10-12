import db from "./Database";
import HttpService from "../services/HttpService";

class BusLineRepository {

    all() {
        return db.lines
            .orderBy("numero")
            .toArray()
            .then(lines => {
                if (lines.length)
                    return lines;
                return HttpService().getJSON("https://etufor-proxy.herokuapp.com/api/linhas/")
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
