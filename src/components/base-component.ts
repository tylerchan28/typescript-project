export const something = '...';

export default abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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