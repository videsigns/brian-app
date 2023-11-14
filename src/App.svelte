<script lang="ts">
  import Canvas from "./lib/Canvas.svelte";
  import Welcome from "./lib/Welcome.svelte";

  let isCompoPasted = false;
  let questions = [];
  let allElements = [];

  const showCanvas = (event) => {
    if (event.detail.extractedQuestions.length > 0) {
      isCompoPasted = true;
      questions = event.detail.extractedQuestions;
      allElements = event.detail.allElements;
    }
  };
</script>

<main>
  {#if isCompoPasted}
    <Canvas {questions} {allElements} />
  {:else}
    <Welcome on:showCanvas={showCanvas} />
  {/if}
</main>
