import { Sidebar } from "../sidebar/sidebar.js";

export class OptionsForm {
    private readonly checkboxes: HTMLElement[] = [];

    includeColor = false;
    includeClass = false;
    includeId = false;
    includeComments = false;
    includeOthers = false;

    constructor(private readonly sidebar: Sidebar) {
        this.listenToCheckbox("includeColorStyles", (checked) => {
            this.includeColor = checked;
        });

        this.listenToCheckbox("includeClasses", (checked) => {
            this.includeClass = checked;
        });

        this.listenToCheckbox("includeIds", (checked) => {
            this.includeId = checked;
        });

        this.listenToCheckbox("includeComments", (checked) => {
            this.includeComments = checked;
        });

        this.listenToCheckbox("includeOthers", (checked) => {
            this.includeOthers = checked;
        });

        this.setupSelectAllCheckbox();
    }

    private listenToCheckbox(id: string, callback: (checked: boolean) => void): void {
        const checkbox = document.getElementById(id)!;
        this.checkboxes.push(checkbox);

        checkbox.addEventListener("change", (event) => {
            const target = event.target as HTMLInputElement;
            callback(target.checked);
            this.sidebar.updateElementHtml();
        });
    }

    private setupSelectAllCheckbox(): void {
        const selectAllCheckbox = document.getElementById("selectAll")! as HTMLInputElement;

        selectAllCheckbox.addEventListener("change", (event) => {
            const target = event.target as HTMLInputElement;

            this.checkboxes.forEach((checkbox) => {
                (checkbox as HTMLInputElement).checked = target.checked;
            });

            this.includeColor = target.checked;
            this.includeClass = target.checked;
            this.includeId = target.checked;
            this.includeComments = target.checked;
            this.includeOthers = target.checked;

            this.sidebar.updateElementHtml();
        });
    }
}
