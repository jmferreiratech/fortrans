import moment from "moment";
import "moment/locale/pt-br";

moment.locale("pt-br");

class DatesUtils {

    toDisplay(dt) {
        return moment(dt).format("ddd, D [de] MMM [de] YYYY");
    }

    toQuery(dt) {
        return moment(dt).format("YYYYMMDD");
    }

    toStore(dt) {
        const result = new Date(dt);
        result.setHours(0, 0, 0, 0);
        return result;
    }

    compareToDays(dt1, dt2) {
        return moment(dt1).diff(dt2, 'days');
    }

    compare(dt1, dt2) {
        return moment(dt1).diff(dt2);
    }

    array(length, from = new Date()) {
        const result = [];
        for (let i = 0; i < length; i++) {
            const dt = new Date(from);
            dt.setDate(dt.getDate() + i);
            result.push(dt);
        }
        return result;
    }
}

export default () => new DatesUtils();
