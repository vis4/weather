<script>
    import Paragraph from '../components/Paragraph.svelte';
    import Section from '../components/Section.svelte';
    import { today, formatTemp, niceDate } from '../stores';

    $: diffAvg7 = $today.avgTemp7 - $today.avgTemp7Base;
    $: warmer7 = diffAvg7 > 1;
    $: colder7 = diffAvg7 < -1;

    $: diffAvg30 = $today.avgTemp30 - $today.avgTemp30Base;
    $: warmer30 = diffAvg30 > 1;
    $: colder30 = diffAvg30 < -1;

</script>

<Section>
    <Paragraph>
        <span>
            The seven-day average was
            {#if warmer7}
            <b class="has-text-danger">{@html $formatTemp(diffAvg7)} warmer</b> than normal.
            {:else if colder7}
            <b class="has-text-info">{@html $formatTemp(-diffAvg7)} colder</b> than normal.
            {:else}
            pretty normal.
            {/if}
        </span>
        <span>
            The 30-day average was
            {#if warmer30}
            <b class="has-text-danger">{@html $formatTemp(diffAvg30)} warmer</b> than normal.
            {:else if colder30}
            <b class="has-text-info">{@html $formatTemp(-diffAvg30)} colder</b> than normal.
            {:else}
            pretty normal.
            {/if}
        </span>
    </Paragraph>
</Section>

