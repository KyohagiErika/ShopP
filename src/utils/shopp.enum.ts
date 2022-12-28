/**
 * @swagger
 * components:
 *  schemas:
 *   Enum:
 *    type: object
 *    properties:
 *     name:
 *      type: string
 *      description: name of enum
 *     description:
 *      type: string
 *      description: description of enum
 *   EnumList:
 *    type: array
 *    items:
 *     $ref: '#/components/schemas/Enum'
 */

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  REDIRECT = 302,
  BAD_REQUEST = 400,
  UNAUTHORIZATION = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  UNKNOWN_ERROR = 520,
}

export enum StatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
}

/**
 * @swagger
 * components:
 *  schemas:
 *   RoleEnum:
 *    type: string
 *    enum:
 *    - ADMIN
 *    - SHOP
 *    - CUSTOMER
 */
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
/**
 * @swagger
 * components:
 *  schemas:
 *   ReasonEvaluationReportEnum:
 *    type: string
 *    enum:
 *    - CONTAIN_SENSITIVE_INFO
 *    - DUPLICATE
 *    - INACCURATE_MISLEADING
 *    - CONTAIN_PERSONAL_INFO
 *    - UNAUTHORIZED_ADVERTISING
 *    - OTHER_REASON
 */
export enum ReasonEvaluationReportEnum {
  CONTAIN_SENSITIVE_INFO = 'CONTAIN_SENSITIVE_INFO',
  DUPLICATE = 'DUPLICATE',
  INACCURATE_MISLEADING = 'INACCURATE_MISLEADING',
  CONTAIN_PERSONAL_INFO = 'CONTAIN_PERSONAL_INFO',
  UNAUTHORIZED_ADVERTISING = 'UNAUTHORIZED_ADVERTISING',
  OTHER_REASON = 'OTHER_REASON',
}

/**
 * @swagger
 * components:
 *  schemas:
 *   DeliveryStatusEnum:
 *    type: string
 *    enum:
 *    - CHECKING
 *    - CONFIRMED
 *    - PACKAGING
 *    - DELIVERING
 *    - DELIVERED
 *    - CANCELLED
 *    - RETURNED
 */
export enum DeliveryStatusEnum {
  CHECKING = '0',
  CONFIRMED = '1',
  PACKAGING = '2',
  DELIVERING = '3',
  DELIVERED = '4',
  CANCELLED = '5',
  RETURNED = '6',
}
