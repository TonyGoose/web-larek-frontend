export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {}

    // Переключить класс
    toggleClass(element: HTMLElement, className: string, force?: boolean): void {
        if (element) {
            element.classList.toggle(className, force);
        } else {
            console.warn('Element not found for toggleClass');
        }
    }

    // Установить текстовое содержимое
    protected setText(element: HTMLElement | null, value: unknown): void {
        if (element && value !== undefined) {
            element.textContent = String(value);
        } else {
            console.warn('Element not found or value is undefined for setText');
        }
    }

    // Сменить статус блокировки
    setDisabled(element: HTMLElement | null, state: boolean): void {
        if (element) {
            if (state) {
                element.setAttribute('disabled', 'disabled');
            } else {
                element.removeAttribute('disabled');
            }
        } else {
            console.warn('Element not found for setDisabled');
        }
    }

    // Установить изображение с алтернативным текстом
    protected setImage(element: HTMLImageElement | null, src: string, alt?: string): void {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        } else {
            console.warn('Element not found for setImage');
        }
    }

    // Вернуть корневой DOM-элемент
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this, data ?? {});
        return this.container;
    }
}
