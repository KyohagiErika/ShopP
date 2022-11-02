export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  REDIRECT = 302,
  BAD_REQUEST = 400,
  UNAUTHORIZATION = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  UNKNOW_ERROR = 520,
}

export enum StatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
}

export enum RoleEnum {
  ADMIN = 2,
  SHOP = 1,
  CUSTOMER = 0,
}

export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
export enum OtpEnum {
  FORGET = 'FORGET',
  VERIFICATION = 'VERIFICATION',
}

export enum ProductEnum {
  AVAILABLE = 'AVAILABLE',
  OUT_OF_ORDER = 'OUT_OF_ORDER',
  DELETED = 'DELETED',
}

export enum VoucherTypeEnum {
  FREESHIP = 'FREESHIP',
  MONEY = 'MONEY',
  PERCENT = 'PERCENT',
}

export enum TypeTransferEnum {
  SHOP_TO_CUSTOMER = 'SHOP_TO_CUSTOMER',
  CUSTOMER_TO_SHOP = 'CUSTOMER_TO_SHOP',
}

export enum StatusReportEnum {
  PROCESSING = 'PROCESSING',
  PROCESSED = 'PROCESSED',
}

export enum DeliveryStatusEnum {
  CHECKING = 'CHECKING',
  CONFIRMED = 'CONFIRMED',
  PACKAGING = 'PACKAGING',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}
