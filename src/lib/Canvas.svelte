<script lang="ts">
  import { Svelvet, Controls, ThemeToggle } from "svelvet";
  import {
    extractSubstring,
    generateRandomString,
  } from "../webflow/stringUtils";
  import Node from "./MyNode.svelte";
  import { getWFElementById } from "../webflow/components";

  export let questions: any[];
  export let allElements: any[];

  $: questionsProcessed = questions.map((que, index) => {
    const pos = { x: 300, y: 100 + 150 * index };
    const id = generateRandomString(5);
    return { id, text: que.question, pos, index };
  });

  webflow.setExtensionSize({ height: 800, width: 1200 });

  const addAttr = async (e) => {
    const data = e.detail;

    const destination = data.targetNode;
    const origin = data.sourceNode;
    const sourceAnchor = data.sourceAnchor;
    const isRadioChoice = sourceAnchor.id.includes("customFormly!");

    // console.log(data);

    const node_destination = questionsProcessed.find((q) => {
      const id = destination.id.replace("N-", "");
      return id === q.id;
    });
    const node_destination_index = node_destination.index;
    const node_destination_id = questions[node_destination_index].id;

    const node_origin = questionsProcessed.find((q) => {
      const id = origin.id.replace("N-", "");
      return id === q.id;
    });
    const node_origin_index = node_origin.index;
    let node_origin_id = questions[node_origin_index].id;

    if (isRadioChoice) {
      node_origin_id = extractSubstring(sourceAnchor.id);
    }

    const wfDesinationNode = await getWFElementById(
      node_destination_id,
      allElements
    );
    const wfOriginNode = await getWFElementById(node_origin_id, allElements);

    const isAttributed = wfDesinationNode.getCustomAttribute("data-answer");

    if (isRadioChoice) {
      const optionName = generateRandomString(4);
      wfDesinationNode.setCustomAttribute(
        "data-answer",
        "option-" + optionName
      );
      await wfDesinationNode.save();

      wfOriginNode.setCustomAttribute("data-go-to", "option-" + optionName);
      await wfOriginNode.save();
    } else {
      wfDesinationNode.setCustomAttribute(
        "data-answer",
        String(node_origin_index)
      );
      await wfDesinationNode.save();

      wfOriginNode.setCustomAttribute(
        "data-go-to",
        String(node_destination_index)
      );
      await wfOriginNode.save();
    }
  };

  const removeAttr = (e) => {
    console.log(e);
  };
</script>

<Svelvet
  height={700}
  theme="dark"
  zoom={0.7}
  minimap
  on:connection={addAttr}
  on:disconnection={removeAttr}
>
  {#each questionsProcessed as que, index}
    <Node
      id={que.id}
      label={que.text}
      position={que.pos}
      {index}
      choices={questions[index].radioChoices}
    />
  {/each}

  <Controls slot="controls" horizontal />
  <ThemeToggle slot="toggle" main="dark" alt="light" />
</Svelvet>
