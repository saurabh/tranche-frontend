import BaseService from "./base.service";
import { apiUri } from "../config/constants";
import { postRequest } from './axios'
const { loanList: loanListUrl } = apiUri;

export default class LoanService extends BaseService {
    
    static async loanList(data) {
        try {
            const { data: result } = await postRequest(loanListUrl, { data }, null, true)
            return result;
        } catch (error) {
            //TODO : error handling
            console.log(error);
        }
    }
}
