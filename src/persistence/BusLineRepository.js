import db from "./Database";

class BusLineRepository {

    all() {
        return db.lines
            .toArray()
            .then(lines => {
                if (lines.length)
                    return lines;
                return fetch("https://etufor-proxy.herokuapp.com/api/linhas/")
                    .then(response => response.json())
                    .then(lines => db.lines.bulkAdd(lines))
                    .then(() => this.all());
            });
    }
}

export default () => new BusLineRepository();
