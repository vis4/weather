<script>
    import Paragraph from '../components/Paragraph.svelte';
    import Section from '../components/Section.svelte';
    import { today, formatTemp } from '../stores';

    $: pctPrecip7 = $today.sumPrecip7 / $today.avgSumPrecip7Base;
    $: dryer7 = pctPrecip7 < 0.9;
    $: wetter7 = pctPrecip7 > 1.1;

    $: pctPrecip30 = $today.sumPrecip30 / $today.avgSumPrecip30Base;
    $: dryer30 = pctPrecip30 < 0.9;
    $: wetter30 = pctPrecip30 > 1.1;

    function fmtPct(n) {
        return (n*100).toFixed()+'%';
    }

    $: heatRecord = $today.tMaxRank < 5;
</script>

<Section>
    <Paragraph>
<!--         <span>
            The sum of precipitation over the last 7 days was {@html $today.sumPrecip7.toFixed(1)}mm. That's
            {#if dryer7}
            <b class="has-text-danger">only {fmtPct(pctPrecip7)}</b> of the normal precipitation of in the base period ({$today.avgSumPrecip7Base.toFixed(1)}mm).
            {:else if wetter7}
            <b class="has-text-info">wetter</b> than the normal precipitation of {$today.avgSumPrecip7Base.toFixed(1)}mm in the base period.
            {:else}
            pretty normal.
            {/if}
        </span> -->

        <span>
            There was a total of {@html $today.sumPrecip30.toFixed(1)}mm of rain over the last 30 days. That's
            {#if dryer30}
            <b class="has-text-danger">
                {pctPrecip30 < 0.25 ? 'alarmingly' :
                 pctPrecip30 < 0.5 ? 'severely' : 'significantly'} dryer
            </b> than normally ({fmtPct(pctPrecip30)} of precipitation in the base period).
            {:else if wetter30}
            <b class="has-text-info">wetter</b> than the normal precipitation of {$today.avgSumPrecip30Base.toFixed(1)}mm in the base period.
            {:else}
            pretty normal.
            {/if}
        </span>

    </Paragraph>
</Section>
