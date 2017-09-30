import db from "./Database";

class BusScheduleRepository {

    get(lineNumber, date) {
        return db.schedules
            .where({lineNumber, date})
            .first()
            .then(result => result.tables) // get tables on client code, not here
            .catch(() => {
                return fetch(`https://etufor-proxy.herokuapp.com/api/horarios/${lineNumber}?data=${date}`)
                    .then(response => response.json())
                    .then(schedule => db.schedules.add({lineNumber, date, tables: schedule}))
                    .then(() => this.get(lineNumber, date));
            });
    }

    all() {
        return db.schedules
            .toArray();
    }

    delete(ids) {
        if (Array.isArray(ids))
            return db.schedules.bulkDelete(ids);
        return db.schedules.delete(ids);
    }
}

export default () => new BusScheduleRepository();
