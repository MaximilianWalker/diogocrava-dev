import * as countries from './countries.json';
import * as timezones from './timezones.json';

export function getCountry() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone === "" || !timezone) return null;
    return countries[timezones[timezone].c[0]];
}

export function getLocation() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone === "" || !timezone) return null;
    return timezone.split("/")[1].replace("_", " ");
}
