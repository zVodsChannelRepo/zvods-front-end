<script lang="ts">
  import { getTheme } from '../hooks/theme'

  let count = 0
  $: showTheme = count >= 5
  function add() {
    count += 1
  }

  function subtract() {
    count -= 1
  }
</script>

<div class="counter text-4xl/6 mt-2 grid place-items-center">
  <button on:click={subtract}>-</button>
  <pre>{count}</pre>
  <button on:click={add}>+</button>
</div>
<div class="message text-center">
  {#if showTheme}
    {getTheme().name}
  {/if}
  <slot />
</div>

<style>
  .counter {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .message {
    text-align: center;
  }
</style>
