<script>
    import { scaleLinear } from 'd3-scale';
    import { timeFormat } from 'd3-time-format';

	import Section from '../components/Section.svelte';

    let height = 300;
    let width;

</script>

<style>
    svg {
        position: relative;
        width: 100%;
        overflow: hidden;
    }
</style>

<Section>
	<div class="chart" bind:clientWidth={width}>
	    <svg {height}>

	    	</svg>

	    </div>
</Section>
