<script>
    import { group } from 'd3-array';
    import { csv } from 'd3-fetch';
    import { msg, language, stations } from '../stores';
    import { tick } from 'svelte';
    import AutoComplete from "simple-svelte-autocomplete";

    export let station;

    let userSelectedStation = false;

    $: groupedStations = Array.from(group($stations, d => d.state))
        .map(([k, v]) => v)
        .sort((a, b) => (a[0].state > b[0].state ? 1 : a[0].state < b[0].state ? -1 : 0));

    function latLonDist(lat1, lon1, lat2, lon2) {
        const p = 0.017453292519943295; // This is  Math.PI / 180
        const c = Math.cos;
        const a =
            0.5 -
            c((lat2 - lat1) * p) / 2 +
            (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;
        const R = 6371; //  Earth distance in km so it will return the distance in km
        return 2 * R * Math.asin(Math.sqrt(a));
    }

    function findNearestStation(event) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                // compute distances
                $stations.forEach(s => {
                    s.dist = latLonDist(latitude, longitude, s.lat, s.lon);
                });
                userSelectedStation = !!event;
                station = $stations.sort((a, b) => a.dist - b.dist)[0];
            },
            () => {}
        );
    }

    const parseStations = d => ({
        ...d,
        from: new Date(d.from),
        to: new Date(d.to),
        altitude: +d.altitude
    });

    const loadStations = csv(
        'https://vis4.net/data/dwd/stations.csv',
        parseStations
    ).then(async res => {
        console.log(res);
        const list = res
            .filter(d => d.from.getFullYear() <= 1980 && d.to.getFullYear() >= 2019)
            .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));

        stations.set(list);

        await tick();
        if (!station) {
            // try to get location from user
            findNearestStation();
            station = $stations.find(s => s.id === '00430');
        } else {
            userSelectedStation = true;
        }
    }).catch(e => {
        console.error(e);
    });
</script>

<style>
    a i.im {
        font-size: 16px;
        position: relative;
        top: 2px;
    }
    label {
        display: block;
    }
</style>

{#if !$stations.length}
    Liste der Wetterstationen wird heruntergeladen...
{:else}
    <div class="box">
        <div class="columns">
            <div class="column">
                <div class="field">
                    <label class="label"> Wetterstation auswählen</label>
                    <div class="control has-icons-left">ss
                        <AutoComplete
                            className="has-icons-left"
                            items={$stations}
                            bind:selectedItem={station}
                            keywordsFunction="{s => `${s.name}, ${s.state}`}"
                            labelFunction="{s => `${s.name}, ${s.state}`}"
                        />
                    </div>
                </div>
                <a href="#/near-me" on:click|preventDefault={findNearestStation}>
                    Wetterstation in meiner Nähe finden
                </a>
            </div>
        </div>
        {#if station}<a
        href="/klimawetter/{station.id}"
        class="button is-primary">öffnen</a>
        {/if}
    </div>

    <!-- <select
        class="custom-select"
        bind:value={station}
        on:change={() => (userSelectedStation = true)}>
        <option value={null}>(select station)</option>
        {#each groupedStations as stations}
            <optgroup label={stations[0].state}>
                {#each stations as s}
                    <option value={s}>{s.name}</option>
                {/each}
            </optgroup>
        {/each}
    </select>
    oder -->


   <!--  <hr />
    <table>

        <tr>
            <th class="pr-4">Ausgewählte Station:</th>
            <td>{station.name}, {station.state}</td>
        </tr>
        <tr>
            <th>{$msg.timerange}:</th>
            <td>{station.from.getFullYear()} - {station.to.getFullYear()}</td>
        </tr>
        <tr>
            <th>{$msg.location}:</th>
            <td>
                <a
                    target="_blank"
                    href="https://www.openstreetmap.org/#map=19/{station.lat}/{station.lon}">
                    {(+station.lat).toFixed(2)}, {(+station.lon).toFixed(2)}
                </a>
            </td>
        </tr>
        <tr>
            <th>{$msg.altitude}:</th>
            <td>{station.altitude}m</td>
        </tr>
    </table>
 -->
{/if}
