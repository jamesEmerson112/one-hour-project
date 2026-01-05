<script lang="ts">
	import { glassStore, MAX_GRAINS, GLASS_HEIGHT } from '$lib/glass_state.svelte';

	const GLASS_WIDTH = 22; // Inner width of the glass

	// Generate ASCII art lines based on fill level and falling grain position
	function generateGlassArt(grains: number, fallingPos: number): string[] {
		const lines: string[] = [];

		// Top border
		lines.push('      ╭' + '─'.repeat(GLASS_WIDTH) + '╮');

		// Calculate fill level (grains fill from bottom)
		const filledRows = Math.ceil((grains / MAX_GRAINS) * GLASS_HEIGHT);

		// Glass body (8 rows)
		for (let row = 0; row < GLASS_HEIGHT; row++) {
			const rowFromBottom = GLASS_HEIGHT - 1 - row;
			let content: string;

			if (rowFromBottom < filledRows) {
				// This row is filled - determine density based on position
				const density = rowFromBottom / GLASS_HEIGHT;
				let char: string;
				if (density < 0.33) {
					char = '▓'; // Dense at bottom
				} else if (density < 0.66) {
					char = '▒'; // Medium in middle
				} else {
					char = '░'; // Light at top of fill
				}
				content = char.repeat(GLASS_WIDTH);
			} else {
				// Empty row - check for falling grain
				if (row === fallingPos && fallingPos >= 0) {
					// Show falling grain in center
					const padding = Math.floor(GLASS_WIDTH / 2);
					content = ' '.repeat(padding) + '·' + ' '.repeat(GLASS_WIDTH - padding - 1);
				} else {
					content = ' '.repeat(GLASS_WIDTH);
				}
			}

			lines.push('      │' + content + '│');
		}

		// Bottom borders (tapered)
		lines.push('      ╰┬' + '─'.repeat(GLASS_WIDTH - 2) + '┬╯');
		lines.push('       ╰' + '─'.repeat(GLASS_WIDTH - 2) + '╯');

		return lines;
	}

	// Reactive glass art - updates when grain count or falling position changes
	let glassLines = $derived(
		generateGlassArt(glassStore.grainCount, glassStore.fallingGrainPosition)
	);
</script>

<div class="mb-4">
	<pre class="text-sm leading-tight">{glassLines.join('\n')}</pre>
	<pre class="text-center text-xs">      [ {glassStore.grainCount} / {MAX_GRAINS} ]</pre>
</div>
