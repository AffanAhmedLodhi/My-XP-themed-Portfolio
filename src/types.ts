import React from 'react';

export interface AppConfig {
  id: string;
  title: string;
  iconComp: React.ReactNode;
  component: React.ReactNode;
  size: { w: number; h: number };
  defaultPos?: { x: number; y: number };
  hasMenu: boolean;
  hasToolbar: boolean;
  status: string;
}

export interface WindowApp extends AppConfig {
  // Added 'MAXIMIZED' to the state type
  state: 'OPEN' | 'MINIMIZED' | 'MAXIMIZED';
}

export interface AppDefinitions {
  [key: string]: AppConfig;
}

export type SystemState = 'BOOT' | 'LOGIN' | 'DESKTOP' | 'SHUTDOWN';