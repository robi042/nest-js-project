
import {SmsRateModel, GlobalCommissionModel, MerchantCommissionModel} from '../../models'
import {SMs_RATE, GLOBAL_COMMISSION, MERCHANT_COMMISSION} from '../../config/constants'

export const CostmanagementProviders = [
    {
        provide: SMs_RATE,
        useValue: SmsRateModel
    },

    {
        provide: GLOBAL_COMMISSION,
        useValue: GlobalCommissionModel
    },

    {
        provide: MERCHANT_COMMISSION,
        useValue: MerchantCommissionModel
    },
];