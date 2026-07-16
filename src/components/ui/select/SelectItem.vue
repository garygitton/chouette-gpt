<script setup lang="ts">
import type { SelectItemProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import {
  SelectItem,
  SelectItemText,
  useForwardProps,
} from "reka-ui"
import { cn } from '~/lib/utils'

const props = defineProps<SelectItemProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <SelectItem
    v-bind="forwardedProps"
    :class="
      cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-3 text-sm outline-none',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-700',
        'dark:data-[state=checked]:bg-indigo-950/40 dark:data-[state=checked]:text-indigo-300',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        props.class,
      )
    "
  >
    <SelectItemText>
      <slot />
    </SelectItemText>
  </SelectItem>
</template>
