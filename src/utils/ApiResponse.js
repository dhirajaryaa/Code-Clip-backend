export class ApiResponse {
    constructor(status, data, message = "Success") {
            (this.status = status),
            (this.message = message),
            (this.data = data),
            (this.success = this.status > 400)
    }
}