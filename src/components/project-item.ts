import Component from "./base-component.js";
import { Autobind } from "../decorators/Autobind.js";
import { Draggable } from "../models/drag-drop.js";
import { Project } from "../models/project.js";

export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
    private project: Project;

    get people() {
        if (this.project.people === 1) {
            return "1 person";
        } else {
            return `${this.project.people} people`
        }
    }

    constructor(hostId: string, project: Project) {
        super("single-project", hostId, false, project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    @Autobind
    dragStartHandler(event: DragEvent) {
        // dataTransfer(identifier of format, data) is available on events (can be null so add !)
        // only need to transfer id because can fetch all data from it
        event.dataTransfer!.setData("text/plain", this.project.id)
        // controls what cursor looks like and tells browser you want to move something (not copy)
        event.dataTransfer!.effectAllowed = "move";
    }

    // Will always fire when a drop has been successful, so must add
    dragEndHandler(_: DragEvent) {}

    configure() {
        this.element.addEventListener("dragstart", this.dragStartHandler);
        this.element.addEventListener("dragend", this.dragEndHandler);
    }

    renderContent() {
        this.element.querySelector("h2")!.textContent = this.project.title;
        this.element.querySelector("h3")!.textContent = this.people + " assigned";
        this.element.querySelector("p")!.textContent = this.project.description;
    }
}