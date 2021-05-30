import IApplicationResources from './IApplicationResources.interface';
import IService from './IService.interface';

export default abstract class BaseController {
    private resources: IApplicationResources;

    constructor(resources: IApplicationResources) {
        this.resources = resources;
    }

    protected get services(): IService {
        return this.resources.services;
    }
}
