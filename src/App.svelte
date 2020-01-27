<script>
    import { csv } from 'd3-fetch';
    import { timeFormat } from 'd3-time-format';
    import dayjs from 'dayjs';
    import LocalizedFormat from 'dayjs/plugin/localizedFormat'

    import Paragraph from './components/Paragraph.svelte';
    import NavBar from './partials/NavBar.svelte';
    import StationSelect from './partials/StationSelect.svelte';
    import Temperature from './partials/Temperature.svelte';
    import TemperatureAvg from './partials/TemperatureAvg.svelte';
    import Rain from './partials/Rain.svelte';

    import { beforeUpdate } from 'svelte';
    import {
        msg,
        curDate,
        language,
        today,
        contextMinYear,
        contextMaxYear,
        stationData,
        formatTemp,
        useFahrenheit
    } from './stores';

    dayjs.extend(LocalizedFormat);

    let data;

    $: stationShort = station ? station.name : '...';

    const parseRow = d => {
        const date = new Date(d.date);
        return {
            date,
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate(),
            dateRaw: d.date,
            tMin: +d.TNK,
            tAvg: +d.TMK,
            tMax: +d.TXK,
            precip: +d.RSK
        }
    };

    $: stationFrom = station ? station.from.getFullYear() : 1980;

    let promise;
    const load = () => {
        if (!station) return;
        console.log('loading...');
        promise = csv(
            `/data/dwd/stations/${station.id}.csv`,
            parseRow
        ).then(res => {
            $stationData = res;
        });
    };

    let _station;
    let _lang;
    let station;
    let stations = [];


    beforeUpdate(() => {
        if (station !== _station) {
            // new station selected!
            _station = station;
            data = false;
            load();
        }
        if (_lang !== $language) {
            _lang = $language;
        }
    });

    $: loading = `<i class="fa fa-spinner fa-pulse fa-fw"></i> ${$msg.loading}...`;
</script>

<style>

    section[lang='de'] *[lang='en'] {
        display: none;
    }

    section[lang='en'] *[lang='de'] {
        display: none;
    }
</style>

<!-- <NavBar /> -->

<section lang={$language} class="section">
    <div class="container">
        <h1 class="title is-size-1 is-size-3-mobile ">
            The weather at station {stationShort} on {dayjs($today.date).format('LL')} in context
        </h1>

        <StationSelect bind:station {stations} />
    </div>
</section>

{#if $today}
<Temperature />
<TemperatureAvg />
{/if}
{#if $today && $today.sumPrecip7 !== undefined}
<Rain />
{/if}
