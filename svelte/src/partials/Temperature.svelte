<script>
    import Paragraph from '../components/Paragraph.svelte';
    import Section from '../components/Section.svelte';
    import { today, formatTemp, niceDate } from '../stores';

    $: diffAvg = $today.tAvg - $today.tAvgBase;
    $: warmer = diffAvg > 1;
    $: colder = diffAvg < -1;

    $: heatRecord = $today.tMaxRank < 5;
</script>

<Section>
    <Paragraph>
        <span>
            With {@html $formatTemp($today.tAvg)}, the daily average temperature on {$niceDate} was
            {#if warmer}
            <b class="has-text-danger">about {@html $formatTemp(Math.round(diffAvg))} warmer</b> than normal.
            {:else if colder}
            <b class="has-text-info">about {@html $formatTemp(Math.round(-diffAvg))} colder</b> than normal.
            {:else}
            pretty normal.
            {/if}
        </span>
        <span>
            {#if heatRecord}
            The daily maximum temperature of {@html $formatTemp($today.tMax)} was the <b class="has-text-danger">{$today.tMaxRank}-hottest</b> measured at this station.
            {/if}
        </span>
    </Paragraph>
</Section>
