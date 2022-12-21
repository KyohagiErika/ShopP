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
  CHECKING = 0,
  CONFIRMED = 1,
  PACKAGING = 2,
  DELIVERING = 3,
  DELIVERED = 4,
  CANCELLED = 5,
  RETURNED = 6,
}

/**
 * @swagger
 * components:
 *  schemas:
 *   TitleStatusEnum:
 *    type: string
 *    enum:
 *    - ORDER_IS_REPARING
 *    - ORDER_READY_TO_BE_SENDED
 *    - ORDER_HAS_ARRIVED_TO_STATION_1
 *    - ORDER_HAS_ARRIVED_TO_STATION_2
 *    - ORDER_HAS_ARRIVED_TO_STATION_3
 *    - ORDER_IS_BEING_DELIVERY_TO_YOU
 *    - DELIVERY_COMPLETED
 *    - ORDER_IS_CANCELLED_BY_CUSTOMER
 *    - ORDER_IS_CANCELLED_BY_SHOP
 *    - ORDER_IS_RETURN_BY_DELEVERY_UNSUCCESSFULLY
 *    - ORDER_IS_RETURN_TO_SHOP_BY_CUSTOMER 
 */
export enum TitleStatusEnum {
  ORDER_IS_REPARING = 1,
  ORDER_READY_TO_BE_SENDED = 2,
  ORDER_HAS_ARRIVED_TO_STATION_1 = 3.1,
  ORDER_HAS_ARRIVED_TO_STATION_2 = 3.2,
  ORDER_HAS_ARRIVED_TO_STATION_3 = 3.3,
  ORDER_IS_BEING_DELIVERY_TO_YOU = 3.4,
  DELIVERY_COMPLETED = 4,
  ORDER_IS_CANCELLED_BY_CUSTOMER = 5.1,
  ORDER_IS_CANCELLED_BY_SHOP = 5.2,
  ORDER_IS_RETURN_BY_DELEVERY_UNSUCCESSFULLY = 6.1,
  ORDER_IS_RETURN_TO_SHOP_BY_CUSTOMER = 6.2
}

