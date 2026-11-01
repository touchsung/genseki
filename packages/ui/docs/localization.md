# Localizing primitive labels

All added props are optional. Omitting them preserves the existing English copy. Label objects can be partial: each missing field falls back independently. Props are consumed by the component, not forwarded as DOM attributes. Consumers supply translations; no global provider or bundled language pack is required.

The playground at `/playground/shadcn/localization` switches between Thai overrides and English defaults. At 390px, open Filter and open/close the mobile sidebar repeatedly, using Escape or the inner trigger, to check width and focus restoration.

## New props

| Component                                   | Optional prop                                                               | English default                                            |
| ------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Filter                                      | `labels.trigger`, `.title`, `.resetAll`, `.apply` (`Partial<FilterLabels>`) | Filter; Apply Filters; Reset All; Apply                    |
| DialogContent                               | `closeLabel: string`                                                        | Close                                                      |
| SheetContent                                | `closeLabel: string`                                                        | Close                                                      |
| CommandDialog                               | `closeLabel: string`, forwarded to DialogContent                            | Close                                                      |
| Sidebar                                     | `labels.mobileTitle`, `.mobileDescription`, `.mobileClose`                  | Sidebar; Displays the mobile sidebar.; Close               |
| SidebarTrigger                              | `label: string` (screen-reader text)                                        | Toggle Sidebar                                             |
| SidebarRail                                 | `label: string` (aria-label and title)                                      | Toggle Sidebar                                             |
| PaginationEllipsis                          | `label: string`                                                             | More pages                                                 |
| PageSizeSelect                              | `label: string` (SelectValue aria-label and placeholder)                    | Show                                                       |
| PageIndex                                   | `labels.page`, `.of`                                                        | Page; of                                                   |
| BreadcrumbEllipsis                          | `label: string`                                                             | More                                                       |
| CollectionCardItemCount                     | `itemLabel: string`                                                         | items                                                      |
| ComboboxTrigger / ComboboxTriggerMultiValue | `placeholder: string`                                                       | Please select item                                         |
| ComboboxCommandEmpty                        | `emptyText: string` (existing children take precedence)                     | No framework found                                         |
| SelectContent                               | `emptyText: string`, passed to automatic empty content                      | No items                                                   |
| DatePickerTrigger                           | `placeholder: ReactNode`, when date/formatter output is absent              | undefined (blank, as before)                               |
| FilePreviewStatus                           | `labels.pending`, `.completed`, `.failed`                                   | Pending; Completed; Failed                                 |
| DropZoneEmptyUploadButton                   | `labels.uploadFile`, `.uploadFiles`                                         | Upload a file; Upload files                                |
| DropZoneEmptyUploadDescription              | `labels.clickToUpload`, `.dragAndDrop`                                      | Click to upload; or drag and drop PNG, JPG, GIF (max. 2MB) |
| DropzoneProvider                            | `formatCaption(options: DropzoneCaptionOptions): string`                    | Existing English generated caption                         |
| ColorPickerOutput                           | `placeholder: string`                                                       | Mode                                                       |

`DropzoneCaptionOptions` exposes the existing optional `accept`, `minSize`, `maxSize` constraints. The callback replaces the complete generated caption fragment (the caption component retains its existing final period); it allows translated size constraints and locale-specific list formatting without parsing English. It receives the same constraints the default caption used, including an undefined maxSize when omitted. The existing implicit upload limit remains unchanged. Technical units and MIME types need not be translated; a formatter may use translated units.

`PageIndex` retains the existing sequence and spacing: page label, page number, of label, total. `CollectionCardItemCount` retains number then suffix. Use existing composition primitives for languages needing a different sentence order.

## Existing localization APIs (no redundant new props)

- Pagination `aria-label` defaults to `pagination`; PaginationPrevious/Next already accept `aria-label`, overriding `Go to previous page` / `Go to next page`.
- Breadcrumb already accepts `aria-label`, overriding `breadcrumb`.
- ComboboxCommandInput already accepts `placeholder`, overriding `Search item...`. Trigger render functions/children remain supported. ComboboxCommandEmpty children still override its fallback.
- SelectEmptyContent already accepts children, overriding `No items`; SelectValue accepts placeholder. SelectContent's new prop covers the previously inaccessible automatic empty state.
- Calendar already accepts DayPicker `locale`, `labels` and `formatters`. Supply Thai `locale` from `react-day-picker/locale` for month/weekday text, and translated accessible label functions (navigation, days, weekdays, month/year dropdowns, week numbers, etc. as used by your configuration). This PR also makes the default month-dropdown formatter respect `locale`; custom formatters retain priority. DatePickerTrigger's existing `formatDate` controls date display, e.g. `date?.toLocaleDateString('th-TH')`.
- CommandDialog already accepts title (`Command Palette`) and description (`Search for a command to run...`).
- CollectionCardButton already accepts title (`View`) or children.
- TanstackTableBody already accepts emptyMessage (`No data`).
- Upload Button/Description retain their existing children override path; native accessible names/placeholder props elsewhere are forwarded as before.
- Toaster forwards Sonner's `containerAriaLabel` and `toastOptions.closeButtonAriaLabel`. Toast title/description/action/cancel copy is supplied by the caller. Browser-native controls and errors emitted by third-party libraries are not hardcoded UI-kit text; applications should translate surfaced validation/error messages.

## Hardcoded-text inventory

Reviewed every file in `packages/ui/src/components/primitives` with text/attribute searches and a TypeScript JSX text scan. All kit-owned visible or accessible English found is covered above:

- filter.tsx: Filter, Apply Filters, Reset All, Apply.
- dialog.tsx / sheet.tsx: Close; sidebar.tsx: Sidebar, Displays the mobile sidebar., Toggle Sidebar.
- pagination.tsx: pagination, Go to previous page, Go to next page, More pages, Show, Page, of.
- breadcrumb.tsx: breadcrumb, More.
- collection-card.tsx: items, View.
- combobox.tsx: Please select item, Search item..., No framework found.
- select.tsx: No items; command.tsx: Command Palette, Search for a command to run....
- file-preview.tsx: Pending, Completed, Failed (including fallback).
- drop-zone.tsx: Accepts; between / and; at least; less than; English conjunctions from Intl.ListFormat('en'); Upload a file / Upload files; Click to upload; or drag and drop PNG, JPG, GIF (max. 2MB).
- tanstack-table.tsx: No data; color-picker.tsx: Mode.
- calendar.tsx: browser-default month formatting and DayPicker-provided text; date-picker.tsx: browser-locale date display (both have locale/formatter overrides as described).

Not translatable UI copy: provider/context developer errors (including Combobox's wrong-trigger exception), console-only EyeDropper failure, CSS/state/data-slot values, status enum keys, MIME types and technical color formats HEX/RGB/CSS/HSL. These remain unchanged. The dead commented-out upload implementation containing “Unsupported file type” was removed; it was not rendered.

## Small fixes

Filter keeps its desktop minimum width but caps its width to the viewport minus 2rem and lets its two internal columns shrink on phones. Mobile Sidebar records the actual opening SidebarTrigger (or keyboard-shortcut target) and restores focus when its sheet closes; an inner closing SidebarTrigger does not replace the opener. Desktop collapse behavior and the default hidden mobile sheet close button are unchanged. FilePreviewStatus now recomputes when status or labels change; its previous memo dependencies could leave stale text after rerender.
