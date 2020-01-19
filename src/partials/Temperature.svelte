<script>
    import Paragraph from '../components/Paragraph.svelte';
    import Section from '../components/Section.svelte';
    import { today, formatTemp } from '../stores';

    $: diffAvg = $today.tAvg - $today.tAvgBase;
    $: warmer = diffAvg > 1;
    $: colder = diffAvg < -1;

    $: heatRecord = $today.tMaxRank < 5;
</script>

<Section>
    <Paragraph>
        <span>
            The daily average temperature of {@html $formatTemp($today.tAvg)} was
            {#if warmer}
            <b class="has-text-danger">{@html $formatTemp(diffAvg)} warmer</b> than normal.
            {:else if colder}
            <b class="has-text-info">{@html $formatTemp(-diffAvg)} colder</b> than normal.
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
