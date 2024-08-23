export function getTimeInTimeZone(timeZone) {
    const options = { timeZone, hour: '2-digit', minute: '2-digit', hour12: false };
    const formatter = new Intl.DateTimeFormat([], options);
    return formatter.format(new Date());
}

export function getTimeFormated(hour) {
    let newHour = Number(hour);
    if (newHour === 0) {
        return '12 am';
    } else if (newHour > 0 && newHour < 12) {
        return `${newHour} am`;
    } else {
        if (newHour === 12) {
            return `12 pm`;
        }
        newHour = newHour - 12;
        return `${newHour} pm`;
    }
}