import {globalEventBus} from '../../utils/eventbus.js';
import BaseView from '../baseView.js';
import {globalRouter} from '../../utils/router.js';
import {PATHS} from '../../utils/paths.js';
import {getFormValues} from '../../utils/formDataWork.js';
import {OK_CODE, BAD_REQUEST, UNAUTHORIZED, INTERNAL_SERVER_ERROR} from '../../utils/codes.js';
import {setListenersForHidingValidationError} from '../../utils/setValidationResult.js';
import {INCORRECT_DATA, INCORRECT_LOGIN, SERVER_ERROR} from '../../utils/errorMessages.js';
import {busEvents} from '../../utils/busEvents.js';
import './login.tmpl.js';

/**
 * Представление страницы логина
 */
export default class LoginView extends BaseView {
    /**
     * Конструктор
     * @param {Element} parent - элемент для рендера
     */
    constructor(parent) {
        // eslint-disable-next-line no-undef
        super(parent, Handlebars.templates['login.hbs']);

        globalEventBus.on(busEvents.LOGIN_STATUS, this.processLoginAttempt.bind(this));
        globalEventBus.on(busEvents.LOAD_LOGIN_PAGE, this.setLoginPage.bind(this));

        this.formSubmittedCallback = this.formSubmitted.bind(this);
    }

    /**
     * Проверка, если пользователь уже авторизован
     */
    render() {
        globalEventBus.emit(busEvents.CHECK_AUTH_REDIRECT_LOGIN);
    }

    /**
     * Запуск рендера и установка колбеков
     */
    setLoginPage() {
        super.render();
        this.setEventListeners();
    }

    /**
     * "Деструктор" страницы
     */
    hide() {
        this.removeEventListeners();
    }

    /**
     * Установка колбеков
     */
    setEventListeners() {
        document.getElementById('login').addEventListener('submit', this.formSubmittedCallback);
        setListenersForHidingValidationError();
    }

    /**
     * Удаление колбеков
     */
    removeEventListeners() {
        document.getElementById('login').removeEventListener('submit', this.formSubmittedCallback);
    }

    /**
     * Обработка отправки формы
     * @param {Object} event - событие отправки формы
     */
    formSubmitted(event) {
        event.preventDefault();
        globalEventBus.emit(busEvents.LOGIN_CLICKED, getFormValues(event.target));
    }

    /**
     * Проверка статуса запроса на вход
     * @param {number} status - статус запроса
     */
    processLoginAttempt(status) {
        if (status === OK_CODE) {
            globalRouter.pushState(PATHS.profile);
        } else {
            const errors = {
                [BAD_REQUEST]: INCORRECT_DATA,
                [UNAUTHORIZED]: INCORRECT_LOGIN,
                [INTERNAL_SERVER_ERROR]: SERVER_ERROR,
            };
            document.getElementById('validation-hint-login').innerText = errors[status];
        }
    }
}
