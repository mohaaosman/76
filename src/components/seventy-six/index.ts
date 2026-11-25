/**
 * 76° — Seventy Six Degrees · component barrel.
 * One component per widget type: the taxonomy is the component API.
 */
export { Band, BandTopbar, BandNav, BandSubTabs, PageHero } from './band';
export type { BandNavItem, PageHeroProps } from './band';
export { Plate, PlateHead } from './plate';
export type { PlateProps, PlateHeadProps } from './plate';
export { Split } from './split';
export type { SplitProps } from './split';
export { Sheet, Row } from './sheet';
export { Card, CardHead } from './card';
export { StatS1, Delta } from './stat-s1';
export type { StatS1Props, DeltaProps } from './stat-s1';
export { Progress } from './progress';
export { Trend, Sparkline } from './trend';
export type { TrendSeries, TrendColumn, SparklineProps } from './trend';
export { MeterList } from './meter-list';
export type { MeterItem } from './meter-list';
export { DistributionStrip } from './distribution-strip';
export type { DistributionPart, DistributionStripProps } from './distribution-strip';
export { DataTable, SelectionHead, FilterLine, FilterBar } from './data-table';
export type { Column, SelectionHeadProps, FilterLineProps, FilterBarProps, ActiveFilter, SavedView, RowSync } from './data-table';
export { CardTabs } from './card-tabs';
export type { CardTab } from './card-tabs';
export { Tabs, TabPanel } from './tabs';
export type { Tab, TabsProps, TabPanelProps } from './tabs';
export { Stepper } from './stepper';
export type { Step, StepperProps } from './stepper';
export { TreeList } from './tree-list';
export type { TreeNode, TreeListProps } from './tree-list';
export { Timeline } from './timeline';
export type { TimelineItem, TimelineTone, TimelineProps } from './timeline';
export { ActivityList } from './activity-list';
export type { ActivityItem } from './activity-list';
export { Button, ButtonLink } from './button';
export type { ButtonProps, ButtonVariant } from './button';
export { StatusWord } from './status-word';
export type { StatusTone } from './status-word';
export { Field, Select, Checkbox, Radio, Toggle } from './field';
export { SearchField } from './search-field';
export type { SearchFieldProps } from './search-field';
export { FileField } from './file-field';
export type { FileRow, FileStatus, FileFieldProps } from './file-field';
export { NumberField } from './number-field';
export type { NumberFieldProps } from './number-field';
export { Slider } from './slider';
export type { SliderProps } from './slider';
export { DateRangeField, presetRange } from './date-range-field';
export type { DateRange, DateRangePreset, DateRangeFieldProps } from './date-range-field';
export { PinField } from './pin-field';
export type { PinFieldProps, PinCharset } from './pin-field';
export { SocialButton } from './social-button';
export type { SocialButtonProps, SocialProvider } from './social-button';
export { Combobox } from './combobox';
export type { ComboOption, ComboboxProps } from './combobox';
export { MenuButton, SplitButton } from './menu';
export type { MenuItem, MenuItemSpec, MenuButtonProps, SplitButtonProps } from './menu';
export { Popover } from './popover';
export type { PopoverProps } from './popover';
export { CodeBlock } from './code-block';
export type { CodeBlockProps } from './code-block';
export { Dialog } from './dialog';
export { Drawer } from './drawer';
export type { DrawerProps } from './drawer';
export { ToastProvider, useToast } from './toast';
export type { NotifyOptions, ToastTone } from './toast';
export { Banner } from './banner';
export type { BannerProps, BannerTone } from './banner';
export { Badge } from './badge';
export type { BadgeProps } from './badge';
export { Accordion } from './accordion';
export type { AccordionProps, AccordionSection } from './accordion';
export { DescriptionList } from './description-list';
export type { DescriptionListProps, DescriptionRow } from './description-list';
export { Divider } from './divider';
export type { DividerProps } from './divider';
export { Avatar, AvatarGroup } from './avatar';
export type { AvatarProps, AvatarGroupProps } from './avatar';
export { Spinner, Busy } from './spinner';
export type { SpinnerProps, BusyProps } from './spinner';
export { Kbd } from './kbd';
export type { KbdProps } from './kbd';
/* v0.6 · the promises already made. B11 has required a top-of-form error
   summary since v0.1.0 and the barrel never carried one. */
export { ErrorSummary } from './error-summary';
export type { ErrorSummaryProps, FieldError } from './error-summary';

export { Prose } from './prose';
export type { ProseProps } from './prose';

/* v0.5 · the public surface. These five set the display steps, and firewall
   rule 17 keeps those steps here — a product screen imports none of them. */
export { Masthead } from './masthead';
export type { MastheadProps } from './masthead';
export { FeatureList } from './feature-list';
export type { FeatureItem, FeatureListProps } from './feature-list';
export { CallToAction } from './cta';
export type { CallToActionProps } from './cta';
export { ProofRow } from './proof-row';
export type { ProofItem, ProofRowProps } from './proof-row';
/* v0.8 · the cover. The public surface's editorial furniture: the contents
   strip and the caption line under a specimen. */
export { IndexRow } from './index-row';
export type { IndexItem, IndexRowProps } from './index-row';
export { CaptionRow } from './caption-row';
export type { CaptionRowProps } from './caption-row';

export { SiteFooter } from './site-footer';
export type { FooterGroup, FooterLink, SiteFooterProps } from './site-footer';

export { EmptyState } from './empty-state';
export { SearchCommand, useSearchCommand } from './search-command';
export type { CommandItem } from './search-command';
export { Skeleton, SkeletonGate } from './skeleton';
export { Tooltip } from './tooltip';

/* v0.7 · B44's arithmetic sibling. B44 divides ONE total into its shares;
   SumList builds ONE total from its lines. */
export { SumList } from './sum-list';
export type { SumListProps, SumRow } from './sum-list';

/* v0.10 · the 0.7 surface — posting the work. A reader becomes a writer:
   type a bounded number into every line, take one identifier at a time,
   and state what became of the job the reader started. */
export { EntryTable } from './entry-table';
export type { EntryColumn, EntryTotalsRow, EntrySync, EntryTableProps } from './entry-table';
export { ScanField } from './scan-field';
export type { ScanFieldProps, ScanResult, ScanTone } from './scan-field';
export { JobList } from './job-list';
export type { Job, JobState, JobListProps } from './job-list';

/* v0.10 · the 0.8 surface — the number in relation: a hierarchy that rolls
   up, a second dimension, and a total that narrows step by step. */
export { TreeTable } from './tree-table';
export type { TreeTableColumn, TreeTableNode, TreeTableTotal, TreeTableProps } from './tree-table';
export { CrossTable } from './cross-table';
export type { CrossAxisItem, CrossTableProps } from './cross-table';
export { FunnelList } from './funnel-list';
export type { FunnelStep, FunnelListProps } from './funnel-list';

/* v0.10 · the 0.9 surface — the record and the console. */
export { MessageThread } from './message-thread';
export type { MessageThreadProps, ThreadMessage, ThreadAttachment, MessageDirection } from './message-thread';
export { SettingList } from './setting-list';
export type { SettingListProps, SettingRow, SettingControl } from './setting-list';

/* v0.10 · the language layer. Every built-in word, every direction. */
export {
  LocaleProvider,
  useStrings,
  useLocale,
  useDirection,
  useFormat,
  useNounFor,
  createFormatters,
  directionOf,
  inlineStep,
  catalogs,
  localeNames,
} from '@/lib/i18n';
export type { SvMessages, Direction, Formatters, ShippedLocale, LocaleProviderProps } from '@/lib/i18n';
