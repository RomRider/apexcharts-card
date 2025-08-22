/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LitElement,
} from "lit";
import {
  LovelaceCardEditor,
  LovelaceCard,
} from "custom-card-helpers";


import { BoilerplateCardConfig } from "./types";
import { customElement, state } from "lit/decorators.js";

@customElement("apexcharts-card-editor")
export class ApexchartsCardCardEditor extends LitElement {
  @state() private _config?: BoilerplateCardConfig;
  @state() private _helpers?: any;

  public setConfig(config: BoilerplateCardConfig): void {
    this._config = config;

    this.loadCardHelpers();
  }

  private async loadCardHelpers(): Promise<void> {
    this._helpers = await (window as any).loadCardHelpers();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "apexcharts-card-editor": LovelaceCardEditor;
    "hui-error-card": LovelaceCard;
  }
}