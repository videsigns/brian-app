<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import {
    detectQuestionsComponent,
    extractQuestions,
    transverseDOM,
  } from "../webflow/components";

  const dispatch = createEventDispatcher();
  let errorMessage = "";

  const handlePaste = async (event) => {
    event.preventDefault();

    const clipboardData = event.clipboardData || window.Clipboard;
    const pastedContent = clipboardData.getData("application/json");

    let errorOrPass = detectQuestionsComponent(pastedContent);
    if (errorOrPass === true) {
      const extractedQuestions = extractQuestions(pastedContent);

      let s_element = await webflow.getSelectedElement();
      if (s_element) {
        const ss_element = s_element as DOMElement;
        const allElements = transverseDOM(ss_element);

        dispatch("showCanvas", { extractedQuestions, allElements });
      } else {
        errorMessage = "No DOM element selected!";
      }
    } else {
      errorMessage = errorOrPass;
    }
  };
</script>

<div class="wrapper" on:paste={handlePaste}>
  <div class="error">{errorMessage}</div>
  <div class="label">Paste your webflow component here</div>
</div>

<style>
  .label {
    text-align: center;
  }

  .error {
    text-align: center;
    color: red;
  }

  .wrapper {
    margin-top: 0.7rem;
    padding: 0.4rem;
    font-family: Inter;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0em;
    color: white;
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
</style>
