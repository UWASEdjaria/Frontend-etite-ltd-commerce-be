
window.onload = function() {
  // Build a system
  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  var options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "components": {
      "examples": {},
      "headers": {},
      "parameters": {},
      "requestBodies": {},
      "responses": {},
      "schemas": {
        "Decimal": {
          "type": "string"
        },
        "_36_Enums.ToolCondition": {
          "type": "string",
          "enum": [
            "NEW",
            "REFURBISHED",
            "HEAVY_DUTY"
          ]
        },
        "StockStatus": {
          "type": "string",
          "enum": [
            "NORMAL",
            "LOW",
            "OUT_OF_STOCK",
            "OVERSTOCK"
          ]
        },
        "StockEntry": {
          "properties": {
            "id": {
              "type": "string"
            },
            "productId": {
              "type": "string"
            },
            "productName": {
              "type": "string"
            },
            "productStock": {
              "type": "number",
              "format": "double"
            },
            "quantity": {
              "type": "number",
              "format": "double"
            },
            "price": {
              "type": "number",
              "format": "double"
            },
            "expiryDate": {
              "type": "string",
              "nullable": true
            },
            "batchCode": {
              "type": "string",
              "nullable": true
            },
            "status": {
              "$ref": "#/components/schemas/StockStatus"
            },
            "createdAt": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "productId",
            "productName",
            "productStock",
            "quantity",
            "price",
            "expiryDate",
            "batchCode",
            "status",
            "createdAt"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "AddStockDTO": {
          "properties": {
            "productId": {
              "type": "string"
            },
            "quantity": {
              "type": "number",
              "format": "double"
            },
            "price": {
              "type": "number",
              "format": "double"
            },
            "expiryDate": {
              "type": "string"
            },
            "batchCode": {
              "type": "string"
            }
          },
          "required": [
            "productId",
            "quantity",
            "price"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "EditStockDTO": {
          "properties": {
            "quantity": {
              "type": "number",
              "format": "double"
            },
            "price": {
              "type": "number",
              "format": "double"
            },
            "expiryDate": {
              "type": "string"
            },
            "batchCode": {
              "type": "string"
            }
          },
          "type": "object",
          "additionalProperties": false
        },
        "Product": {
          "properties": {
            "id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "stock": {
              "type": "number",
              "format": "double"
            },
            "minThreshold": {
              "type": "number",
              "format": "double"
            },
            "maxThreshold": {
              "type": "number",
              "format": "double"
            },
            "imageUrl": {
              "type": "string"
            },
            "condition": {
              "type": "string",
              "enum": [
                "NEW",
                "REFURBISHED",
                "HEAVY_DUTY"
              ]
            },
            "categoryId": {
              "type": "string"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time"
            }
          },
          "required": [
            "id",
            "name",
            "description",
            "stock",
            "minThreshold",
            "maxThreshold",
            "condition",
            "categoryId",
            "createdAt",
            "updatedAt"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "Category": {
          "properties": {
            "id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "name"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "ApiResponse_Category-Array_": {
          "properties": {
            "success": {
              "type": "boolean"
            },
            "message": {
              "type": "string"
            },
            "data": {
              "items": {
                "$ref": "#/components/schemas/Category"
              },
              "type": "array"
            }
          },
          "required": [
            "success",
            "message"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "ApiResponse_Category_": {
          "properties": {
            "success": {
              "type": "boolean"
            },
            "message": {
              "type": "string"
            },
            "data": {
              "$ref": "#/components/schemas/Category"
            }
          },
          "required": [
            "success",
            "message"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "CreateCategoryDTO": {
          "properties": {
            "name": {
              "type": "string"
            }
          },
          "required": [
            "name"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "Partial_CreateCategoryDTO_": {
          "properties": {
            "name": {
              "type": "string"
            }
          },
          "type": "object",
          "description": "Make all properties in T optional"
        },
        "ApiResponse_null_": {
          "properties": {
            "success": {
              "type": "boolean"
            },
            "message": {
              "type": "string"
            },
            "data": {
              "type": "number",
              "enum": [
                null
              ],
              "nullable": true
            }
          },
          "required": [
            "success",
            "message"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "PaypackTransactionData": {
          "properties": {
            "ref": {
              "type": "string"
            },
            "status": {
              "type": "string"
            },
            "amount": {
              "type": "number",
              "format": "double"
            },
            "client": {
              "type": "string"
            },
            "kind": {
              "type": "string"
            },
            "created_at": {
              "type": "string"
            },
            "key": {
              "type": "string"
            }
          },
          "type": "object",
          "additionalProperties": false
        },
        "PaypackApiResponse": {
          "properties": {
            "data": {
              "$ref": "#/components/schemas/PaypackTransactionData"
            },
            "error": {
              "type": "string"
            }
          },
          "type": "object",
          "additionalProperties": false
        },
        "PaypackPaymentRequest": {
          "properties": {
            "phone": {
              "type": "string"
            },
            "amount": {
              "type": "number",
              "format": "double"
            }
          },
          "required": [
            "phone",
            "amount"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "ErrorResponsePayload": {
          "properties": {
            "message": {
              "type": "string"
            }
          },
          "required": [
            "message"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "PaypackCashoutRequest": {
          "properties": {
            "phone": {
              "type": "string"
            },
            "amount": {
              "type": "number",
              "format": "double"
            }
          },
          "required": [
            "phone",
            "amount"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "_36_Enums.OrderStatus": {
          "type": "string",
          "enum": [
            "PENDING",
            "PROCESSING",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
            "PAID"
          ]
        },
        "PaymentMethod": {
          "type": "string",
          "enum": [
            "MOMO",
            "DELIVERY"
          ]
        },
        "CreateOrderRequest": {
          "properties": {
            "shippingAddress": {
              "type": "string"
            },
            "paymentMethod": {
              "$ref": "#/components/schemas/PaymentMethod"
            },
            "fullName": {
              "type": "string"
            },
            "email": {
              "type": "string"
            },
            "phone": {
              "type": "string"
            },
            "items": {
              "items": {
                "properties": {
                  "price": {
                    "type": "number",
                    "format": "double"
                  },
                  "quantity": {
                    "type": "number",
                    "format": "double"
                  },
                  "productId": {
                    "type": "string"
                  }
                },
                "required": [
                  "price",
                  "quantity",
                  "productId"
                ],
                "type": "object"
              },
              "type": "array"
            }
          },
          "required": [
            "shippingAddress",
            "paymentMethod"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "OrderItem": {
          "properties": {
            "id": {
              "type": "string"
            },
            "quantity": {
              "type": "number",
              "format": "double"
            },
            "productId": {
              "type": "string"
            },
            "price": {
              "type": "number",
              "format": "double"
            },
            "product": {
              "properties": {
                "price": {
                  "type": "number",
                  "format": "double"
                },
                "imageUrl": {
                  "type": "string",
                  "nullable": true
                },
                "name": {
                  "type": "string"
                }
              },
              "required": [
                "price",
                "imageUrl",
                "name"
              ],
              "type": "object"
            }
          },
          "required": [
            "id",
            "quantity",
            "productId",
            "price",
            "product"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "OrderResponse": {
          "properties": {
            "id": {
              "type": "string"
            },
            "userId": {
              "type": "string",
              "nullable": true
            },
            "email": {
              "type": "string",
              "nullable": true
            },
            "fullName": {
              "type": "string",
              "nullable": true
            },
            "phone": {
              "type": "string",
              "nullable": true
            },
            "totalAmount": {
              "type": "number",
              "format": "double"
            },
            "status": {
              "type": "string"
            },
            "shippingAddress": {
              "type": "string"
            },
            "paymentMethod": {
              "type": "string"
            },
            "transactionId": {
              "type": "string",
              "nullable": true
            },
            "orderItems": {
              "items": {
                "$ref": "#/components/schemas/OrderItem"
              },
              "type": "array"
            },
            "createdAt": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "userId",
            "email",
            "fullName",
            "phone",
            "totalAmount",
            "status",
            "shippingAddress",
            "paymentMethod",
            "orderItems"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "PaginatedOrdersResponse": {
          "properties": {
            "orders": {
              "items": {
                "$ref": "#/components/schemas/OrderResponse"
              },
              "type": "array"
            },
            "totalPages": {
              "type": "number",
              "format": "double"
            },
            "currentPage": {
              "type": "number",
              "format": "double"
            }
          },
          "required": [
            "orders",
            "totalPages",
            "currentPage"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "_36_Enums.UserStatus": {
          "type": "string",
          "enum": [
            "REGISTERED",
            "ACTIVE"
          ]
        },
        "_36_Enums.Role": {
          "type": "string",
          "enum": [
            "USER",
            "ADMIN"
          ]
        },
        "DashboardSummary": {
          "properties": {
            "totalOrders": {
              "type": "number",
              "format": "double"
            },
            "activeOrders": {
              "type": "number",
              "format": "double"
            },
            "wishlistItems": {
              "type": "number",
              "format": "double"
            },
            "pendingReviews": {
              "type": "number",
              "format": "double"
            }
          },
          "required": [
            "totalOrders",
            "activeOrders",
            "wishlistItems",
            "pendingReviews"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "IContactResponse": {
          "properties": {
            "success": {
              "type": "boolean"
            },
            "message": {
              "type": "string"
            }
          },
          "required": [
            "success",
            "message"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "IContactRequest": {
          "properties": {
            "name": {
              "type": "string"
            },
            "email": {
              "type": "string"
            },
            "message": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "email",
            "message"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "AddToCartRequest": {
          "properties": {
            "productId": {
              "type": "string"
            },
            "quantity": {
              "type": "number",
              "format": "double"
            }
          },
          "required": [
            "productId",
            "quantity"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "UpdateCartRequest": {
          "properties": {
            "quantity": {
              "type": "number",
              "format": "double"
            }
          },
          "required": [
            "quantity"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "UserProfileResponse": {
          "properties": {
            "id": {
              "type": "string"
            },
            "email": {
              "type": "string"
            },
            "name": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "email",
            "name"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "SignUp": {
          "properties": {
            "name": {
              "type": "string"
            },
            "email": {
              "type": "string"
            },
            "password": {
              "type": "string"
            },
            "confirmPassword": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "email",
            "password"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "Pick_SignUp.email-or-password_": {
          "properties": {
            "email": {
              "type": "string"
            },
            "password": {
              "type": "string"
            }
          },
          "required": [
            "email",
            "password"
          ],
          "type": "object",
          "description": "From T, pick a set of properties whose keys are in the union K"
        },
        "Login": {
          "$ref": "#/components/schemas/Pick_SignUp.email-or-password_"
        },
        "VerifyOtp": {
          "properties": {
            "email": {
              "type": "string"
            },
            "otp": {
              "type": "string"
            }
          },
          "required": [
            "email",
            "otp"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "ResendOtp": {
          "properties": {
            "email": {
              "type": "string"
            }
          },
          "required": [
            "email"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "UserStatus": {
          "type": "string",
          "enum": [
            "REGISTERED",
            "ACTIVE"
          ]
        },
        "UserResponse": {
          "properties": {
            "id": {
              "type": "string"
            },
            "email": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "role": {
              "type": "string",
              "enum": [
                "USER",
                "ADMIN"
              ]
            },
            "isVerified": {
              "type": "boolean"
            },
            "status": {
              "$ref": "#/components/schemas/UserStatus"
            }
          },
          "required": [
            "id",
            "email",
            "name",
            "role",
            "isVerified",
            "status"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "PaginatedUsersResponse": {
          "properties": {
            "users": {
              "items": {
                "$ref": "#/components/schemas/UserResponse"
              },
              "type": "array"
            },
            "totalPages": {
              "type": "number",
              "format": "double"
            },
            "currentPage": {
              "type": "number",
              "format": "double"
            }
          },
          "required": [
            "users",
            "totalPages",
            "currentPage"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "AdminInviteRequest": {
          "properties": {
            "email": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "role": {
              "type": "string",
              "enum": [
                "USER",
                "ADMIN"
              ]
            }
          },
          "required": [
            "email",
            "name",
            "role"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "UpdateUserRequest": {
          "properties": {
            "name": {
              "type": "string"
            },
            "email": {
              "type": "string"
            },
            "role": {
              "type": "string",
              "enum": [
                "USER",
                "ADMIN"
              ]
            },
            "isVerified": {
              "type": "boolean"
            },
            "status": {
              "type": "string",
              "enum": [
                "REGISTERED",
                "ACTIVE"
              ]
            }
          },
          "type": "object",
          "additionalProperties": false
        },
        "LowStockItem": {
          "properties": {
            "name": {
              "type": "string"
            },
            "stock": {
              "type": "number",
              "format": "double"
            }
          },
          "required": [
            "name",
            "stock"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "AdminSummaryResponse": {
          "properties": {
            "totalOrders": {
              "type": "number",
              "format": "double"
            },
            "lowStockCount": {
              "type": "number",
              "format": "double"
            },
            "activeCartCount": {
              "type": "number",
              "format": "double"
            },
            "totalRevenue": {
              "type": "number",
              "format": "double"
            },
            "lowStockItems": {
              "items": {
                "$ref": "#/components/schemas/LowStockItem"
              },
              "type": "array"
            }
          },
          "required": [
            "totalOrders",
            "lowStockCount",
            "activeCartCount",
            "totalRevenue",
            "lowStockItems"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "CartItemProduct": {
          "properties": {
            "name": {
              "type": "string"
            },
            "imageUrl": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "imageUrl"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "CartItemWithDetails": {
          "properties": {
            "id": {
              "type": "string"
            },
            "user": {
              "properties": {
                "email": {
                  "type": "string"
                }
              },
              "required": [
                "email"
              ],
              "type": "object"
            },
            "product": {
              "$ref": "#/components/schemas/CartItemProduct"
            },
            "createdAt": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "user",
            "product",
            "createdAt"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "PaginatedCartsResponse": {
          "properties": {
            "carts": {
              "items": {
                "$ref": "#/components/schemas/CartItemWithDetails"
              },
              "type": "array"
            },
            "totalPages": {
              "type": "number",
              "format": "double"
            },
            "currentPage": {
              "type": "number",
              "format": "double"
            }
          },
          "required": [
            "carts",
            "totalPages",
            "currentPage"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "IMessage": {
          "properties": {
            "id": {
              "type": "string"
            },
            "senderName": {
              "type": "string"
            },
            "email": {
              "type": "string"
            },
            "message": {
              "type": "string"
            },
            "createdAt": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "senderName",
            "email",
            "message",
            "createdAt"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "ICreateMessageDto": {
          "properties": {
            "senderName": {
              "type": "string"
            },
            "email": {
              "type": "string"
            },
            "message": {
              "type": "string"
            }
          },
          "required": [
            "senderName",
            "email",
            "message"
          ],
          "type": "object",
          "additionalProperties": false
        },
        "IPaginatedMessagesResponse": {
          "properties": {
            "messages": {
              "items": {
                "$ref": "#/components/schemas/IMessage"
              },
              "type": "array"
            },
            "currentPage": {
              "type": "number",
              "format": "double"
            },
            "totalPages": {
              "type": "number",
              "format": "double"
            },
            "totalCount": {
              "type": "number",
              "format": "double"
            }
          },
          "required": [
            "messages",
            "currentPage",
            "totalPages",
            "totalCount"
          ],
          "type": "object",
          "additionalProperties": false
        }
      },
      "securitySchemes": {
        "jwt": {
          "type": "apiKey",
          "name": "Authorization",
          "in": "header"
        }
      }
    },
    "info": {
      "title": "swagger",
      "version": "1.0.0",
      "license": {
        "name": "ISC"
      },
      "contact": {}
    },
    "paths": {
      "/wishlist": {
        "get": {
          "operationId": "GetWishlist",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "currentPage": {
                        "type": "number",
                        "format": "double"
                      },
                      "totalPages": {
                        "type": "number",
                        "format": "double"
                      },
                      "userWishlist": {
                        "items": {
                          "allOf": [
                            {
                              "properties": {
                                "product": {
                                  "properties": {
                                    "minThreshold": {
                                      "type": "number",
                                      "format": "double"
                                    },
                                    "maxThreshold": {
                                      "type": "number",
                                      "format": "double"
                                    },
                                    "expiryDate": {
                                      "type": "string",
                                      "format": "date-time"
                                    },
                                    "updatedAt": {
                                      "type": "string",
                                      "format": "date-time"
                                    },
                                    "categoryId": {
                                      "type": "string"
                                    },
                                    "condition": {
                                      "$ref": "#/components/schemas/_36_Enums.ToolCondition"
                                    },
                                    "imageUrl": {
                                      "type": "string"
                                    },
                                    "stock": {
                                      "type": "number",
                                      "format": "double"
                                    },
                                    "price": {
                                      "$ref": "#/components/schemas/Decimal"
                                    },
                                    "description": {
                                      "type": "string"
                                    },
                                    "name": {
                                      "type": "string"
                                    },
                                    "createdAt": {
                                      "type": "string",
                                      "format": "date-time"
                                    },
                                    "id": {
                                      "type": "string"
                                    }
                                  },
                                  "required": [
                                    "minThreshold",
                                    "maxThreshold",
                                    "expiryDate",
                                    "updatedAt",
                                    "categoryId",
                                    "condition",
                                    "imageUrl",
                                    "stock",
                                    "price",
                                    "description",
                                    "name",
                                    "createdAt",
                                    "id"
                                  ],
                                  "type": "object"
                                }
                              },
                              "required": [
                                "product"
                              ],
                              "type": "object"
                            },
                            {
                              "properties": {
                                "createdAt": {
                                  "type": "string",
                                  "format": "date-time"
                                },
                                "productId": {
                                  "type": "string"
                                },
                                "userId": {
                                  "type": "string"
                                },
                                "id": {
                                  "type": "string"
                                }
                              },
                              "required": [
                                "createdAt",
                                "productId",
                                "userId",
                                "id"
                              ],
                              "type": "object"
                            }
                          ]
                        },
                        "type": "array"
                      }
                    },
                    "required": [
                      "currentPage",
                      "totalPages",
                      "userWishlist"
                    ],
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "Wishlist"
          ],
          "security": [
            {
              "jwt": [
                "USER"
              ]
            }
          ],
          "parameters": [
            {
              "in": "query",
              "name": "page",
              "required": false,
              "schema": {
                "default": 1,
                "format": "double",
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "limit",
              "required": false,
              "schema": {
                "default": 10,
                "format": "double",
                "type": "number"
              }
            }
          ]
        },
        "post": {
          "operationId": "AddToWishlist",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "createdAt": {
                        "type": "string",
                        "format": "date-time"
                      },
                      "productId": {
                        "type": "string"
                      },
                      "userId": {
                        "type": "string"
                      },
                      "id": {
                        "type": "string"
                      }
                    },
                    "required": [
                      "createdAt",
                      "productId",
                      "userId",
                      "id"
                    ],
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "Wishlist"
          ],
          "security": [
            {
              "jwt": [
                "USER"
              ]
            }
          ],
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "properties": {
                    "productId": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "productId"
                  ],
                  "type": "object"
                }
              }
            }
          }
        }
      },
      "/wishlist/{productId}": {
        "delete": {
          "operationId": "RemoveFromWishlist",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "createdAt": {
                        "type": "string",
                        "format": "date-time"
                      },
                      "productId": {
                        "type": "string"
                      },
                      "userId": {
                        "type": "string"
                      },
                      "id": {
                        "type": "string"
                      }
                    },
                    "required": [
                      "createdAt",
                      "productId",
                      "userId",
                      "id"
                    ],
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "Wishlist"
          ],
          "security": [
            {
              "jwt": [
                "USER"
              ]
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "productId",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ]
        }
      },
      "/welcome": {
        "get": {
          "operationId": "Welcome",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "message": {
                        "type": "string"
                      }
                    },
                    "required": [
                      "message"
                    ],
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "Welcome"
          ],
          "security": [],
          "parameters": []
        }
      },
      "/admin/stock": {
        "get": {
          "operationId": "GetAllStock",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "totalPages": {
                        "type": "number",
                        "format": "double"
                      },
                      "data": {
                        "items": {
                          "$ref": "#/components/schemas/StockEntry"
                        },
                        "type": "array"
                      }
                    },
                    "required": [
                      "totalPages",
                      "data"
                    ],
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "Stock"
          ],
          "security": [
            {
              "jwt": [
                "ADMIN"
              ]
            }
          ],
          "parameters": [
            {
              "in": "query",
              "name": "page",
              "required": false,
              "schema": {
                "format": "double",
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "limit",
              "required": false,
              "schema": {
                "format": "double",
                "type": "number"
              }
            }
          ]
        },
        "post": {
          "operationId": "AddStock",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/StockEntry"
                  }
                }
              }
            }
          },
          "tags": [
            "Stock"
          ],
          "security": [
            {
              "jwt": [
                "ADMIN"
              ]
            }
          ],
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddStockDTO"
                }
              }
            }
          }
        }
      },
      "/admin/stock/{id}": {
        "put": {
          "operationId": "EditStock",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/StockEntry"
                  }
                }
              }
            }
          },
          "tags": [
            "Stock"
          ],
          "security": [
            {
              "jwt": [
                "ADMIN"
              ]
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/EditStockDTO"
                }
              }
            }
          }
        }
      },
      "/products": {
        "get": {
          "operationId": "ListProducts",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "totalPages": {
                        "type": "number",
                        "format": "double"
                      },
                      "data": {
                        "items": {
                          "$ref": "#/components/schemas/Product"
                        },
                        "type": "array"
                      }
                    },
                    "required": [
                      "totalPages",
                      "data"
                    ],
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "Products"
          ],
          "security": [],
          "parameters": [
            {
              "in": "query",
              "name": "name",
              "required": false,
              "schema": {
                "type": "string"
              }
            },
            {
              "in": "query",
              "name": "categoryId",
              "required": false,
              "schema": {
                "type": "string"
              }
            },
            {
              "in": "query",
              "name": "category",
              "required": false,
              "schema": {
                "type": "string"
              }
            },
            {
              "in": "query",
              "name": "page",
              "required": false,
              "schema": {
                "format": "double",
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "limit",
              "required": false,
              "schema": {
                "format": "double",
                "type": "number"
              }
            }
          ]
        },
        "post": {
          "operationId": "CreateProduct",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Product"
                  }
                }
              }
            }
          },
          "tags": [
            "Products"
          ],
          "security": [
            {
              "jwt": [
                "ADMIN"
              ]
            }
          ],
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string"
                    },
                    "description": {
                      "type": "string"
                    },
                    "categoryId": {
                      "type": "string"
                    },
                    "imageUrl": {
                      "type": "string"
                    },
                    "condition": {
                      "type": "string",
                      "enum": [
                        "NEW",
                        "REFURBISHED",
                        "HEAVY_DUTY"
                      ]
                    },
                    "image": {
                      "type": "string",
                      "format": "binary"
                    }
                  },
                  "required": [
                    "name",
                    "description",
                    "categoryId"
                  ]
                }
              }
            }
          }
        }
      },
      "/products/{id}": {
        "get": {
          "operationId": "GetProduct",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/Product"
                      }
                    ],
                    "nullable": true
                  }
                }
              }
            }
          },
          "tags": [
            "Products"
          ],
          "security": [],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ]
        },
        "put": {
          "operationId": "UpdateProduct",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Product"
                  }
                }
              }
            }
          },
          "tags": [
            "Products"
          ],
          "security": [
            {
              "jwt": [
                "ADMIN"
              ]
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": false,
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "image": {
                      "type": "string",
                      "format": "binary"
                    },
                    "name": {
                      "type": "string"
                    },
                    "description": {
                      "type": "string"
                    },
                    "categoryId": {
                      "type": "string"
                    },
                    "imageUrl": {
                      "type": "string"
                    },
                    "condition": {
                      "type": "string",
                      "enum": [
                        "NEW",
                        "REFURBISHED",
                        "HEAVY_DUTY"
                      ]
                    }
                  }
                }
              }
            }
          }
        },
        "delete": {
          "operationId": "DeleteProduct",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "message": {
                        "type": "string"
                      },
                      "success": {
                        "type": "boolean"
                      }
                    },
                    "required": [
                      "message",
                      "success"
                    ],
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "Products"
          ],
          "security": [
            {
              "jwt": [
                "ADMIN"
              ]
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ]
        }
      },
      "/admin/categories": {
        "get": {
          "operationId": "GetAllCategories",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiResponse_Category-Array_"
                  }
                }
              }
            }
          },
          "tags": [
            "Categories"
          ],
          "security": [],
          "parameters": []
        },
        "post": {
          "operationId": "CreateCategory",
          "responses": {
            "201": {
              "description": "Created",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiResponse_Category_"
                  }
                }
              }
            }
          },
          "tags": [
            "Categories"
          ],
          "security": [
            {
              "jwt": [
                "ADMIN"
              ]
            }
          ],
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateCategoryDTO"
                }
              }
            }
          }
        }
      },
      "/admin/categories/{id}": {
        "put": {
          "operationId": "UpdateCategory",
          "responses": {
            "200": {
              "description": "Updated",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiResponse_Category_"
                  }
                }
              }
            }
          },
          "tags": [
            "Categories"
          ],
          "security": [
            {
              "jwt": [
                "ADMIN"
              ]
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Partial_CreateCategoryDTO_"
                }
              }
            }
          }
        },
        "delete": {
          "operationId": "DeleteCategory",
          "responses": {
            "200": {
              "description": "Deleted",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ApiResponse_null_"
                  }
                }
              }
            }
          },
          "tags": [
            "Categories"
          ],
          "security": [
            {
              "jwt": [
                "ADMIN"
              ]
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ]
        }
      },
      "/payments/checkout": {
        "post": {
          "operationId": "ProcessCheckout",
          "responses": {
            "200": {
              "description": "Payment prompt sent successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PaypackApiResponse"
                  }
                }
              }
            },
            "500": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponsePayload"
                  }
                }
              }
            }
          },
          "security": [],
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PaypackPaymentRequest"
                }
              }
            }
          }
        }
      },
      "/payments/cashout": {
        "post": {
          "operationId": "ProcessCashout",
          "responses": {
            "200": {
              "description": "Cashout processed successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PaypackApiResponse"
                  }
                }
              }
            },
            "500": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponsePayload"
                  }
                }
              }
            }
          },
          "security": [],
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PaypackCashoutRequest"
                }
              }
            }
          }
        }
      },
      "/order/guest": {
        "post": {
          "operationId": "CreateGuestOrder",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "transactionId": {
                        "type": "string"
                      },
                      "phone": {
                        "type": "string"
                      },
                      "paymentMethod": {
                        "type": "string"
                      },
                      "fullName": {
                        "type": "string"
                      },
                      "email": {
                        "type": "string"
                      },
                      "shippingAddress": {
                        "type": "string"
                      },
                      "status": {
                        "$ref": "#/components/schemas/_36_Enums.OrderStatus"
                      },
                      "updatedAt": {
                        "type": "string",
                        "format": "date-time"
                      },
                      "userId": {
                        "type": "string"
                      },
                      "id": {
                        "type": "string"
                      },
                      "orderItems": {
                        "items": {
                          "properties": {
                            "product": {
                              "properties": {
                                "price": {
                                  "type": "number",
                                  "format": "double"
                                },
                                "imageUrl": {},
                                "name": {}
                              },
                              "required": [
                                "price",
                                "imageUrl",
                                "name"
                              ],
                              "type": "object"
                            },
                            "price": {
                              "type": "number",
                              "format": "double"
                            },
                            "productId": {},
                            "quantity": {},
                            "id": {}
                          },
                          "required": [
                            "product",
                            "price",
                            "productId",
                            "quantity",
                            "id"
                          ],
                          "type": "object"
                        },
                        "type": "array"
                      },
                      "createdAt": {
                        "type": "string"
                      },
                      "totalAmount": {
                        "type": "number",
                        "format": "double"
                      }
                    },
                    "required": [
                      "transactionId",
                      "phone",
                      "paymentMethod",
                      "fullName",
                      "email",
                      "shippingAddress",
                      "status",
                      "updatedAt",
                      "userId",
                      "id",
                      "orderItems",
                      "createdAt",
                      "totalAmount"
                    ],
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "Order"
          ],
          "security": [],
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateOrderRequest"
                }
              }
            }
          }
        }
      },
      "/order": {
        "post": {
          "operationId": "CreateOrder",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "transactionId": {
                        "type": "string"
                      },
                      "phone": {
                        "type": "string"
                      },
                      "paymentMethod": {
                        "type": "string"
                      },
                      "fullName": {
                        "type": "string"
                      },
                      "email": {
                        "type": "string"
                      },
                      "shippingAddress": {
                        "type": "string"
                      },
                      "status": {
                        "$ref": "#/components/schemas/_36_Enums.OrderStatus"
                      },
                      "updatedAt": {
                        "type": "string",
                        "format": "date-time"
                      },
                      "userId": {
                        "type": "string"
                      },
                      "id": {
                        "type": "string"
                      },
                      "orderItems": {
                        "items": {
                          "properties": {
                            "product": {
                              "properties": {
                                "price": {
                                  "type": "number",
                                  "format": "double"
                                },
                                "imageUrl": {},
                                "name": {}
                              },
                              "required": [
                                "price",
                                "imageUrl",
                                "name"
                              ],
                              "type": "object"
                            },
                            "price": {
                              "type": "number",
                              "format": "double"
                            },
                            "productId": {},
                            "quantity": {},
                            "id": {}
                          },
                          "required": [
                            "product",
                            "price",
                            "productId",
                            "quantity",
                            "id"
                          ],
                          "type": "object"
                        },
                        "type": "array"
                      },
                      "createdAt": {
                        "type": "string"
                      },
                      "totalAmount": {
                        "type": "number",
                        "format": "double"
                      }
                    },
                    "required": [
                      "transactionId",
                      "phone",
                      "paymentMethod",
                      "fullName",
                      "email",
                      "shippingAddress",
                      "status",
                      "updatedAt",
                      "userId",
                      "id",
                      "orderItems",
                      "createdAt",
                      "totalAmount"
                    ],
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "Order"
          ],
          "security": [
            {
              "jwt": [
                "USER"
              ]
            }
          ],
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateOrderRequest"
                }
              }
            }
          }
        }
      },
      "/order/my-orders": {
        "get": {
          "operationId": "GetMyOrders",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PaginatedOrdersResponse"
                  }
                }
              }
            }
          },
          "tags": [
            "Order"
          ],
          "security": [
            {
              "jwt": [
                "USER"
              ]
            }
          ],
          "parameters": [
            {
              "in": "query",
              "name": "page",
              "required": false,
              "schema": {
                "default": 1,
                "format": "double",
                "type": "number"
              }
            }
          ]
        }
      },
      "/order/{id}": {
        "get": {
          "operationId": "GetOrderById",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/OrderResponse"
                  }
                }
              }
            }
          },
          "tags": [
            "Order"
          ],
          "security": [],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ]
        }
      },
      "/order/{id}/cancel": {
        "put": {
          "operationId": "CancelOrder",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "transactionId": {
                        "type": "string"
                      },
                      "phone": {
                        "type": "string"
                      },
                      "paymentMethod": {
                        "type": "string"
                      },
                      "fullName": {
                        "type": "string"
                      },
                      "email": {
                        "type": "string"
                      },
                      "shippingAddress": {
                        "type": "string"
                      },
                      "status": {
                        "$ref": "#/components/schemas/_36_Enums.OrderStatus"
                      },
                      "updatedAt": {
                        "type": "string",
                        "format": "date-time"
                      },
                      "userId": {
                        "type": "string"
                      },
                      "id": {
                        "type": "string"
                      },
                      "orderItems": {
                        "items": {
                          "properties": {
                            "product": {
                              "properties": {
                                "price": {
                                  "type": "number",
                                  "format": "double"
                                },
                                "imageUrl": {
                                  "type": "string"
                                },
                                "name": {
                                  "type": "string"
                                }
                              },
                              "required": [
                                "price",
                                "imageUrl",
                                "name"
                              ],
                              "type": "object"
                            },
                            "price": {
                              "type": "number",
                              "format": "double"
                            },
                            "productId": {
                              "type": "string"
                            },
                            "quantity": {
                              "type": "number",
                              "format": "double"
                            },
                            "id": {
                              "type": "string"
                            }
                          },
                          "required": [
                            "product",
                            "price",
                            "productId",
                            "quantity",
                            "id"
                          ],
                          "type": "object"
                        },
                        "type": "array"
                      },
                      "createdAt": {
                        "type": "string"
                      },
                      "totalAmount": {
                        "type": "number",
                        "format": "double"
                      }
                    },
                    "required": [
                      "transactionId",
                      "phone",
                      "paymentMethod",
                      "fullName",
                      "email",
                      "shippingAddress",
                      "status",
                      "updatedAt",
                      "userId",
                      "id",
                      "orderItems",
                      "createdAt",
                      "totalAmount"
                    ],
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "cancel",
            "Order"
          ],
          "security": [
            {
              "jwt": [
                "USER"
              ]
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ]
        }
      },
      "/order/admin/all": {
        "get": {
          "operationId": "GetAllOrders",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "currentPage": {
                        "type": "number",
                        "format": "double"
                      },
                      "totalPages": {
                        "type": "number",
                        "format": "double"
                      },
                      "orders": {
                        "items": {
                          "allOf": [
                            {
                              "properties": {
                                "orderItems": {
                                  "items": {
                                    "allOf": [
                                      {
                                        "properties": {
                                          "product": {
                                            "properties": {
                                              "minThreshold": {
                                                "type": "number",
                                                "format": "double"
                                              },
                                              "maxThreshold": {
                                                "type": "number",
                                                "format": "double"
                                              },
                                              "expiryDate": {
                                                "type": "string",
                                                "format": "date-time"
                                              },
                                              "updatedAt": {
                                                "type": "string",
                                                "format": "date-time"
                                              },
                                              "categoryId": {
                                                "type": "string"
                                              },
                                              "condition": {
                                                "$ref": "#/components/schemas/_36_Enums.ToolCondition"
                                              },
                                              "imageUrl": {
                                                "type": "string"
                                              },
                                              "stock": {
                                                "type": "number",
                                                "format": "double"
                                              },
                                              "price": {
                                                "$ref": "#/components/schemas/Decimal"
                                              },
                                              "description": {
                                                "type": "string"
                                              },
                                              "name": {
                                                "type": "string"
                                              },
                                              "createdAt": {
                                                "type": "string",
                                                "format": "date-time"
                                              },
                                              "id": {
                                                "type": "string"
                                              }
                                            },
                                            "required": [
                                              "minThreshold",
                                              "maxThreshold",
                                              "expiryDate",
                                              "updatedAt",
                                              "categoryId",
                                              "condition",
                                              "imageUrl",
                                              "stock",
                                              "price",
                                              "description",
                                              "name",
                                              "createdAt",
                                              "id"
                                            ],
                                            "type": "object"
                                          }
                                        },
                                        "required": [
                                          "product"
                                        ],
                                        "type": "object"
                                      },
                                      {
                                        "properties": {
                                          "orderId": {
                                            "type": "string"
                                          },
                                          "quantity": {
                                            "type": "number",
                                            "format": "double"
                                          },
                                          "price": {
                                            "$ref": "#/components/schemas/Decimal"
                                          },
                                          "productId": {
                                            "type": "string"
                                          },
                                          "id": {
                                            "type": "string"
                                          }
                                        },
                                        "required": [
                                          "orderId",
                                          "quantity",
                                          "price",
                                          "productId",
                                          "id"
                                        ],
                                        "type": "object"
                                      }
                                    ]
                                  },
                                  "type": "array"
                                },
                                "user": {
                                  "properties": {
                                    "setupTokenExpiresAt": {
                                      "type": "string",
                                      "format": "date-time"
                                    },
                                    "setupToken": {
                                      "type": "string"
                                    },
                                    "role": {
                                      "$ref": "#/components/schemas/_36_Enums.Role"
                                    },
                                    "otpExpiresAt": {
                                      "type": "string",
                                      "format": "date-time"
                                    },
                                    "otp": {
                                      "type": "string"
                                    },
                                    "isVerified": {
                                      "type": "boolean"
                                    },
                                    "password": {
                                      "type": "string"
                                    },
                                    "email": {
                                      "type": "string"
                                    },
                                    "status": {
                                      "$ref": "#/components/schemas/_36_Enums.UserStatus"
                                    },
                                    "name": {
                                      "type": "string"
                                    },
                                    "createdAt": {
                                      "type": "string",
                                      "format": "date-time"
                                    },
                                    "id": {
                                      "type": "string"
                                    }
                                  },
                                  "required": [
                                    "setupTokenExpiresAt",
                                    "setupToken",
                                    "role",
                                    "otpExpiresAt",
                                    "otp",
                                    "isVerified",
                                    "password",
                                    "email",
                                    "status",
                                    "name",
                                    "createdAt",
                                    "id"
                                  ],
                                  "type": "object"
                                }
                              },
                              "required": [
                                "orderItems",
                                "user"
                              ],
                              "type": "object"
                            },
                            {
                              "properties": {
                                "transactionId": {
                                  "type": "string"
                                },
                                "phone": {
                                  "type": "string"
                                },
                                "paymentMethod": {
                                  "type": "string"
                                },
                                "fullName": {
                                  "type": "string"
                                },
                                "email": {
                                  "type": "string"
                                },
                                "totalAmount": {
                                  "$ref": "#/components/schemas/Decimal"
                                },
                                "shippingAddress": {
                                  "type": "string"
                                },
                                "status": {
                                  "$ref": "#/components/schemas/_36_Enums.OrderStatus"
                                },
                                "updatedAt": {
                                  "type": "string",
                                  "format": "date-time"
                                },
                                "createdAt": {
                                  "type": "string",
                                  "format": "date-time"
                                },
                                "userId": {
                                  "type": "string"
                                },
                                "id": {
                                  "type": "string"
                                }
                              },
                              "required": [
                                "transactionId",
                                "phone",
                                "paymentMethod",
                                "fullName",
                                "email",
                                "totalAmount",
                                "shippingAddress",
                                "status",
                                "updatedAt",
                                "createdAt",
                                "userId",
                                "id"
                              ],
                              "type": "object"
                            }
                          ]
                        },
                        "type": "array"
                      }
                    },
                    "required": [
                      "currentPage",
                      "totalPages",
                      "orders"
                    ],
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "Order"
          ],
          "security": [
            {
              "jwt": [
                "ADMIN"
              ]
            }
          ],
          "parameters": [
            {
              "in": "query",
              "name": "page",
              "required": false,
              "schema": {
                "default": 1,
                "format": "double",
                "type": "number"
              }
            }
          ]
        }
      },
      "/order/admin/{id}/status": {
        "put": {
          "operationId": "UpdateStatus",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "transactionId": {
                        "type": "string"
                      },
                      "phone": {
                        "type": "string"
                      },
                      "paymentMethod": {
                        "type": "string"
                      },
                      "fullName": {
                        "type": "string"
                      },
                      "email": {
                        "type": "string"
                      },
                      "totalAmount": {
                        "$ref": "#/components/schemas/Decimal"
                      },
                      "shippingAddress": {
                        "type": "string"
                      },
                      "status": {
                        "$ref": "#/components/schemas/_36_Enums.OrderStatus"
                      },
                      "updatedAt": {
                        "type": "string",
                        "format": "date-time"
                      },
                      "createdAt": {
                        "type": "string",
                        "format": "date-time"
                      },
                      "userId": {
                        "type": "string"
                      },
                      "id": {
                        "type": "string"
                      }
                    },
                    "required": [
                      "transactionId",
                      "phone",
                      "paymentMethod",
                      "fullName",
                      "email",
                      "totalAmount",
                      "shippingAddress",
                      "status",
                      "updatedAt",
                      "createdAt",
                      "userId",
                      "id"
                    ],
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "Order"
          ],
          "security": [
            {
              "jwt": [
                "ADMIN"
              ]
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "properties": {
                    "status": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "status"
                  ],
                  "type": "object"
                }
              }
            }
          }
        }
      },
      "/dashboard/summary": {
        "get": {
          "operationId": "GetSummary",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/DashboardSummary"
                  }
                }
              }
            }
          },
          "tags": [
            "Dashboard"
          ],
          "security": [
            {
              "jwt": []
            }
          ],
          "parameters": [
            {
              "in": "query",
              "name": "targetUserId",
              "required": false,
              "schema": {
                "type": "string"
              }
            }
          ]
        }
      },
      "/dashboard/recent-orders": {
        "get": {
          "operationId": "GetRecentOrders",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "totalPages": {
                        "type": "number",
                        "format": "double"
                      },
                      "orders": {
                        "items": {
                          "allOf": [
                            {
                              "properties": {
                                "orderItems": {
                                  "items": {
                                    "allOf": [
                                      {
                                        "properties": {
                                          "product": {
                                            "properties": {
                                              "minThreshold": {
                                                "type": "number",
                                                "format": "double"
                                              },
                                              "maxThreshold": {
                                                "type": "number",
                                                "format": "double"
                                              },
                                              "expiryDate": {
                                                "type": "string",
                                                "format": "date-time"
                                              },
                                              "updatedAt": {
                                                "type": "string",
                                                "format": "date-time"
                                              },
                                              "categoryId": {
                                                "type": "string"
                                              },
                                              "condition": {
                                                "$ref": "#/components/schemas/_36_Enums.ToolCondition"
                                              },
                                              "imageUrl": {
                                                "type": "string"
                                              },
                                              "stock": {
                                                "type": "number",
                                                "format": "double"
                                              },
                                              "price": {
                                                "$ref": "#/components/schemas/Decimal"
                                              },
                                              "description": {
                                                "type": "string"
                                              },
                                              "name": {
                                                "type": "string"
                                              },
                                              "createdAt": {
                                                "type": "string",
                                                "format": "date-time"
                                              },
                                              "id": {
                                                "type": "string"
                                              }
                                            },
                                            "required": [
                                              "minThreshold",
                                              "maxThreshold",
                                              "expiryDate",
                                              "updatedAt",
                                              "categoryId",
                                              "condition",
                                              "imageUrl",
                                              "stock",
                                              "price",
                                              "description",
                                              "name",
                                              "createdAt",
                                              "id"
                                            ],
                                            "type": "object"
                                          }
                                        },
                                        "required": [
                                          "product"
                                        ],
                                        "type": "object"
                                      },
                                      {
                                        "properties": {
                                          "orderId": {
                                            "type": "string"
                                          },
                                          "quantity": {
                                            "type": "number",
                                            "format": "double"
                                          },
                                          "price": {
                                            "$ref": "#/components/schemas/Decimal"
                                          },
                                          "productId": {
                                            "type": "string"
                                          },
                                          "id": {
                                            "type": "string"
                                          }
                                        },
                                        "required": [
                                          "orderId",
                                          "quantity",
                                          "price",
                                          "productId",
                                          "id"
                                        ],
                                        "type": "object"
                                      }
                                    ]
                                  },
                                  "type": "array"
                                }
                              },
                              "required": [
                                "orderItems"
                              ],
                              "type": "object"
                            },
                            {
                              "properties": {
                                "transactionId": {
                                  "type": "string"
                                },
                                "phone": {
                                  "type": "string"
                                },
                                "paymentMethod": {
                                  "type": "string"
                                },
                                "fullName": {
                                  "type": "string"
                                },
                                "email": {
                                  "type": "string"
                                },
                                "totalAmount": {
                                  "$ref": "#/components/schemas/Decimal"
                                },
                                "shippingAddress": {
                                  "type": "string"
                                },
                                "status": {
                                  "$ref": "#/components/schemas/_36_Enums.OrderStatus"
                                },
                                "updatedAt": {
                                  "type": "string",
                                  "format": "date-time"
                                },
                                "createdAt": {
                                  "type": "string",
                                  "format": "date-time"
                                },
                                "userId": {
                                  "type": "string"
                                },
                                "id": {
                                  "type": "string"
                                }
                              },
                              "required": [
                                "transactionId",
                                "phone",
                                "paymentMethod",
                                "fullName",
                                "email",
                                "totalAmount",
                                "shippingAddress",
                                "status",
                                "updatedAt",
                                "createdAt",
                                "userId",
                                "id"
                              ],
                              "type": "object"
                            }
                          ]
                        },
                        "type": "array"
                      }
                    },
                    "required": [
                      "totalPages",
                      "orders"
                    ],
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "Dashboard"
          ],
          "security": [
            {
              "jwt": []
            }
          ],
          "parameters": [
            {
              "in": "query",
              "name": "page",
              "required": false,
              "schema": {
                "default": 1,
                "format": "double",
                "type": "number"
              }
            }
          ]
        }
      },
      "/contact": {
        "post": {
          "operationId": "SendContactMessage",
          "responses": {
            "201": {
              "description": "Created",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/IContactResponse"
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request"
            }
          },
          "tags": [
            "Contact"
          ],
          "security": [],
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/IContactRequest"
                }
              }
            }
          }
        }
      },
      "/cart": {
        "post": {
          "operationId": "AddToCart",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "quantity": {
                        "type": "number",
                        "format": "double"
                      },
                      "updatedAt": {
                        "type": "string",
                        "format": "date-time"
                      },
                      "createdAt": {
                        "type": "string",
                        "format": "date-time"
                      },
                      "productId": {
                        "type": "string"
                      },
                      "userId": {
                        "type": "string"
                      },
                      "id": {
                        "type": "string"
                      }
                    },
                    "required": [
                      "quantity",
                      "updatedAt",
                      "createdAt",
                      "productId",
                      "userId",
                      "id"
                    ],
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "Cart"
          ],
          "security": [
            {
              "jwt": [
                "USER"
              ]
            }
          ],
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddToCartRequest"
                }
              }
            }
          }
        },
        "get": {
          "operationId": "GetCart",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "currentPage": {
                        "type": "number",
                        "format": "double"
                      },
                      "totalPages": {
                        "type": "number",
                        "format": "double"
                      },
                      "items": {
                        "items": {
                          "allOf": [
                            {
                              "properties": {
                                "product": {
                                  "properties": {
                                    "minThreshold": {
                                      "type": "number",
                                      "format": "double"
                                    },
                                    "maxThreshold": {
                                      "type": "number",
                                      "format": "double"
                                    },
                                    "expiryDate": {
                                      "type": "string",
                                      "format": "date-time"
                                    },
                                    "updatedAt": {
                                      "type": "string",
                                      "format": "date-time"
                                    },
                                    "categoryId": {
                                      "type": "string"
                                    },
                                    "condition": {
                                      "$ref": "#/components/schemas/_36_Enums.ToolCondition"
                                    },
                                    "imageUrl": {
                                      "type": "string"
                                    },
                                    "stock": {
                                      "type": "number",
                                      "format": "double"
                                    },
                                    "price": {
                                      "$ref": "#/components/schemas/Decimal"
                                    },
                                    "description": {
                                      "type": "string"
                                    },
                                    "name": {
                                      "type": "string"
                                    },
                                    "createdAt": {
                                      "type": "string",
                                      "format": "date-time"
                                    },
                                    "id": {
                                      "type": "string"
                                    }
                                  },
                                  "required": [
                                    "minThreshold",
                                    "maxThreshold",
                                    "expiryDate",
                                    "updatedAt",
                                    "categoryId",
                                    "condition",
                                    "imageUrl",
                                    "stock",
                                    "price",
                                    "description",
                                    "name",
                                    "createdAt",
                                    "id"
                                  ],
                                  "type": "object"
                                }
                              },
                              "required": [
                                "product"
                              ],
                              "type": "object"
                            },
                            {
                              "properties": {
                                "quantity": {
                                  "type": "number",
                                  "format": "double"
                                },
                                "updatedAt": {
                                  "type": "string",
                                  "format": "date-time"
                                },
                                "createdAt": {
                                  "type": "string",
                                  "format": "date-time"
                                },
                                "productId": {
                                  "type": "string"
                                },
                                "userId": {
                                  "type": "string"
                                },
                                "id": {
                                  "type": "string"
                                }
                              },
                              "required": [
                                "quantity",
                                "updatedAt",
                                "createdAt",
                                "productId",
                                "userId",
                                "id"
                              ],
                              "type": "object"
                            }
                          ]
                        },
                        "type": "array"
                      }
                    },
                    "required": [
                      "currentPage",
                      "totalPages",
                      "items"
                    ],
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "Cart"
          ],
          "security": [
            {
              "jwt": [
                "USER"
              ]
            }
          ],
          "parameters": [
            {
              "in": "query",
              "name": "page",
              "required": false,
              "schema": {
                "default": 1,
                "format": "double",
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "limit",
              "required": false,
              "schema": {
                "default": 10,
                "format": "double",
                "type": "number"
              }
            }
          ]
        },
        "delete": {
          "operationId": "ClearCart",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "tags": [
            "Cart"
          ],
          "security": [
            {
              "jwt": [
                "USER"
              ]
            }
          ],
          "parameters": []
        }
      },
      "/cart/{id}": {
        "put": {
          "operationId": "UpdateCartItem",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "quantity": {
                        "type": "number",
                        "format": "double"
                      },
                      "updatedAt": {
                        "type": "string",
                        "format": "date-time"
                      },
                      "createdAt": {
                        "type": "string",
                        "format": "date-time"
                      },
                      "productId": {
                        "type": "string"
                      },
                      "userId": {
                        "type": "string"
                      },
                      "id": {
                        "type": "string"
                      }
                    },
                    "required": [
                      "quantity",
                      "updatedAt",
                      "createdAt",
                      "productId",
                      "userId",
                      "id"
                    ],
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "Cart"
          ],
          "security": [
            {
              "jwt": [
                "USER"
              ]
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateCartRequest"
                }
              }
            }
          }
        },
        "delete": {
          "operationId": "RemoveFromCart",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "tags": [
            "Cart"
          ],
          "security": [
            {
              "jwt": [
                "USER"
              ]
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ]
        }
      },
      "/profile/me": {
        "post": {
          "operationId": "GetProfile",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserProfileResponse"
                  }
                }
              }
            }
          },
          "tags": [
            "Users"
          ],
          "security": [
            {
              "jwt": []
            }
          ],
          "parameters": []
        }
      },
      "/profile/update": {
        "patch": {
          "operationId": "UpdateProfile",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserProfileResponse"
                  }
                }
              }
            }
          },
          "tags": [
            "Users"
          ],
          "security": [
            {
              "jwt": []
            }
          ],
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "properties": {
                    "email": {
                      "type": "string"
                    },
                    "name": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "email",
                    "name"
                  ],
                  "type": "object"
                }
              }
            }
          }
        }
      },
      "/auth/signup": {
        "post": {
          "operationId": "SignUp",
          "responses": {
            "201": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "message": {
                        "type": "string"
                      }
                    },
                    "required": [
                      "message"
                    ],
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "Authentication"
          ],
          "security": [],
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SignUp"
                }
              }
            }
          }
        }
      },
      "/auth/login": {
        "post": {
          "operationId": "Login",
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "redirectUrl": {
                        "type": "string"
                      },
                      "email": {
                        "type": "string"
                      },
                      "requiresOtp": {
                        "type": "boolean"
                      },
                      "role": {
                        "type": "string"
                      },
                      "token": {
                        "type": "string"
                      },
                      "message": {
                        "type": "string"
                      }
                    },
                    "required": [
                      "message"
                    ],
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "Authentication"
          ],
          "security": [],
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Login"
                }
              }
            }
          }
        }
      },
      "/auth/verify-otp": {
        "post": {
          "operationId": "VerifyOtp",
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "redirectUrl": {
                        "type": "string"
                      },
                      "token": {
                        "type": "string"
                      },
                      "message": {
                        "type": "string"
                      }
                    },
                    "required": [
                      "redirectUrl",
                      "token",
                      "message"
                    ],
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "Authentication"
          ],
          "security": [],
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/VerifyOtp"
                }
              }
            }
          }
        }
      },
      "/auth/resend-otp": {
        "post": {
          "operationId": "ResendOtp",
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "message": {
                        "type": "string"
                      }
                    },
                    "required": [
                      "message"
                    ],
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "Authentication"
          ],
          "security": [],
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ResendOtp"
                }
              }
            }
          }
        }
      },
      "/auth/set-password": {
        "post": {
          "operationId": "SetPassword",
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "message": {
                        "type": "string"
                      }
                    },
                    "required": [
                      "message"
                    ],
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "Authentication"
          ],
          "security": [],
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "properties": {
                    "confirmPassword": {
                      "type": "string"
                    },
                    "password": {
                      "type": "string"
                    },
                    "token": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "confirmPassword",
                    "password",
                    "token"
                  ],
                  "type": "object"
                }
              }
            }
          }
        }
      },
      "/auth/logout": {
        "post": {
          "operationId": "Logout",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "message": {
                        "type": "string"
                      }
                    },
                    "required": [
                      "message"
                    ],
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "Authentication"
          ],
          "security": [
            {
              "jwt": [
                "USER",
                "ADMIN"
              ]
            }
          ],
          "parameters": []
        }
      },
      "/admin/users": {
        "get": {
          "operationId": "GetAllUsers",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PaginatedUsersResponse"
                  }
                }
              }
            }
          },
          "tags": [
            "Admin"
          ],
          "security": [
            {
              "jwt": [
                "ADMIN"
              ]
            }
          ],
          "parameters": [
            {
              "in": "query",
              "name": "page",
              "required": false,
              "schema": {
                "default": 1,
                "format": "double",
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "limit",
              "required": false,
              "schema": {
                "default": 10,
                "format": "double",
                "type": "number"
              }
            }
          ]
        },
        "post": {
          "operationId": "CreateUser",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserResponse"
                  }
                }
              }
            }
          },
          "tags": [
            "Admin"
          ],
          "security": [
            {
              "jwt": [
                "ADMIN"
              ]
            }
          ],
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AdminInviteRequest"
                }
              }
            }
          }
        }
      },
      "/admin/users/{id}": {
        "delete": {
          "operationId": "DeleteUser",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "message": {
                        "type": "string"
                      }
                    },
                    "required": [
                      "message"
                    ],
                    "type": "object"
                  }
                }
              }
            }
          },
          "tags": [
            "Admin"
          ],
          "security": [
            {
              "jwt": [
                "ADMIN"
              ]
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ]
        },
        "put": {
          "operationId": "UpdateUser",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserResponse"
                  }
                }
              }
            }
          },
          "tags": [
            "Admin"
          ],
          "security": [
            {
              "jwt": [
                "ADMIN"
              ]
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateUserRequest"
                }
              }
            }
          }
        }
      },
      "/admin/analytics/summary": {
        "get": {
          "operationId": "GetSummary",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/AdminSummaryResponse"
                  }
                }
              }
            }
          },
          "tags": [
            "Admin Analytics"
          ],
          "security": [
            {
              "jwt": [
                "ADMIN"
              ]
            }
          ],
          "parameters": []
        }
      },
      "/admin/analytics/carts": {
        "get": {
          "operationId": "GetActiveCarts",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PaginatedCartsResponse"
                  }
                }
              }
            }
          },
          "tags": [
            "Admin Analytics"
          ],
          "security": [
            {
              "jwt": [
                "ADMIN"
              ]
            }
          ],
          "parameters": [
            {
              "in": "query",
              "name": "page",
              "required": false,
              "schema": {
                "default": 1,
                "format": "double",
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "limit",
              "required": false,
              "schema": {
                "default": 10,
                "format": "double",
                "type": "number"
              }
            }
          ]
        }
      },
      "/admin/messages": {
        "post": {
          "operationId": "CreateMessage",
          "responses": {
            "201": {
              "description": "Created",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/IMessage"
                  }
                }
              }
            }
          },
          "security": [],
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ICreateMessageDto"
                }
              }
            }
          }
        },
        "get": {
          "operationId": "GetMessages",
          "responses": {
            "200": {
              "description": "Ok",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/IPaginatedMessagesResponse"
                  }
                }
              }
            }
          },
          "security": [
            {
              "jwt": [
                "ADMIN"
              ]
            }
          ],
          "parameters": [
            {
              "in": "query",
              "name": "page",
              "required": false,
              "schema": {
                "default": 1,
                "format": "double",
                "type": "number"
              }
            },
            {
              "in": "query",
              "name": "limit",
              "required": false,
              "schema": {
                "default": 10,
                "format": "double",
                "type": "number"
              }
            }
          ]
        }
      },
      "/admin/messages/{id}": {
        "delete": {
          "operationId": "DeleteMessage",
          "responses": {
            "204": {
              "description": "No Content"
            }
          },
          "security": [
            {
              "jwt": [
                "ADMIN"
              ]
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ]
        }
      }
    },
    "servers": [
      {
        "url": "/"
      }
    ]
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  var urls = options.swaggerUrls
  var customOptions = options.customOptions
  var spec1 = options.swaggerDoc
  var swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (var attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  var ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.oauth) {
    ui.initOAuth(customOptions.oauth)
  }

  if (customOptions.preauthorizeApiKey) {
    const key = customOptions.preauthorizeApiKey.authDefinitionKey;
    const value = customOptions.preauthorizeApiKey.apiKeyValue;
    if (!!key && !!value) {
      const pid = setInterval(() => {
        const authorized = ui.preauthorizeApiKey(key, value);
        if(!!authorized) clearInterval(pid);
      }, 500)

    }
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }

  window.ui = ui
}
