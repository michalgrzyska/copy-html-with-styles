import { Sidebar } from "../sidebar/sidebar.js";

export class OptionsForm {
  includeColor = false;
  includeClass = false;
  includeId = false;

  constructor(private readonly sidebar: Sidebar) {
    this.listenToCheckbox("includeColorStyles", (checked) => {
      this.includeColor = checked;
      this.sidebar.updateElementHtml();
    });

    this.listenToCheckbox("includeClasses", (checked) => {
      this.includeClass = checked;
      this.sidebar.updateElementHtml();
    });

    this.listenToCheckbox("includeIds", (checked) => {
      this.includeId = checked;
      this.sidebar.updateElementHtml();
    });
  }

  private listenToCheckbox(id: string, callback: (checked: boolean) => void): void {
    const checkbox = document.getElementById(id)!;

    checkbox.addEventListener("change", (event) => {
      const target = event.target as HTMLInputElement;
      callback(target.checked);
    });
  }
}
