// hooks/use-mobile.ts
export function useMobile() {
  const { width } = useWindowSize() // @vueuse/core
  const isMobile = computed(() => width.value < 768)
  return { isMobile }
}
