import db from "./Database";

class BusScheduleRepository {

    get(lineNumber, date) {
        return db.schedules
            .where({lineNumber, date})
            .first()
            .then(result => result.tables)
            .catch(() => {
                return fetch(`https://etufor-proxy.herokuapp.com/api/horarios/${lineNumber}?data=${date}`)
                    .then(response => response.json())
                    .then(schedule => db.schedules.add({lineNumber, date, tables: schedule}))
                    .then(() => this.get(lineNumber, date));
            });
    }
}

export default BusScheduleRepository;
