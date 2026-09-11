const orderStatus = {
  PENDING: 0,
  CONFIRMED: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
  CANCELED: 4,
  FAILED: 5,
  default: function () {
    return this.PENDING;
  },
  toString: function (status) {
    switch (status) {
      case this.PENDING:
        return "Pending";
      case this.CONFIRMED:
        return "Confirmed";
      case this.IN_PROGRESS:
        return "In progress";
      case this.COMPLETED:
        return "Completed";
      case this.CANCELED:
        return "Canceled";
      case this.FAILED:
        return "Failed";
      default:
        return "Unknown";
    }
  }
};

export { orderStatus };