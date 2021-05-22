import BaseView from '../baseView';
import {globalEventBus} from 'utils/eventbus';
import {busEvents} from 'utils/busEvents';
import './search.tmpl';
import {Navbar} from 'components/navbar';
import {userMeta} from 'utils/userMeta';

/**
 * Представление страницы поиска
 */
export default class SearchView extends BaseView {
    /**
     * Конструктор
     * @param {Element} parent - элемент для рендера
     */
    constructor(parent) {
        // eslint-disable-next-line no-undef
        super(parent, Handlebars.templates['search.hbs']);

        globalEventBus.on(busEvents.SET_SEARCH_RESULTS, this.setSearchResults.bind(this));
    }

    /**
     * Открытие поисковых результатов по параметру
     * @param {Object} params - параметры страницы
     */
    render(params) {
        globalEventBus.emit(busEvents.GET_SEARCH_RESULTS, params.slice('q='.length).replace('+', ' '));
    }

    /**
     * "Деструктор" страницы
     */
    hide() {
        super.hide(this);
    }

    /**
     * Запуск рендера и подписки на события
     * @param {Object} data - поисковая выдача
     */
    setSearchResults(data) {
        super.render(data);

        this.navbarComponent = new Navbar(document.getElementById('navbar'),
            {'authorized': userMeta.getAuthorized()});
        this.navbarComponent.render();

        // сохраняем поисковой запрос
        document.getElementById('search-input').value = decodeURI(data.query);

        this.setEventListeners();
    }

    /**
     * Установка колбеков
     */
    setEventListeners() {
        this.navbarComponent.setEventListeners();
    }

    /**
     * Удаление колбеков
     */
    removeEventListeners() {
        this.navbarComponent.removeEventListeners();
    }
}
