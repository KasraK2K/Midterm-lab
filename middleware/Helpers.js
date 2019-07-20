class Helpers {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    };
    
    getLocalsVariable() {
        return {
            auth: this.auth(),
            siteName: 'ایمن سایت',
        }
    };
    
    auth() {
        return {
            check: this.req.isAuthenticated(),
            user: this.req.user
        }
    };
};

module.exports = Helpers;
