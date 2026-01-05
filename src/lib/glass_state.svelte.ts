// Hourglass state for ASCII sand visualization
// Tracks grain count and falling/bounce animation

export const MAX_GRAINS = 52;
export const BOTTOM_CHAMBER_ROWS = 8; // Fillable rows in bottom chamber
export const FALL_FRAME_MS = 60;
export const BOUNCE_FRAME_MS = 80;
export const SETTLE_FRAME_MS = 100;

// Animation phases
export type AnimationPhase = 'falling' | 'bouncing' | 'settling' | null;

let grainCount = $state<number>(0);
let isAnimating = $state<boolean>(false);
let animationPhase = $state<AnimationPhase>(null);
let fallingPosition = $state<number>(-1); // Row in bottom chamber during fall
let bounceOffset = $state<number>(0); // 0 = on pile, 1 = bounced up
let settleHighlight = $state<boolean>(false); // True when grain just settled
let pendingGrains = $state<number>(0);

function startGrainAnimation(): void {
	if (grainCount >= MAX_GRAINS) {
		isAnimating = false;
		animationPhase = null;
		return;
	}

	isAnimating = true;
	animationPhase = 'falling';
	fallingPosition = 0; // Start at waist

	// Calculate target row based on current fill level
	const fillRatio = grainCount / MAX_GRAINS;
	const filledRows = Math.ceil(fillRatio * BOTTOM_CHAMBER_ROWS);
	const targetRow = BOTTOM_CHAMBER_ROWS - filledRows;

	// Phase 1: Falling animation
	const fallInterval = setInterval(() => {
		if (fallingPosition < targetRow) {
			fallingPosition++;
		} else {
			clearInterval(fallInterval);
			startBounceAnimation();
		}
	}, FALL_FRAME_MS);
}

function startBounceAnimation(): void {
	animationPhase = 'bouncing';
	bounceOffset = 1; // Bounce up

	// After bounce, settle down
	setTimeout(() => {
		bounceOffset = 0;
		startSettleAnimation();
	}, BOUNCE_FRAME_MS);
}

function startSettleAnimation(): void {
	animationPhase = 'settling';
	settleHighlight = true;

	// After settle highlight, complete the grain
	setTimeout(() => {
		settleHighlight = false;
		animationPhase = null;
		fallingPosition = -1;
		grainCount = Math.min(grainCount + 1, MAX_GRAINS);
		pendingGrains = Math.max(0, pendingGrains - 1);

		// Check if more grains are queued
		if (pendingGrains > 0 && grainCount < MAX_GRAINS) {
			setTimeout(startGrainAnimation, 100);
		} else {
			isAnimating = false;
		}
	}, SETTLE_FRAME_MS);
}

export const glassStore = {
	get grainCount(): number {
		return grainCount;
	},
	get isAnimating(): boolean {
		return isAnimating;
	},
	get animationPhase(): AnimationPhase {
		return animationPhase;
	},
	get fallingPosition(): number {
		return fallingPosition;
	},
	get bounceOffset(): number {
		return bounceOffset;
	},
	get settleHighlight(): boolean {
		return settleHighlight;
	},
	get fillPercentage(): number {
		return Math.min(grainCount / MAX_GRAINS, 1);
	},

	// Called on page load - instant fill, no animation
	setInitialCount(count: number): void {
		grainCount = Math.min(count, MAX_GRAINS);
		isAnimating = false;
		animationPhase = null;
		fallingPosition = -1;
		bounceOffset = 0;
		settleHighlight = false;
		pendingGrains = 0;
	},

	// Called when a task is archived - triggers animation
	addGrain(): void {
		if (grainCount >= MAX_GRAINS && pendingGrains === 0) return;
		pendingGrains++;
		if (!isAnimating) {
			startGrainAnimation();
		}
	},

	// Called when a task is unarchived - decrement without animation
	removeGrain(): void {
		if (grainCount > 0) {
			grainCount--;
		}
	}
};
