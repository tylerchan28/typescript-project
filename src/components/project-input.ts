import Component from "./base-component";
import { Autobind } from "../decorators/Autobind";
import { projectState } from "../state/project-state";
import * as Validation from "../util/validation";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        super("project-input", "app", true, "user-input")
        this.titleInputElement = this.element.querySelector("#title")! as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector("#description")! as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector("#people")! as HTMLInputElement;
        // Built in function that gives HTML content inside template
        // True gives a deep clone (all nested elements within)
            // const importedNode = document.importNode(this.templateElement.content, true);

        // Building the template (accessing the form) after project-input div
            // this.element = importedNode.firstElementChild as HTMLFormElement;
        // Give the form an id of "user-input"
            // this.element.id = "user-input" 

        // Get access to input elements
        // Since accessing a DOM element's children, use querySelector (getElementById doesn't)
       this.configure();
    }
    
    configure() {
        this.element.addEventListener("submit", this.submitHandler)
    }

    renderContent() {}
    
    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValidatable: Validation.Validatable = {
            value: enteredTitle,
            required: true
        }
        const descriptionValidatable: Validation.Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        }
        const peopleValidatable: Validation.Validatable = {
            value: enteredPeople,
            required: true,
            min: 1,
            max: 5
        }

        if (
            Validation.validate(titleValidatable) &&
            Validation.validate(descriptionValidatable) &&
            Validation.validate(peopleValidatable)
        ) {
            return [enteredTitle, enteredDescription, +enteredPeople]
        } else {
            alert("Invalid input")
        }
    }
    
    private clearInput() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }

    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            // Add to global state
            projectState.addProject(title, desc, people);
        }
        this.clearInput();
    }
}