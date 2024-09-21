<div id="post">
	<slot />
</div>

<style lang="postcss">
	#post {
		:global(h1) {
			@apply h1 font-bold;
		}
		:global(h2) {
			@apply h2 font-bold;
		}
		:global(h3) {
			@apply h3 font-bold;
		}
		:global(h4) {
			@apply h4 font-bold;
		}
		:global(h5) {
			@apply h5 font-bold;
		}
		:global(h6) {
			@apply h6 font-bold;
		}

		:global(a) {
			@apply anchor;
		}

		:global(blockquote) {
			@apply blockquote;
		}

		:global(li) {
			@apply m-0 p-0 py-1;
		}
		:global(ol) {
			@apply list-outside list-decimal space-y-2 pl-4;
		}
		:global(ul) {
			@apply list-outside list-disc space-y-2 pl-4;
		}

		:global(kbd) {
			@apply kbd;
		}

		:global(del) {
			@apply del;
		}

		:global(ins) {
			@apply ins;
		}

		:global(p) {
			@apply inline;
		}
	}
</style>
