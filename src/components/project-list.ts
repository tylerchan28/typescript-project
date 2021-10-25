import Component from "./base-component.js";
import { ProjectItem } from "./project-item.js";
import { Autobind } from "../decorators/Autobind.js";
import { DragTarget } from "../models/drag-drop.js";
import { Project, ProjectStatus } from "../models/project.js";
import { projectState } from "../state/project-state.js";

export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: Project[];
    
    constructor(private type: "active" | "finished") {
        super("project-list", "app", false, `${type}-projects`);
        this.assignedProjects = [];
        // Targeting the section element to render
        // More than one type of ProjectList
        this.configure();
        this.renderContent();
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listEl.innerHTML = "";
        for (const project of this.assignedProjects) {
            new ProjectItem(this.element.querySelector("ul")!.id, project);
        }
    }

    @Autobind
    dragOverHandler(event: DragEvent) {
        // Make sure only plain text can be dropped
        if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
            // Default is to prevent a drop, so use this method to allow it
            event.preventDefault();
            const listEl = this.element.querySelector("ul")!;
            listEl.classList.add("droppable")
        }
    }

    @Autobind
    dropHandler(event: DragEvent) {
        const projectId = event.dataTransfer!.getData("text/plain");
        // Using the type of list from constructor, set the project status
        projectState.moveProject(projectId, this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished)
    }

    @Autobind
    dragLeaveHandler(_: DragEvent) {
        const listEl = this.element.querySelector("ul")!;
        listEl.classList.remove("droppable");
    }    

    configure() {
        this.element.addEventListener("dragover", this.dragOverHandler);
        this.element.addEventListener("dragleave", this.dragLeaveHandler);
        this.element.addEventListener("drop", this.dropHandler);
        projectState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter((project: Project) => {
                if (this.type === "active") {
                    return project.status === ProjectStatus.Active;
                } else {
                    return project.status === ProjectStatus.Finished;
                }
            })
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        })
    }

    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul")!.id = listId;
        this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS"
    }
}