import BusScheduleRepository from '../persistence/BusScheduleRepository';

const numberOfDaysToPrefetch = 10;

class BusScheduleService {

    prefetchNextDays(lineNumber, numberOfDays = numberOfDaysToPrefetch) {
        return dates(numberOfDays)
            .reduce((acc, dt) => acc.then(() => BusScheduleRepository().get(lineNumber, dateToQueryValue(dt))),
            Promise.resolve());
    }

    deleteOldDays() {
        const today = parseInt(dateToQueryValue(new Date()), 10);
        return BusScheduleRepository().all()
            .then(schedules => schedules.filter(schedule => parseInt(schedule.date, 10) < today))
            .then(schedules => schedules.map(schedule => schedule.id))
            .then(schedulesIds => BusScheduleRepository().delete(schedulesIds));
    }
}

function dates(numberOfDays) {
    const result = [];
    for (let i = 0; i < numberOfDays; i++) {
        const dt = new Date();
        dt.setDate(dt.getDate() + i);
        result.push(dt);
    }
    return result;
}

function dateToQueryValue(dt) {
    return dt.getFullYear() + pad(dt.getMonth() + 1, 2) + pad(dt.getDate(), 2);

    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
}

export default () => new BusScheduleService();
