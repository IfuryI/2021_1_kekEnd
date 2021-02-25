import BaseController from './BaseController.js';
import ProfileModel from '../models/ProfileModel.js';
import ProfileView from '../views/ProfileView.js';


export default class ProfileController extends BaseController {
    constructor(parent) {
        super();
        this.view = new ProfileView(parent);
        this.model = new ProfileModel();
    }

    activate() {
        // start business logic here
        this.view.render();
    }
}
