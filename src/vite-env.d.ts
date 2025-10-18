/// <reference types="vite/client" />

// Type declaration for cypress-mochawesome-reporter plugin
declare module 'cypress-mochawesome-reporter/plugin.js' {
  import { PluginEvents } from 'cypress';
  function cypressOnRun(on: PluginEvents): void;
  export = cypressOnRun;
}
