
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)


export const AppHeader: typeof import("../components/AppHeader.vue")['default']
export const AppSidebar: typeof import("../components/AppSidebar.vue")['default']
export const ChatPanelShadcn: typeof import("../components/ChatPanelShadcn.vue")['default']
export const UiThemeToggle: typeof import("../components/ui/ThemeToggle.vue")['default']
export const UiButton: typeof import("../components/ui/button/Button.vue")['default']
export const UiCard: typeof import("../components/ui/card/Card.vue")['default']
export const UiCardAction: typeof import("../components/ui/card/CardAction.vue")['default']
export const UiCardContent: typeof import("../components/ui/card/CardContent.vue")['default']
export const UiCardDescription: typeof import("../components/ui/card/CardDescription.vue")['default']
export const UiCardFooter: typeof import("../components/ui/card/CardFooter.vue")['default']
export const UiCardHeader: typeof import("../components/ui/card/CardHeader.vue")['default']
export const UiCardTitle: typeof import("../components/ui/card/CardTitle.vue")['default']
export const UiDialog: typeof import("../components/ui/dialog/Dialog.vue")['default']
export const UiDialogClose: typeof import("../components/ui/dialog/DialogClose.vue")['default']
export const UiDialogContent: typeof import("../components/ui/dialog/DialogContent.vue")['default']
export const UiDialogDescription: typeof import("../components/ui/dialog/DialogDescription.vue")['default']
export const UiDialogFooter: typeof import("../components/ui/dialog/DialogFooter.vue")['default']
export const UiDialogHeader: typeof import("../components/ui/dialog/DialogHeader.vue")['default']
export const UiDialogOverlay: typeof import("../components/ui/dialog/DialogOverlay.vue")['default']
export const UiDialogScrollContent: typeof import("../components/ui/dialog/DialogScrollContent.vue")['default']
export const UiDialogTitle: typeof import("../components/ui/dialog/DialogTitle.vue")['default']
export const UiDialogTrigger: typeof import("../components/ui/dialog/DialogTrigger.vue")['default']
export const UiInput: typeof import("../components/ui/input/Input.vue")['default']
export const UiScrollArea: typeof import("../components/ui/scroll-area/ScrollArea.vue")['default']
export const UiScrollAreaScrollBar: typeof import("../components/ui/scroll-area/ScrollBar.vue")['default']
export const UiSeparator: typeof import("../components/ui/separator/Separator.vue")['default']
export const UiSheet: typeof import("../components/ui/sheet/Sheet.vue")['default']
export const UiSheetClose: typeof import("../components/ui/sheet/SheetClose.vue")['default']
export const UiSheetContent: typeof import("../components/ui/sheet/SheetContent.vue")['default']
export const UiSheetDescription: typeof import("../components/ui/sheet/SheetDescription.vue")['default']
export const UiSheetFooter: typeof import("../components/ui/sheet/SheetFooter.vue")['default']
export const UiSheetHeader: typeof import("../components/ui/sheet/SheetHeader.vue")['default']
export const UiSheetOverlay: typeof import("../components/ui/sheet/SheetOverlay.vue")['default']
export const UiSheetTitle: typeof import("../components/ui/sheet/SheetTitle.vue")['default']
export const UiSheetTrigger: typeof import("../components/ui/sheet/SheetTrigger.vue")['default']
export const UiTextarea: typeof import("../components/ui/textarea/Textarea.vue")['default']
export const UiTooltip: typeof import("../components/ui/tooltip/Tooltip.vue")['default']
export const UiTooltipContent: typeof import("../components/ui/tooltip/TooltipContent.vue")['default']
export const UiTooltipProvider: typeof import("../components/ui/tooltip/TooltipProvider.vue")['default']
export const UiTooltipTrigger: typeof import("../components/ui/tooltip/TooltipTrigger.vue")['default']
export const NuxtWelcome: typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtPage: typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const NuxtRouteAnnouncer: typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const LazyAppHeader: LazyComponent<typeof import("../components/AppHeader.vue")['default']>
export const LazyAppSidebar: LazyComponent<typeof import("../components/AppSidebar.vue")['default']>
export const LazyChatPanelShadcn: LazyComponent<typeof import("../components/ChatPanelShadcn.vue")['default']>
export const LazyUiThemeToggle: LazyComponent<typeof import("../components/ui/ThemeToggle.vue")['default']>
export const LazyUiButton: LazyComponent<typeof import("../components/ui/button/Button.vue")['default']>
export const LazyUiCard: LazyComponent<typeof import("../components/ui/card/Card.vue")['default']>
export const LazyUiCardAction: LazyComponent<typeof import("../components/ui/card/CardAction.vue")['default']>
export const LazyUiCardContent: LazyComponent<typeof import("../components/ui/card/CardContent.vue")['default']>
export const LazyUiCardDescription: LazyComponent<typeof import("../components/ui/card/CardDescription.vue")['default']>
export const LazyUiCardFooter: LazyComponent<typeof import("../components/ui/card/CardFooter.vue")['default']>
export const LazyUiCardHeader: LazyComponent<typeof import("../components/ui/card/CardHeader.vue")['default']>
export const LazyUiCardTitle: LazyComponent<typeof import("../components/ui/card/CardTitle.vue")['default']>
export const LazyUiDialog: LazyComponent<typeof import("../components/ui/dialog/Dialog.vue")['default']>
export const LazyUiDialogClose: LazyComponent<typeof import("../components/ui/dialog/DialogClose.vue")['default']>
export const LazyUiDialogContent: LazyComponent<typeof import("../components/ui/dialog/DialogContent.vue")['default']>
export const LazyUiDialogDescription: LazyComponent<typeof import("../components/ui/dialog/DialogDescription.vue")['default']>
export const LazyUiDialogFooter: LazyComponent<typeof import("../components/ui/dialog/DialogFooter.vue")['default']>
export const LazyUiDialogHeader: LazyComponent<typeof import("../components/ui/dialog/DialogHeader.vue")['default']>
export const LazyUiDialogOverlay: LazyComponent<typeof import("../components/ui/dialog/DialogOverlay.vue")['default']>
export const LazyUiDialogScrollContent: LazyComponent<typeof import("../components/ui/dialog/DialogScrollContent.vue")['default']>
export const LazyUiDialogTitle: LazyComponent<typeof import("../components/ui/dialog/DialogTitle.vue")['default']>
export const LazyUiDialogTrigger: LazyComponent<typeof import("../components/ui/dialog/DialogTrigger.vue")['default']>
export const LazyUiInput: LazyComponent<typeof import("../components/ui/input/Input.vue")['default']>
export const LazyUiScrollArea: LazyComponent<typeof import("../components/ui/scroll-area/ScrollArea.vue")['default']>
export const LazyUiScrollAreaScrollBar: LazyComponent<typeof import("../components/ui/scroll-area/ScrollBar.vue")['default']>
export const LazyUiSeparator: LazyComponent<typeof import("../components/ui/separator/Separator.vue")['default']>
export const LazyUiSheet: LazyComponent<typeof import("../components/ui/sheet/Sheet.vue")['default']>
export const LazyUiSheetClose: LazyComponent<typeof import("../components/ui/sheet/SheetClose.vue")['default']>
export const LazyUiSheetContent: LazyComponent<typeof import("../components/ui/sheet/SheetContent.vue")['default']>
export const LazyUiSheetDescription: LazyComponent<typeof import("../components/ui/sheet/SheetDescription.vue")['default']>
export const LazyUiSheetFooter: LazyComponent<typeof import("../components/ui/sheet/SheetFooter.vue")['default']>
export const LazyUiSheetHeader: LazyComponent<typeof import("../components/ui/sheet/SheetHeader.vue")['default']>
export const LazyUiSheetOverlay: LazyComponent<typeof import("../components/ui/sheet/SheetOverlay.vue")['default']>
export const LazyUiSheetTitle: LazyComponent<typeof import("../components/ui/sheet/SheetTitle.vue")['default']>
export const LazyUiSheetTrigger: LazyComponent<typeof import("../components/ui/sheet/SheetTrigger.vue")['default']>
export const LazyUiTextarea: LazyComponent<typeof import("../components/ui/textarea/Textarea.vue")['default']>
export const LazyUiTooltip: LazyComponent<typeof import("../components/ui/tooltip/Tooltip.vue")['default']>
export const LazyUiTooltipContent: LazyComponent<typeof import("../components/ui/tooltip/TooltipContent.vue")['default']>
export const LazyUiTooltipProvider: LazyComponent<typeof import("../components/ui/tooltip/TooltipProvider.vue")['default']>
export const LazyUiTooltipTrigger: LazyComponent<typeof import("../components/ui/tooltip/TooltipTrigger.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtPage: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/nuxt-island")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../node_modules/.pnpm/nuxt@4.1.0_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-sfc@3.5.21_db0@0.3.2__126ed4ad7e7e72badf7a6cc477f8558b/node_modules/nuxt/dist/app/components/server-placeholder")['default']>

export const componentNames: string[]
