import {globalEventBus} from '../../utils/eventbus.js';
import {API} from '../../utils/api.js';
import {OK_CODE} from '../../utils/codes.js';


/**
 *  Модель страницы актера
 */

export default class ActorModel {
    /**
     * Конструктор
     */
    constructor() {
        this.getActorData = this.getActorData.bind(this);
        this.logout = this.logout.bind(this);

        globalEventBus.on('get actor data', this.getActorData);
        globalEventBus.on('logout clicked', this.logout);
    }

    /**
     * Получение информации об актере
     * @param {int} id - id актера
     */
    getActorData(id) {
        /*
        API.getActorData(id)
            .then((res) => {
                API.getUser()
                    .then((authRes) => {
                        globalEventBus.emit('set actor data',
                            {...res.data, 'isAuthorized': authRes.status === OK_CODE});
                    });
            });
        */
        const data = {
            name: 'Боб Одинкёрк',
            biography: 'Родился, ..., снимается в фильмах и сериалах',
            birthdate: '22 октября, 1962',
            origin: 'Напервилль, Иллинойс, США',
            genres: [
                'комедия',
                'драма',
                'мультфильм',
            ],
            movies_count: 187,
            movies_rating: 10,
            movies: [
                {
                    title: 'Никто (2021)',
                    url: '',
                    rating: 7.5,
                },
                {
                    title: 'Отмена (сериал, 2019)',
                    url: '',
                    rating: 7.6,
                },
                {
                    title: 'Маленькие женщины (2019)',
                    url: '',
                    rating: 7.6,
                },
            ],
        };
        globalEventBus.emit('set actor data', data);
    }

    /**
     * Выход со страницы
     */
    logout() {
        API.logout()
            .then((res) => {
                globalEventBus.emit('logout status', res.status === OK_CODE);
            });
    }
}

