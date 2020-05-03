<script context="module">
    import { csvParse } from 'd3-dsv'
    export async function preload({ params, query }) {
        const data = await this.fetch(`https://vis4.net/data/dwd/stations/${params.station}.csv`)
        .then(r => r.text())
        .then(csvParse);
        return {
            data
        };
    }
</script>

<script>


    export let data = [];
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
    <title>Sapper project template</title>
</svelte:head>

<h1>Great success!</h1>

<p><strong>Try editing this file (src/routes/index.svelte) to test live reloading.</strong></p>

{data.length}


