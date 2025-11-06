<script setup>
import {ref, defineProps, watch, defineEmits, onMounted} from 'vue';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css'

const selectedOption = ref(null);
onMounted(() => {
  watch(selectedOption, (newValue) => {
    const customEvent = new CustomEvent('select-change', {
      detail: newValue,
      bubbles: true,
    });
    document.querySelector('.custom-select-wrapper').dispatchEvent(customEvent);
  });

});
//const emit = defineEmits(['update:selected']);

defineProps({
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
});
/*watch(selectedOption, (newValue) => {
  emit('update:selected', newValue);
  console.log('Vue Island emitted:', newValue);
});*/
</script>

<template>
  <div class="custom-select-wrapper">
    <v-select
        id="custom-select"
        :options="options"
        v-model="selectedOption"
        label="label"
        :placeholder="placeholder"
    />
<!--    <p>Selected: {{ selectedOption ? selectedOption.value : 'None' }}</p>-->
  </div>
</template>