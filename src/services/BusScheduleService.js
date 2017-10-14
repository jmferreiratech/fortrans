import BusScheduleRepository from '../persistence/BusScheduleRepository';
import BusLineRepository from "../persistence/BusLineRepository";
import DatesUtils from "../utils/DatesUtils";

const numberOfDaysToPrefetch = 10;
const numberOfLinesToKeep = 10;
const numberOfTopLines = 5;

class BusScheduleService {

    get(lineNumber, dt) {
        updateAccessMetrics(lineNumber);
        return BusScheduleRepository().get(lineNumber, dt);
    }

    prefetchNextDays(lineNumber, numberOfDays = numberOfDaysToPrefetch) {
        return DatesUtils().array(numberOfDays)
            .reduce((acc, dt) => acc.then(() => BusScheduleRepository().get(lineNumber, dt)).catch(e => console.log(e.message)), Promise.resolve());
    }

    prefetchTopLines() {
        return persistedLines()
            .then(lines => lines.sort((a, b) => b.accessCount - a.accessCount))
            .then(lines => lines.filter(line => lines.indexOf(line) < numberOfTopLines))
            .then(lines => lines.map(line => line.numero))
            .then(lineNumbers => lineNumbers.reduce((acc, lineNumber) => acc.then(() => this.prefetchNextDays(lineNumber)), Promise.resolve()));
    }

    deleteOldDays() {
        const today = new Date();
        return BusScheduleRepository().all()
            .then(schedules => schedules.filter(schedule => DatesUtils().compareToDays(schedule.date, today) < 0))
            .then(schedules => schedules.map(schedule => schedule.id))
            .then(schedulesIds => BusScheduleRepository().delete(schedulesIds));
    }

    deleteOldLines() {
        return persistedLines()
            .then(lines => lines.sort((a, b) => -DatesUtils().compare(a.lastAccess, b.lastAccess)))
            .then(lines => lines.filter(line => lines.indexOf(line) > numberOfLinesToKeep))
            .then(lines => Promise.all(lines.map(line => BusScheduleRepository().byLineNumber(line.numero))))
            .then(schedules => schedules.reduce((acc, schedule) => acc.concat(...schedule), []))
            .then(schedules => schedules.map(schedule => schedule.id))
            .then(ids => BusScheduleRepository().delete(ids));
    }
}

function updateAccessMetrics(lineNumber) {
    return BusLineRepository().byLineNumber(lineNumber)
        .then(line => ({...line, lastAccess: new Date()}))
        .then(line => ({...line, accessCount: line.accessCount + 1}))
        .then(line => BusLineRepository().update(line));
}

function persistedLines() {
    return BusScheduleRepository().all()
        .then(schedules => schedules.map(schedule => schedule.lineNumber))
        .then(lineNumbers => lineNumbers.filter((lineNumber, i) => i === lineNumbers.indexOf(lineNumber)))
        .then(lineNumbers => Promise.all(lineNumbers.map(lineNumber => BusLineRepository().byLineNumber(lineNumber))));
}

export default () => new BusScheduleService();
