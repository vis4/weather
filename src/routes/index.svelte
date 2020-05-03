<script context="module">
    import { csvParse } from 'd3-dsv'
    export async function preload({ params, query }) {
        const stations = await this.fetch(`https://vis4.net/data/dwd/stations.csv`)
            .then(r => r.text())
            .then(csvParse)
            .then(data => data.map(d => ({
                ...d,
                from: new Date(d.from),
                to: new Date(d.to),
                altitude: +d.altitude
            })));
        return {
            stations
        };
    }
</script>

<script>
    import { onMount } from 'svelte';
    import { findNearestStation } from '../components/utils';

    onMount(async () => {
        console.log('the component has mounted');
        const station = await findNearestStation(stations);
        if (station) nearest = station;
        else nearest = stations.find(d => d.id === '00430')
    });

    export let stations = [];
    let nearest;
</script>

<style>

    p {
        margin: 1em auto;
    }

    @media (min-width: 480px) {
        h1 {
            font-size: 4em;
        }
    }
</style>

<svelte:head>
    <title>Klimawetter</title>
</svelte:head>

<h1>Klimawetter</h1>

{#if nearest}
<p>Your nearest weather station is <a rel=prefetch href="/station/{nearest.id}">{nearest.name}</a>
{/if}

<p>Wetterstation auswählen:</p>

{stations.length}
{JSON.stringify(stations[0])}