import BusScheduleRepository from '../persistence/BusScheduleRepository';
import DatesUtils from "../utils/DatesUtils";

const numberOfDaysToPrefetch = 10;

class BusScheduleService {

    prefetchNextDays(lineNumber, numberOfDays = numberOfDaysToPrefetch) {
        return DatesUtils().array(numberOfDays)
            .reduce((acc, dt) => acc.then(() => BusScheduleRepository().get(lineNumber, dt)),
            Promise.resolve());
    }

    deleteOldDays() {
        const today = new Date();
        return BusScheduleRepository().all()
            .then(schedules => schedules.filter(schedule => DatesUtils().compareToDays(schedule.date, today) < 0))
            .then(schedules => schedules.map(schedule => schedule.id))
            .then(schedulesIds => BusScheduleRepository().delete(schedulesIds));
    }
}

export default () => new BusScheduleService();
