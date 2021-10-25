import { Project, ProjectStatus } from "../models/project";

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

export class ProjectState extends State<Project> {
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
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((project) => projectId === project.id);
    // If check to avoid unnecessary rerendering when dropping in same area
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (let listenerFn of this.listeners) {
      // Slice to return a copy of the array
      listenerFn(this.projects.slice());
    }
  }
}

// Global constant that can be used anywhere in file (can access the private projects array)
// Static, so don't have to initialize with new and always working with same instance
export const projectState = ProjectState.getInstance();
