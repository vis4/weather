import { writable, derived } from 'svelte/store';
import { scaleLinear } from 'd3-scale';
import { de, en } from './locale';
import { timeFormat } from 'd3-time-format';
import { mean, sum, range } from 'd3-array';

const fmtSameDay = timeFormat('%Y-%m-%d');

export const stationData = writable([]);

export const curDate = writable(new Date((new Date()).getTime()-864e5));
export const curDateFmt = derived(curDate, curDate => fmtSameDay(curDate));

export const contextMinYear = writable(1981);
export const contextRange = writable(30); // years
export const contextMaxYear = derived(
    [contextMinYear, contextRange],
    ([$contextMinYear, $contextRange]) => $contextMinYear + $contextRange
);

export const fmtShort = timeFormat('%b %d');

export const today = derived([stationData, curDateFmt, contextMinYear, contextMaxYear], ([data, fmt, minYr, maxYr]) => {
    let last;
    data.forEach(row => {
        if (last) last.previous = row;
        last = row;
    });
    const row = data.find(r => r.dateRaw === fmt) || data[0];
    if (!row) return {};
    const allTime = data.filter(r =>
        r.month === row.month &&
        r.day === row.day);
    // const tMaxEqual = allTime.filter(r => r.tMax === row.tMax);
    const tMaxHigher = allTime.filter(r => r.tMax > row.tMax);
    const basePeriod = allTime.filter(r =>
        r.year >= minYr &&
        r.year < maxYr);

    // 7-day avg temp
    return {
        tAvgBase: mean(basePeriod, d => d.tAvg),
        tMaxRank: (tMaxHigher.length+1),
        ...aggregateNDays(row, 7),
        ...aggregateNDays(row, 30),
        ...noRainForDays(row),
        ...row
    };
    function noRainForDays(day) {
        let noRainFor = 0;
        while (day.precip === 0) {
            noRainFor++;
            day = day.previous;
        }
        return {
            noRainFor
        }
    }
    function aggregateNDays(row, n) {
        // compute stats for today
        const out = aggregate(row.date);
        // compute stats over base period
        const base = range(minYr, maxYr+1).map(year => ({
            year,
            ...aggregate(new Date(year, row.month, row.day))
        }));
        out[`avgTemp${n}Base`] = mean(base, d => d[`avgTemp${n}`]);
        out[`avgSumPrecip${n}Base`] = mean(base.filter(d => d[`sumPrecip${n}`] !== undefined), d => d[`sumPrecip${n}`] );
        console.log({out});
        return out;
        function aggregate(date) {
            const min = date.getTime() - n * 864e5;
            const span = data.filter(r => r.date.getTime() >= min && r.date.getTime() <= date.getTime());
            const out = {};
            out[`avgTemp${n}`] = mean(span, d => d.tAvg);
            if (!span.find(d => d.precip === -999)) {
                out[`sumPrecip${n}`] = sum(span, d => d.precip);
            }
            return out;
        }

    }
});

export const niceDate = derived([today], ([row]) => fmtShort(row.date));

export const innerWidth = writable(window.innerWidth);
export const chartWidth = writable(1000);

export const language = writable('de');

export const msg = derived(language, lang => {
    return lang === 'de' ? de : en;
});

export const useFahrenheit = writable(false);

export const formatTemp = derived([language, useFahrenheit], ([lang, useF]) => {
    return (d, unit = true, rel = false) => {
        if (!d || !d.toFixed) return d;
        if (useF) d = d * 1.8 + (rel ? 0 : 32);
        const n = Math.abs(d)
            .toFixed(Math.round(d * 1e6) / 1e6 === Math.round(d) ? 0 : 1)
            .replace(lang === 'de' ? '.' : null, ',');
        const sign = d < 0 ? '&minus;' : rel && d > 0 ? '+' : rel && !d ? '&plusmn;' : '';
        return `${sign}${n}${unit ? `°${useF ? 'F' : 'C'}` : ''}`;
    };
});

export function toF(C) {
    return C * 1.8 + 32;
}
export function toC(F) {
    return (F - 32) / 1.8;
}

export const getTempTicks = derived(useFahrenheit, useF => {
    if (!useF) return (scale, num) => scale.ticks(num).sort((a, b) => b - a);
    return (scale, num) => {
        return scaleLinear()
            .domain(scale.domain().map(toF))
            .ticks(num)
            .map(toC)
            .sort((a, b) => b - a);
    };
});
