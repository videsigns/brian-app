<script lang="ts">
  import { Node, Anchor, Edge } from "svelvet";
  import { alternateDirections } from "../webflow/stringUtils";

  export let id;
  export let label;
  export let position;
  export let index: Number;
  export let choices: any[];

  let myEdge: Edge;
  let myAnchor: Anchor;

  let firstNodeinput = index === 0 ? 0 : 1;
  let directions = alternateDirections(choices.length);
</script>

<Node {id} {position} {label} borderWidth={1} inputs={firstNodeinput} TD={true}>
  {#if index !== 0}
    <div class="anchor">
      <Anchor multiple={true} direction="north">
        <Edge slot="edge" />
      </Anchor>
    </div>
  {/if}

  <div class="node-input">
    <h4>{label}</h4>
  </div>
  {#if choices.length > 0}
    <div class="node-input-choices">
      <p>{choices.map(({ text }) => text).join(" | ")}</p>
    </div>
  {/if}

  {#if choices.length === 0}
    <div class="anchor">
      <Anchor multiple={false} direction="south">
        <Edge slot="edge" />
      </Anchor>
    </div>
  {:else}
    <div class="anchors-holder">
      {#each choices as choice, index}
        <div class="anchor">
          <Anchor
            multiple={false}
            id={"&customFormly!" + choice.id + "&customFormly&"}
            direction={directions[index]}
          >
            <Edge label={choice.text} slot="edge" />
          </Anchor>
        </div>
      {/each}
    </div>
  {/if}
</Node>

<style>
  .node-input {
    background-color: black;
    width: 350px;
    height: 50px;
    border-radius: 8px;
    align-content: center;
    justify-content: center;
    display: flex;
  }
  .node-input-choices {
    background-color: black;
    width: 350px;
    height: 50px;
    align-content: center;
    justify-content: center;
    display: flex;
  }

  .anchor {
    margin-left: 170px;
  }

  .anchors-holder {
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: center;
  }

  .anchors-holder .anchor {
    margin-left: 0px;
  }
</style>
