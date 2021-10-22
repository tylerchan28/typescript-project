// Project Type
enum ProjectStatus { Active, Finished }

class Project {
    constructor(
        public id: string, 
        public title: string, 
        public description: string, 
        public people: number, 
        public status: ProjectStatus 
    ) {}
}

// Project State Management
type Listener<T> = (items: T[]) => void;

class State<T> {
    protected listeners: Listener<T>[] = [];
    
    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
    }
}

class ProjectState extends State<Project> {
    // Loop through whenever something changes
    private projects: any[] = [];
    private static instance: ProjectState;

    // Private constructor takes away "new" keyword but allows you to use "factory functions"
    private constructor() {
        super();
    }

    // Static allows to use without instantiating the class first (no need for a constructor)
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active)
        this.projects.push(newProject);
        for (let listenerFn of this.listeners) {
            // Slice to return a copy of the array
            listenerFn(this.projects.slice());
        }
    }
}

// Global constant that can be used anywhere in file (can access the private projects array)
// Static, so don't have to initialize with new and always working with same instance
const projectState = ProjectState.getInstance();

// Validation
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validatableInput: Validatable): boolean {
    let isValid = true;
    const { value, required, minLength, maxLength, min, max} = validatableInput;

    if (required) {
        isValid = isValid && value.toString().trim().length > 0;
    }
    if (minLength) {
        isValid = isValid && value.toString().length >= minLength;
    }
    if (maxLength) {
        isValid = isValid && value.toString().length <= maxLength;
    }
    if (min) {
        isValid = isValid && value >= min;
    }
    if (max) {
        isValid = isValid && value <= max
    }
    return isValid;
}

// Autobind
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjustedDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    }
    return adjustedDescriptor;
}

// Abstract so can't instantiate
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    // hostElement and element can have different types, so make a generic class
    hostElement: T;
    // This element will be rendered (section element doesn't exist, so HTMLElement)
    element: U; 

    constructor(templateId: string, hostElementId: string, position: boolean, newElementId?: string) {
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostElementId)! as T;
        const importedNode = document.importNode(this.templateElement.content, true);
        // Targeting the section element to render
        this.element = importedNode.firstElementChild as U;
        // More than one type of ProjectList
        if (newElementId) {
            this.element.id = newElementId;
        }

        this.attach(position);
    }
    
    private attach(insertAtBeginning: boolean) {
        this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend',
        this.element);
    }

    // Force inheritors to implement these (but can use own configurations)
    // Inheriting classes should call these
    abstract configure() : void;
    abstract renderContent(): void;
}

// Building based on template
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
    private project: Project;

    constructor(hostId: string, project: Project) {
        super("single-project", hostId, false, project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    configure() {}

    renderContent() {
        this.element.querySelector("h2")!.textContent = this.project.title;
        this.element.querySelector("h3")!.textContent = this.project.people.toString();
        this.element.querySelector("p")!.textContent = this.project.description;
    }

}

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
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
    
    configure() {
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

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true
        }
        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        }
        const peopleValidatable: Validatable = {
            value: enteredPeople,
            required: true,
            min: 1,
            max: 5
        }

        if (
            validate(titleValidatable) &&
            validate(descriptionValidatable) &&
            validate(peopleValidatable)
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

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");