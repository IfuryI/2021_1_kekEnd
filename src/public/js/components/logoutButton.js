import {Component} from './component';
import {globalEventBus} from '../utils/eventbus';
import {globalRouter} from '../utils/router';
import {PATHS} from '../utils/paths';
import {busEvents} from '../utils/busEvents';

/**
 * Компонента "Кнопка 'Выход'"
 */
export class LogoutButton extends Component {
    /**
     * Конструктор кнопки
     * @param {Object} parent - родитель кнопки
     * @param {Object} state - перечиление полей-состояний компонента
     */
    constructor(parent, state) {
        super(parent, state);
        globalEventBus.on(busEvents.LOGOUT_STATUS, this.processLogout);
        this.logoutClickedCallback = this.logoutClicked.bind(this);
        this.processLogout = this.processLogout.bind(this);
    }

    /**
     * HTML-код компонента
     * @return {string} - html-код для вставки к родителю
     */
    tmpl() {
        return `
            <a id="logout-button">Выйти</a>
        `;
    }

    /**
     * Установить листенеры компоненту
     */
    setEventListeners() {
        document.getElementById('logout-button')?.addEventListener('click', this.logoutClickedCallback);
    }

    /**
     * Убрать листенеры компонента
     */
    removeEventListeners() {
        document.getElementById('logout-button')?.removeEventListener('click', this.logoutClickedCallback);
    }

    /**
     * Обработка нажатия на логаут
     * @param {Object} e - событие нажатия
     */
    logoutClicked(e) {
        e.preventDefault();
        globalEventBus.emit(busEvents.LOGOUT_CLICKED);
    }

    /**
     * Выход со страницы
     * @param {int} status - статус запроса на выход
     */
    processLogout(status) {
        if (status) {
            globalRouter.pushState(PATHS.login);
        }
    }
}
