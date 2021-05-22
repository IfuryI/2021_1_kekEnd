import {Component} from './component';
import 'partials/playlistTabs.tmpl';
import 'partials/playlistTab.tmpl';
import {CREATED, ENTER_KEYCODE, OK_CODE} from 'utils/codes';
import {API} from 'utils/api';

/**
 * Компонент "Плейлист"
 */
export class PlaylistTabs extends Component {
    /**
     * Конструктор компонента
     * @param {Object} parent - родитель компонента
     * @param {Object} state - перечиление полей-состояний компонента
     */
    constructor(parent, state) {
        super(parent, state);
        // eslint-disable-next-line no-undef
        this.renderHBS = Handlebars.templates['playlistTabs.hbs'];
        // eslint-disable-next-line no-undef
        this.renderNewTabHBS = Handlebars.templates['playlistTab.hbs'];
        this.createPlaylistClickedCallback = this.createPlaylistClicked.bind(this);
        this.createPlaylistCallback = this.createPlaylist.bind(this);
        this.enterPressedCallback = this.enterPressed.bind(this);
        this.removeCreationCallback = this.removeCreationForm.bind(this);
        this.deleteMovieClickedCallback = this.deleteMovieClicked.bind(this);
    }

    /**
     * HTML-код компонента
     * @return {string} - html-код
     */
    tmpl() {
        return this.renderHBS(this.state);
    }

    /**
     * Установить листенеры компоненту
     */
    setEventListeners() {
        document.getElementById('create-playlist-button')
            ?.addEventListener('click', this.createPlaylistClickedCallback);
        [...document.getElementsByClassName('tab__delete-button')]
            .forEach((el) => el.addEventListener('click', this.deleteMovieClickedCallback));
    }

    /**
     * Убрать листенеры компонента
     */
    removeEventListeners() {
        document.getElementById('create-playlist-button')
            ?.addEventListener('click', this.createPlaylistClickedCallback);
        [...document.getElementsByClassName('tab__delete-button')]
            .forEach((el) => el.removeEventListener('click', this.deleteMovieClickedCallback));
        // если была нажата кнопка "Создать плейлист"
        if (document.getElementById('submit-create-playlist')) {
            this.removeCreationForm();
        }
    }

    /**
     * Обработка нажатия на кнопку "Создать плейлист"
     */
    createPlaylistClicked() {
        document.getElementById('create-playlist-container')
            .classList.remove('create-playlist-container_hidden');
        document.getElementById('submit-create-playlist')
            .addEventListener('click', this.createPlaylistCallback);
        document.getElementById('input-create-playlist')
            .addEventListener('keyup', this.enterPressedCallback);
        document.getElementById('cancel-create-playlist')
            .addEventListener('click', this.removeCreationCallback);
    }

    /**
     * Убрать форму создания плейлиста
     */
    removeCreationForm() {
        document.getElementById('create-playlist-container')
            .classList.add('create-playlist-container_hidden');
        document.getElementById('submit-create-playlist')
            .removeEventListener('click', this.createPlaylistCallback);
        document.getElementById('input-create-playlist')
            .removeEventListener('keyup', this.enterPressedCallback);
        document.getElementById('cancel-create-playlist')
            .removeEventListener('click', this.removeCreationCallback);
    }

    /**
     * Отправка запроса на создание плейлиста
     */
    createPlaylist() {
        const playlistName = document.getElementById('input-create-playlist').value;
        API.createPlaylist(playlistName).then((res) => this.processCreate(res.status === CREATED, playlistName));
    }

    /**
     * Отображение результата создания плейлиста
     * @param {boolean} status - успешность запроса
     * @param {string} playlistName - имя созданного плейлиста
     */
    processCreate(status, playlistName) {
        if (status) {
            const tabs = document.getElementById('tabs');
            tabs.insertAdjacentHTML('beforeend', this.renderNewTabHBS({
                id: tabs.childElementCount + 1,
                playlist_name: playlistName,
            }));
            document.getElementById('no-playlists-message')?.remove();
            document.getElementById('input-create-playlist').value = '';
            this.removeCreationForm();
        }
    }

    /**
     * Обработка нажатия на кнопку удаления фильма из плейлиста
     * @param {Object} event - событие нажатия на кнопку
     */
    deleteMovieClicked(event) {
        event.preventDefault();
        event.stopPropagation();
        const button = event.target.parentElement;
        const playlistId = button.getAttribute('data-playlist-id');
        const movieId = button.getAttribute('data-movie-id');
        API.deleteMovieFromPlaylist(playlistId, movieId).then((res) => this.processDeletion(
            res.status === OK_CODE, button.closest('.tab__content-link'),
        ));
    }

    /**
     * Отображение результата удаления фильма
     * @param {boolean} status - статус запроса
     * @param {Object} row - строка, которую нужно убрать из DOM
     */
    processDeletion(status, row) {
        row.remove();
    }

    /**
     * Обработка нажатия Enter в строке создания плейлиста
     * @param {Object} event - объект события
     */
    enterPressed(event) {
        if (event.keyCode === ENTER_KEYCODE) {
            this.createPlaylistCallback();
        }
    }
}
