import {globalEventBus} from '../../utils/eventbus';
import {globalRouter} from '../../utils/router';
import {PATHS} from '../../utils/paths';
import BaseView from '../baseView';
import './moviesList.tmpl';
import {busEvents} from '../../utils/busEvents';

/**
 * Представление страницы списка фильмов
 */
export default class MoviesListView extends BaseView {
    /**
     * Конструктор
     * @param {Element} parent - элемент для рендера
     */
    constructor(parent) {
        // eslint-disable-next-line no-undef
        super(parent, Handlebars.templates['moviesList.hbs']);

        globalEventBus.on(busEvents.SET_MOVIES_PAGE, this.setMovies.bind(this));
        globalEventBus.on(busEvents.LOGOUT_STATUS, this.processLogout.bind(this));

        this.watchedClickedCallback = this.watchedClicked.bind(this);
        this.playlistClickedCallback = this.playlistClicked.bind(this);
        this.logoutClickedCallback = this.logoutClicked.bind(this);
    }

    /**
     * Открытие нужной страницы в зависимости от параметров
     * @param {Object} params - параметры страницы
     */
    render(params) {
        const [category, page, query] = params.split('/');
        if (category === 'best') {
            globalEventBus.emit(busEvents.GET_BEST_MOVIES_PAGE, page);
            return;
        }
        if (category === 'genre') {
            const genres = query.slice('?filter='.length).split('+');
            globalEventBus.emit(busEvents.GET_GENRE_MOVIES_PAGE, genres, page);
        }
    }

    /**
     * "Деструктор" страницы
     */
    hide() {
        super.hide(this);
    }

    /**
     * Запуск рендера и подписки на события
     * @param {Object} data - данные о списке фильмов
     */
    setMovies(data) {
        super.render(data);
        this.setEventListeners();
    }

    /**
     * Установка колбеков
     */
    setEventListeners() {
        document.getElementById('logout-button')?.addEventListener('click', this.logoutClickedCallback);
    }

    /**
     * Удаление колбеков
     */
    removeEventListeners() {
        document.getElementById('logout-button')?.removeEventListener('click', this.logoutClickedCallback);
    }

    /**
     * Обработчик нажатия на кнопку "Просмотрено"
     */
    watchedClicked() {
        // TODO: api request
        console.log('watched clicked');
    }

    /**
     * Обработчик нажатия на кнопку "Лайк"
     */
    playlistClicked() {
        // TODO: api request
        console.log('add to playlist clicked');
    }

    /**
     * Обработка нажатия на логаут
     */
    logoutClicked() {
        globalEventBus.emit(busEvents.LOGOUT_CLICKED);
    }

    /**
     * Выход со страницы
     * @param {boolean} status - статус запроса на выход
     */
    processLogout(status) {
        if (status) {
            globalRouter.pushState(PATHS.login);
        }
    }
}

