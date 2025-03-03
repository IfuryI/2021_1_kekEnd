import {globalEventBus} from 'utils/eventbus';
import {API} from 'utils/api';
import {globalRouter} from 'utils/router';
import {PATHS} from 'utils/paths';
import {OK_CODE} from 'utils/codes';
import {AUTH_ERROR} from 'utils/errorMessages';
import {busEvents} from 'utils/busEvents';
import {userMeta} from 'utils/userMeta';

/**
 *  Модель страницы профиля
 */
export default class ProfileModel {
    /**
     * Конструктор
     */
    constructor() {
        globalEventBus.on(busEvents.GET_PROFILE_DATA, this.getProfileData.bind(this));
        globalEventBus.on(busEvents.FOLLOW_CLICKED, this.followUser.bind(this));
    }

    /**
     * Получение данных профиля
     * @param {string} username - имя пользователя
     */
    getProfileData(username) {
        const additionalData = {
            favorite_movies: [
                {
                    id: 1,
                    poster: 'https://kinopoiskapiunofficial.tech/images/posters/kp_small/300.jpg',
                },
                {
                    id: 2,
                    poster: 'https://kinopoiskapiunofficial.tech/images/posters/kp_small/301.jpg',
                },
                {
                    id: 3,
                    poster: 'https://kinopoiskapiunofficial.tech/images/posters/kp_small/302.jpg',
                },
                {
                    id: 4,
                    poster: 'https://kinopoiskapiunofficial.tech/images/posters/kp_small/303.jpg',
                },
                {
                    id: 5,
                    poster: 'https://kinopoiskapiunofficial.tech/images/posters/kp_small/304.jpg',
                },
                {
                    id: 6,
                    poster: 'https://kinopoiskapiunofficial.tech/images/posters/kp_small/305.jpg',
                },
            ],
        };

        Promise.all([API.getUser(username), API.getUserReviews(username), API.getPlaylists(username)])
            .then((responses) => {
                if (responses.some((resp) => resp.status !== OK_CODE)) {
                    throw new Error(AUTH_ERROR);
                }
                const [userData, reviews, playlists] = responses.map((resp) => resp.data);
                return {
                    ...userData,
                    ...additionalData,
                    'reviews': reviews,
                    'playlists': playlists,
                };
            })
            .then((userData) => {
                if (userMeta.getAuthorized() && username !== userMeta.getUsername()) {
                    API.checkSubscription(username).then((res) => {
                        userData.is_subscribed = res.data;
                        globalEventBus.emit(busEvents.SET_PROFILE_DATA, userData);
                    });
                } else {
                    globalEventBus.emit(busEvents.SET_PROFILE_DATA, userData);
                }
            })
            .catch((err) => {
                if (err.message === AUTH_ERROR) {
                    globalRouter.activate(PATHS.login);
                }
            });
    }

    /**
     * Подписка на пользователя
     * @param {string} username - имя пользователя
     * @param {boolean} isFollowing - подписка или отписка
     */
    followUser(username, isFollowing) {
        if (isFollowing) {
            API.followUser(username).then((res) =>
                globalEventBus.emit(busEvents.FOLLOW_STATUS, res.status === OK_CODE, isFollowing));
            return;
        }
        API.unfollowUser(username).then((res) =>
            globalEventBus.emit(busEvents.FOLLOW_STATUS, res.status === OK_CODE, isFollowing));
    }
}
