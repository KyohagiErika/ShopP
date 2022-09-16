export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
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
  ADMIN = 'ADMIN',
  SHOP = 'SHOP',
  CUSTOMER = 'CUSTOMER',
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
