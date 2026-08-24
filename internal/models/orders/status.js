const orderStatus = {
    PENDING: 0,
    CONFIRMED: 1,
    IN_PROGRESS: 2,
    COMPLETED: 3,
    CANCELED: 4,
    FAILED: 5,
    toString: function(status) {
        switch (status) {
            case this.PENDING:
                return "pending";
            case this.CONFIRMED:
                return "confirmed";
            case this.IN_PROGRESS:
                return "in_progress";
            case this.COMPLETED:
                return "completed";
            case this.CANCELED:
                return "canceled";
            case this.FAILED:
                return "failed";
            default:
                return "unknown";
        }
    }
};

export default Object.freeze(orderStatus);