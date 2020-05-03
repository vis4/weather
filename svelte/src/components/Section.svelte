<script>
	import Headline from './Headline.svelte';
	export let headline = '';
</script>
<section class="section">
	<div class="container">
		{#if headline}
		<Headline>{@html headline}</Headline>
		{/if}
		<slot></slot>
	</div>
</section>