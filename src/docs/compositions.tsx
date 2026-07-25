/**
 * Live preview registry for blocks & templates — the React side of the
 * pure-data compositions in ./content/compositions.ts, joined by slug.
 * Source strings come from Vite ?raw imports so the "copy code" panel and
 * the shadcn registry stay the single source of truth (the file itself).
 */
import type { ComponentType } from 'react';

import { StatsRow } from '@/blocks/stats-row';
import { TrendPanel } from '@/blocks/trend-panel';
import { TableView } from '@/blocks/table-view';
import { ActivityPanel } from '@/blocks/activity-panel';
import { MeterPanel } from '@/blocks/meter-panel';
import { EmptyScreen } from '@/blocks/empty-screen';
import { DashboardHeader } from '@/blocks/dashboard-header';
import { ErpDashboard } from '@/templates/erp-dashboard';
import { CrmPipeline } from '@/templates/crm-pipeline';
import { PosTerminal } from '@/templates/pos-terminal';
import { SettingsAccount } from '@/templates/settings-account';
import { AiControlCenter } from '@/templates/ai-control-center';
import { AuthSignIn } from '@/templates/auth-sign-in';
import { AuthSignUp } from '@/templates/auth-sign-up';
import { AuthForgot } from '@/templates/auth-forgot';
import { AuthReset } from '@/templates/auth-reset';
import { AuthVerify } from '@/templates/auth-verify';
import { AuthInvite } from '@/templates/auth-invite';

import statsRowSrc from '@/blocks/stats-row.tsx?raw';
import trendPanelSrc from '@/blocks/trend-panel.tsx?raw';
import tableViewSrc from '@/blocks/table-view.tsx?raw';
import activityPanelSrc from '@/blocks/activity-panel.tsx?raw';
import meterPanelSrc from '@/blocks/meter-panel.tsx?raw';
import emptyScreenSrc from '@/blocks/empty-screen.tsx?raw';
import dashboardHeaderSrc from '@/blocks/dashboard-header.tsx?raw';
import erpDashboardSrc from '@/templates/erp-dashboard.tsx?raw';
import crmPipelineSrc from '@/templates/crm-pipeline.tsx?raw';
import posTerminalSrc from '@/templates/pos-terminal.tsx?raw';
import settingsAccountSrc from '@/templates/settings-account.tsx?raw';
import aiControlCenterSrc from '@/templates/ai-control-center.tsx?raw';
import authSignInSrc from '@/templates/auth-sign-in.tsx?raw';
import authSignUpSrc from '@/templates/auth-sign-up.tsx?raw';
import authForgotSrc from '@/templates/auth-forgot.tsx?raw';
import authResetSrc from '@/templates/auth-reset.tsx?raw';
import authVerifySrc from '@/templates/auth-verify.tsx?raw';
import authInviteSrc from '@/templates/auth-invite.tsx?raw';

export interface CompositionRender {
  Component: ComponentType;
  source: string;
}

export const compositionRender: Record<string, CompositionRender> = {
  'stats-row': { Component: StatsRow, source: statsRowSrc },
  'trend-panel': { Component: TrendPanel, source: trendPanelSrc },
  'table-view': { Component: TableView, source: tableViewSrc },
  'activity-panel': { Component: ActivityPanel, source: activityPanelSrc },
  'meter-panel': { Component: MeterPanel, source: meterPanelSrc },
  'empty-screen': { Component: EmptyScreen, source: emptyScreenSrc },
  'dashboard-header': { Component: DashboardHeader, source: dashboardHeaderSrc },
  'erp-dashboard': { Component: ErpDashboard, source: erpDashboardSrc },
  'crm-pipeline': { Component: CrmPipeline, source: crmPipelineSrc },
  'pos-terminal': { Component: PosTerminal, source: posTerminalSrc },
  'settings-account': { Component: SettingsAccount, source: settingsAccountSrc },
  'ai-control-center': { Component: AiControlCenter, source: aiControlCenterSrc },
  'auth-sign-in': { Component: AuthSignIn, source: authSignInSrc },
  'auth-sign-up': { Component: AuthSignUp, source: authSignUpSrc },
  'auth-forgot': { Component: AuthForgot, source: authForgotSrc },
  'auth-reset': { Component: AuthReset, source: authResetSrc },
  'auth-verify': { Component: AuthVerify, source: authVerifySrc },
  'auth-invite': { Component: AuthInvite, source: authInviteSrc },
};
