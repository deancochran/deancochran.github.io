<div id="post" class=" scroll-p-36">
	<slot />
</div>

<style lang="postcss">
	#post {
		:global(h1) {
			@apply h1 font-bold scroll-mt-[10vh];
		}
		:global(h2) {
			@apply h2 font-bold scroll-mt-[10vh];
		}
		:global(h3) {
			@apply h3 font-bold scroll-mt-[10vh];
		}
		:global(h4) {
			@apply h4 font-bold scroll-mt-[10vh];
		}
		:global(h5) {
			@apply h5 font-bold scroll-mt-[10vh];
		}
		:global(h6) {
			@apply h6 font-bold scroll-mt-[10vh];
		}

		:global(a) {
			@apply anchor
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
