
import {ComplainModel} from '../../models'
import {Complain} from '../../config/constants'

export const ComplainProviders = [
    {
        provide: Complain,
        useValue: ComplainModel
    },
];