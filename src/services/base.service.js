
class BaseService {

    static commonErrorHandler(errorObject) {
        if (errorObject && errorObject.response && errorObject.response.status) {
            if (errorObject.response.status === 401 || errorObject.response.status === 403) {
            }
        }
    }
}

export default BaseService;