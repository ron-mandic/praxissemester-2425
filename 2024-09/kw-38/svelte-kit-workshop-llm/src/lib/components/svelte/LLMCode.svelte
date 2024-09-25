<script lang="ts">
	import '../../../../node_modules/highlight.js/styles/atom-one-dark.css';
	import hljs from 'highlight.js/lib/core';
	import javascript from 'highlight.js/lib/languages/javascript';
	import json from 'highlight.js/lib/languages/json';
	import python from 'highlight.js/lib/languages/python';

	const { innerText, language = 'javascript' } = $props<{
		innerText: string;
		language?: string;
		term?: string;
	}>();

	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('json', json);
	hljs.registerLanguage('python', python);
</script>

<code class="m-0 h-full w-full p-0">
	{@html hljs
		.highlight(JSON.stringify(innerText, null, 2), {
			language
		})
		.value.replace(/[\[\]\{\}\:\,]/g, (match) => `<span class="text-foreground">${match}</span>`)}
</code>
