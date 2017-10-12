import db from "./Database";
import DatesUtils from "../utils/DatesUtils";
import HttpService from "../services/HttpService";

class BusScheduleRepository {

    get(lineNumber, dt) {
        const date = DatesUtils().toStore(dt);
        return db.schedules
            .where({lineNumber, date})
            .first()
            .then(result => {
                if (!result)
                    throw new Error(`No data to line ${lineNumber} at ${dt}`);
                return result.tables; // get tables on client code, not here
            })
            .catch(e => {
                return HttpService().getJSON(`https://etufor-proxy.herokuapp.com/api/horarios/${lineNumber}?data=${DatesUtils().toQuery(date)}`)
                    .then(schedule => db.schedules.add({lineNumber, date, tables: schedule}))
                    .then(() => this.get(lineNumber, date));
            });
    }

    byLineNumber(lineNumber) {
        return db.schedules
            .where({lineNumber})
            .toArray();
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
