// FYI

// VIEW,ADD,EDIT,DELETE reflects pages and actions permission

export const PERMISSIONS = {
  VIEW_HOME: 'view_home',
  ORDER: {
    VIEW: 'view_orders',
    ADD: 'add_orders',
    EDIT: 'edit_orders',
    DELETE: 'delete_orders',
    DETAIL: 'order_detail',
    LIST: 'list_orders',
    FOOTER_TOTAL: 'footer_total',
    DELIVER_INFO: 'deliver_info',
    ORDER_DETAILS_PRICE: 'order_details_price',
    ORDER_DETAILS_TOTAL: 'order_details_total',
    TRACK_ORDER: 'track_order',
    VIEW_COUPON_INFO: 'view_coupon_info'
  },
  PRODUCT: {
    VIEW: 'view_products',
    ADD: 'add_products',
    EDIT: 'edit_products',
    DELETE: 'delete_products',
    LIST: 'list_products',
    BULK_UPLOAD_PRODUCTS: 'bulk_upload_products',
    VIEW_PRODUCT_ACTIONS: 'view_product_actions'
  },

  PHARMACY: {
    VIEW: 'view_pharmacies',
    ADD: 'add_pharmacy',
    EDIT: 'edit_pharmacy',
    LIST: 'list_pharmacies',
    EDIT_PHARMACY_ADMIN: 'edit_pharmacy_admin',
    CONNECT_ADYEN_ACCOUNT: 'connect_adyen_account',
    FIELDS: {
      EDIT_PRIORITY_RANKING: 'edit_priority_ranking',
      EDIT_COLLECT_POINT_ID: 'edit_collect_point_id',
      EDIT_COLLECT_POINT_NAME: 'edit_collect_point_name',
      EDIT_SHOPPING_COST_STANDARD: 'edit_shopping_cost_standard',
      EDIT_EXPRESS_COST_STANDARD: 'edit_express_cost_standard'
    },
    SECTION: {
      VIEW_FEES_AND_PRCIING: 'view_fees_and_pricing'
    }
  },

  PHARMACY_ADMIN: {
    VIEW: 'view_pharmacy_admins',
    ADD: 'add_pharmacy_admin',
    EDIT: 'edit_pharmacy_admin',
    LIST: 'list_pharmacy_admins'
  }
}
