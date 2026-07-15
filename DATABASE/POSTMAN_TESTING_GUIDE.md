# DressMe Postman Testing Guide

**Last Updated:** 2026-07-14  
**Database:** Seeded with `npm run prisma:seed`  
**API Base URL:** `http://localhost:5000`

---

## 📋 Table of Contents

1. [Setup & Variables](#setup--variables)
2. [Authentication Flow](#authentication-flow)
3. [Browse Products](#browse-products)
4. [Shopping Cart](#shopping-cart)
5. [Addresses Management](#addresses-management)
6. [Orders & Checkout](#orders--checkout)
7. [Favorites](#favorites)
8. [Reviews](#reviews)
9. [Outfits](#outfits)
10. [Vendor Management](#vendor-management)
11. [Production Validation Checklist](#production-validation-checklist)

---

## Setup & Variables

### Environment Setup

1. **Create a new Postman Environment** named `DressMe Local`
2. **Set the following variables:**

| Variable | Initial Value | Example |
|----------|--------------|---------|
| `baseUrl` | `http://localhost:5000` | - |
| `token` | (empty) | Will be set after login |
| `userId` | (empty) | Extracted from login response |
| `productId` | (empty) | From product list |
| `variantId` | (empty) | From product variant |
| `cartId` | (empty) | From user's cart |
| `addressId` | (empty) | From address creation |
| `orderId` | (empty) | From order creation |
| `vendorId` | (empty) | From vendor list |
| `brandId` | (empty) | From brand list |
| `categoryId` | (empty) | From category list |
| `outfitId` | (empty) | From outfit creation |
| `favoriteProductId` | (empty) | From favorite action |

### Seeded Test Data

```
Test User:
Email: user001@dressme.co.ke
Password: Password123!

Vendor Account:
Email: user002@dressme.co.ke (has VENDOR role)
Password: Password123!

Sample Products:
PRODUCT001, PRODUCT002, ... PRODUCT100

Sample Brands:
BRAND001, BRAND002, ... BRAND010

Sample Categories:
Dresses, Shirts, Pants, Skirts, Jackets, Accessories, Footwear, Intimates

Sample Vendors:
BUSINESS001, BUSINESS002, ... BUSINESS005
```

---

## Authentication Flow

### Step 1: Register New User (Optional)

**Endpoint:** `POST /api/auth/register`  
**Authentication:** None  
**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Test Customer",
  "email": "testcustomer@dressme.co.ke",
  "password": "TestPassword123!"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid",
    "name": "Test Customer",
    "email": "testcustomer@dressme.co.ke",
    "role": "USER",
    "status": "ACTIVE",
    "createdAt": "2026-07-14T10:00:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation failed
- `409 Conflict`: Email already exists

---

### Step 2: Login User

**Endpoint:** `POST /api/auth/login`  
**Authentication:** None  
**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user001@dressme.co.ke",
  "password": "Password123!"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": "clxxx123",
      "role": "USER"
    }
  }
}
```

**Save to Postman Environment:**
- Click **Tests** tab and add:
```javascript
if (pm.response.code === 200) {
  const json = pm.response.json();
  pm.environment.set("token", json.data.token);
  pm.environment.set("userId", json.data.user.userId);
}
```

**Error Responses:**
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Invalid credentials
- `404 Not Found`: User not found

---

### Step 3: Verify Authentication

**Endpoint:** `GET /api/auth/me`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "userId": "clxxx123",
    "role": "USER"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token

---

## Browse Products

### Step 4: Get All Products

**Endpoint:** `GET /api/products`  
**Authentication:** None  
**Headers:**
```
Content-Type: application/json
```

**Query Parameters (Optional):**
```
?status=ACTIVE&gender=MALE&skip=0&take=10
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "clxxx456",
      "name": "PRODUCT001",
      "slug": "product001",
      "description": "Premium fashion item",
      "price": 2500.00,
      "stock": 45,
      "featured": true,
      "status": "ACTIVE",
      "gender": "MALE",
      "averageRating": 4.2,
      "reviewCount": 12,
      "vendor": {
        "id": "clxxx789",
        "shopName": "BUSINESS001"
      },
      "brand": {
        "id": "clxxx111",
        "name": "BRAND001"
      },
      "category": {
        "id": "clxxx222",
        "name": "Shirts"
      }
    }
  ],
  "pagination": {
    "total": 100,
    "skip": 0,
    "take": 10
  }
}
```

**Save to Postman Environment:**
- Extract first product ID:
```javascript
if (pm.response.code === 200) {
  const json = pm.response.json();
  pm.environment.set("productId", json.data[0].id);
  pm.environment.set("brandId", json.data[0].brand.id);
  pm.environment.set("categoryId", json.data[0].category.id);
  pm.environment.set("vendorId", json.data[0].vendor.id);
}
```

---

### Step 5: Get Product Details by Slug

**Endpoint:** `GET /api/products/:slug`  
**Authentication:** None  
**Headers:**
```
Content-Type: application/json
```

**Example URL:**
```
GET {{baseUrl}}/api/products/product001
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": "clxxx456",
    "name": "PRODUCT001",
    "slug": "product001",
    "description": "Premium fashion item",
    "price": 2500.00,
    "stock": 45,
    "sku": "SKU001",
    "featured": true,
    "status": "ACTIVE",
    "gender": "MALE",
    "averageRating": 4.2,
    "reviewCount": 12,
    "images": [
      {
        "id": "imgxxx1",
        "imageUrl": "https://example.com/image1.jpg",
        "isPrimary": true,
        "altText": "Product image"
      }
    ],
    "variants": [
      {
        "id": "varxxx001",
        "size": "M",
        "color": "Black",
        "stock": 15,
        "sku": "SKU-001-001",
        "price": 2600.00
      },
      {
        "id": "varxxx002",
        "size": "L",
        "color": "Black",
        "stock": 12,
        "sku": "SKU-001-002",
        "price": 2600.00
      }
    ],
    "vendor": {
      "id": "clxxx789",
      "shopName": "BUSINESS001"
    },
    "brand": {
      "id": "clxxx111",
      "name": "BRAND001"
    },
    "category": {
      "id": "clxxx222",
      "name": "Shirts"
    }
  }
}
```

**Save to Postman Environment:**
```javascript
if (pm.response.code === 200) {
  const json = pm.response.json();
  if (json.data.variants && json.data.variants.length > 0) {
    pm.environment.set("variantId", json.data.variants[0].id);
  }
}
```

**Error Responses:**
- `404 Not Found`: Product not found

---

## Shopping Cart

### Step 6: Get Current Cart

**Endpoint:** `GET /api/cart`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "data": {
    "id": "cartxxx123",
    "userId": "clxxx123",
    "items": [
      {
        "id": "itemxxx1",
        "productId": "clxxx456",
        "variantId": "varxxx001",
        "quantity": 2,
        "product": {
          "id": "clxxx456",
          "name": "PRODUCT001",
          "price": 2500.00
        },
        "variant": {
          "id": "varxxx001",
          "size": "M",
          "color": "Black",
          "price": 2600.00
        }
      }
    ],
    "createdAt": "2026-07-14T10:00:00Z",
    "updatedAt": "2026-07-14T10:05:00Z"
  }
}
```

**Save to Postman Environment:**
```javascript
if (pm.response.code === 200) {
  const json = pm.response.json();
  pm.environment.set("cartId", json.data.id);
}
```

**Error Responses:**
- `401 Unauthorized`: Missing token

---

### Step 7: Add Item to Cart

**Endpoint:** `POST /api/cart/items`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "productId": "{{productId}}",
  "variantId": "{{variantId}}",
  "quantity": 2
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    "id": "itemxxx2",
    "cartId": "cartxxx123",
    "productId": "clxxx456",
    "variantId": "varxxx001",
    "quantity": 2,
    "product": {
      "id": "clxxx456",
      "name": "PRODUCT001",
      "price": 2500.00
    },
    "variant": {
      "id": "varxxx001",
      "size": "M",
      "color": "Black",
      "price": 2600.00
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Missing token
- `404 Not Found`: Product or variant not found

---

### Step 8: Update Cart Item Quantity

**Endpoint:** `PATCH /api/cart/items/:itemId`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "quantity": 3
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Cart item updated successfully",
  "data": {
    "id": "itemxxx2",
    "quantity": 3
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid quantity
- `401 Unauthorized`: Missing token
- `404 Not Found`: Cart item not found

---

### Step 9: Remove Item from Cart

**Endpoint:** `DELETE /api/cart/items/:itemId`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Cart item removed successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing token
- `404 Not Found`: Cart item not found

---

### Step 10: Clear Cart

**Endpoint:** `DELETE /api/cart`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing token

---

## Addresses Management

### Step 11: Create Address

**Endpoint:** `POST /api/addresses`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "Jane Doe",
  "phone": "0712345678",
  "county": "Nairobi",
  "city": "Nairobi",
  "area": "Westlands",
  "street": "Mara Road",
  "building": "Block A, Apt 101",
  "postalCode": "00100",
  "landmark": "Near Safari Park Hotel",
  "label": "Home",
  "isDefault": true
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Address created successfully",
  "data": {
    "id": "addrxxx1",
    "userId": "clxxx123",
    "fullName": "Jane Doe",
    "phone": "0712345678",
    "county": "Nairobi",
    "city": "Nairobi",
    "area": "Westlands",
    "street": "Mara Road",
    "building": "Block A, Apt 101",
    "postalCode": "00100",
    "landmark": "Near Safari Park Hotel",
    "label": "Home",
    "isDefault": true,
    "createdAt": "2026-07-14T10:00:00Z",
    "updatedAt": "2026-07-14T10:00:00Z"
  }
}
```

**Save to Postman Environment:**
```javascript
if (pm.response.code === 201) {
  const json = pm.response.json();
  pm.environment.set("addressId", json.data.id);
}
```

**Error Responses:**
- `400 Bad Request`: Validation failed (invalid phone format or label)
- `401 Unauthorized`: Missing token
- `409 Conflict`: Duplicate address already exists

---

### Step 12: Get All Addresses

**Endpoint:** `GET /api/addresses`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Addresses retrieved successfully",
  "data": [
    {
      "id": "addrxxx1",
      "fullName": "Jane Doe",
      "label": "Home",
      "isDefault": true,
      "phone": "0712345678",
      "county": "Nairobi",
      "city": "Nairobi"
    },
    {
      "id": "addrxxx2",
      "fullName": "Jane Doe",
      "label": "Work",
      "isDefault": false,
      "phone": "0723456789",
      "county": "Kiambu",
      "city": "Thika"
    }
  ]
}
```

---

### Step 13: Get Default Address

**Endpoint:** `GET /api/addresses/default`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Default address retrieved successfully",
  "data": {
    "id": "addrxxx1",
    "fullName": "Jane Doe",
    "label": "Home",
    "isDefault": true,
    "phone": "0712345678",
    "county": "Nairobi",
    "city": "Nairobi",
    "area": "Westlands",
    "street": "Mara Road"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing token
- `404 Not Found`: No default address found

---

### Step 14: Get Single Address

**Endpoint:** `GET /api/addresses/:id`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Example URL:**
```
GET {{baseUrl}}/api/addresses/{{addressId}}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Address retrieved successfully",
  "data": {
    "id": "addrxxx1",
    "fullName": "Jane Doe",
    "phone": "0712345678",
    "county": "Nairobi",
    "city": "Nairobi",
    "area": "Westlands",
    "street": "Mara Road",
    "building": "Block A, Apt 101",
    "label": "Home",
    "isDefault": true
  }
}
```

---

### Step 15: Set Address as Default

**Endpoint:** `PATCH /api/addresses/:id/default`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Default address updated successfully",
  "data": {
    "id": "addrxxx1",
    "isDefault": true,
    "label": "Home"
  }
}
```

---

### Step 16: Update Address

**Endpoint:** `PATCH /api/addresses/:id`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "label": "Parents",
  "landmark": "Updated Landmark"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Address updated successfully",
  "data": {
    "id": "addrxxx1",
    "label": "Parents",
    "landmark": "Updated Landmark"
  }
}
```

---

### Step 17: Delete Address

**Endpoint:** `DELETE /api/addresses/:id`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing token
- `404 Not Found`: Address not found
- `409 Conflict`: Cannot delete your only saved address

---

## Orders & Checkout

### Step 18: Create Order (Checkout)

**Endpoint:** `POST /api/orders`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "addressId": "{{addressId}}"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "orderxxx1",
    "orderNumber": "ORD-2026071401",
    "userId": "clxxx123",
    "addressId": "addrxxx1",
    "subtotal": 5200.00,
    "shippingFee": 300.00,
    "tax": 520.00,
    "discount": 0,
    "total": 6020.00,
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "items": [
      {
        "id": "orderitemxxx1",
        "productName": "PRODUCT001",
        "variantName": "M - Black",
        "price": 2600.00,
        "quantity": 2,
        "subtotal": 5200.00
      }
    ],
    "createdAt": "2026-07-14T10:15:00Z"
  }
}
```

**Save to Postman Environment:**
```javascript
if (pm.response.code === 201) {
  const json = pm.response.json();
  pm.environment.set("orderId", json.data.id);
}
```

**Error Responses:**
- `400 Bad Request`: Missing address or empty cart
- `401 Unauthorized`: Missing token
- `404 Not Found`: Address not found
- `409 Conflict`: Address belongs to another user

---

### Step 19: Get My Orders

**Endpoint:** `GET /api/orders/my`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Query Parameters (Optional):**
```
?status=PENDING&skip=0&take=10
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id": "orderxxx1",
      "orderNumber": "ORD-2026071401",
      "total": 6020.00,
      "status": "PENDING",
      "paymentStatus": "PENDING",
      "createdAt": "2026-07-14T10:15:00Z",
      "address": {
        "city": "Nairobi",
        "county": "Nairobi"
      }
    }
  ],
  "pagination": {
    "total": 1,
    "skip": 0,
    "take": 10
  }
}
```

---

### Step 20: Get Order Details

**Endpoint:** `GET /api/orders/:id`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Example URL:**
```
GET {{baseUrl}}/api/orders/{{orderId}}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "id": "orderxxx1",
    "orderNumber": "ORD-2026071401",
    "userId": "clxxx123",
    "addressId": "addrxxx1",
    "subtotal": 5200.00,
    "shippingFee": 300.00,
    "tax": 520.00,
    "discount": 0,
    "total": 6020.00,
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "items": [
      {
        "id": "orderitemxxx1",
        "productName": "PRODUCT001",
        "productImage": "https://example.com/image.jpg",
        "variantName": "M - Black",
        "price": 2600.00,
        "quantity": 2,
        "subtotal": 5200.00
      }
    ],
    "address": {
      "fullName": "Jane Doe",
      "phone": "0712345678",
      "street": "Mara Road",
      "county": "Nairobi",
      "city": "Nairobi"
    },
    "createdAt": "2026-07-14T10:15:00Z",
    "updatedAt": "2026-07-14T10:15:00Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing token
- `404 Not Found`: Order not found or belongs to another user

---

### Step 21: Cancel Order

**Endpoint:** `PATCH /api/orders/:id/cancel`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "id": "orderxxx1",
    "status": "CANCELLED"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Order cannot be cancelled (already shipped/delivered)
- `401 Unauthorized`: Missing token
- `404 Not Found`: Order not found

---

## Favorites

### Step 22: Add to Favorites

**Endpoint:** `POST /api/favorites`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "productId": "{{productId}}"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Product added to favorites",
  "data": {
    "id": "favxxx1",
    "userId": "clxxx123",
    "productId": "clxxx456",
    "product": {
      "id": "clxxx456",
      "name": "PRODUCT001",
      "price": 2500.00
    },
    "createdAt": "2026-07-14T10:20:00Z"
  }
}
```

**Save to Postman Environment:**
```javascript
if (pm.response.code === 201) {
  const json = pm.response.json();
  pm.environment.set("favoriteProductId", json.data.productId);
}
```

**Error Responses:**
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Missing token
- `409 Conflict`: Product already in favorites

---

### Step 23: Get Favorites

**Endpoint:** `GET /api/favorites`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Favorites retrieved successfully",
  "data": [
    {
      "id": "favxxx1",
      "product": {
        "id": "clxxx456",
        "name": "PRODUCT001",
        "slug": "product001",
        "price": 2500.00,
        "averageRating": 4.2,
        "reviewCount": 12
      },
      "createdAt": "2026-07-14T10:20:00Z"
    }
  ]
}
```

---

### Step 24: Remove from Favorites

**Endpoint:** `DELETE /api/favorites/:productId`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Example URL:**
```
DELETE {{baseUrl}}/api/favorites/{{favoriteProductId}}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Product removed from favorites"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing token
- `404 Not Found`: Favorite not found

---

### Step 25: Clear Favorites

**Endpoint:** `DELETE /api/favorites`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Favorites cleared successfully"
}
```

---

## Reviews

### Step 26: Create Review

**Endpoint:** `POST /api/reviews`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "productId": "{{productId}}",
  "rating": 4,
  "comment": "Great product! Excellent quality and fast delivery."
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "id": "reviewxxx1",
    "userId": "clxxx123",
    "productId": "clxxx456",
    "rating": 4,
    "comment": "Great product! Excellent quality and fast delivery.",
    "user": {
      "id": "clxxx123",
      "name": "User001"
    },
    "createdAt": "2026-07-14T10:25:00Z",
    "updatedAt": "2026-07-14T10:25:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid rating (must be 1-5)
- `401 Unauthorized`: Missing token
- `409 Conflict`: User already reviewed this product

---

### Step 27: Get Product Reviews

**Endpoint:** `GET /api/reviews/products/:productId`  
**Authentication:** None  
**Headers:**
```
Content-Type: application/json
```

**Example URL:**
```
GET {{baseUrl}}/api/reviews/products/{{productId}}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Product reviews retrieved successfully",
  "data": [
    {
      "id": "reviewxxx1",
      "rating": 4,
      "comment": "Great product! Excellent quality and fast delivery.",
      "user": {
        "name": "User001"
      },
      "createdAt": "2026-07-14T10:25:00Z"
    },
    {
      "id": "reviewxxx2",
      "rating": 5,
      "comment": "Perfect! Highly recommend.",
      "user": {
        "name": "User002"
      },
      "createdAt": "2026-07-14T10:26:00Z"
    }
  ]
}
```

---

### Step 28: Get My Reviews

**Endpoint:** `GET /api/reviews/my`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Your reviews retrieved successfully",
  "data": [
    {
      "id": "reviewxxx1",
      "rating": 4,
      "comment": "Great product!",
      "product": {
        "id": "clxxx456",
        "name": "PRODUCT001",
        "slug": "product001"
      },
      "createdAt": "2026-07-14T10:25:00Z"
    }
  ]
}
```

---

### Step 29: Update Review

**Endpoint:** `PATCH /api/reviews/:id`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Amazing product! Updated my review."
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Review updated successfully",
  "data": {
    "id": "reviewxxx1",
    "rating": 5,
    "comment": "Amazing product! Updated my review.",
    "updatedAt": "2026-07-14T10:30:00Z"
  }
}
```

---

### Step 30: Delete Review

**Endpoint:** `DELETE /api/reviews/:id`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

---

## Outfits

### Step 31: Create Outfit

**Endpoint:** `POST /api/outfits`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Summer Party Look",
  "description": "Perfect outfit for summer parties and casual gatherings",
  "style": "Casual",
  "occasion": "Party",
  "season": "Summer",
  "productIds": ["{{productId}}"],
  "isPublic": true
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Outfit created successfully",
  "data": {
    "id": "outfitxxx1",
    "title": "Summer Party Look",
    "slug": "summer-party-look-clxxx123",
    "description": "Perfect outfit for summer parties and casual gatherings",
    "style": "Casual",
    "occasion": "Party",
    "season": "Summer",
    "isPublic": true,
    "creatorId": "clxxx123",
    "items": [
      {
        "id": "outfititemxxx1",
        "product": {
          "id": "clxxx456",
          "name": "PRODUCT001"
        }
      }
    ],
    "createdAt": "2026-07-14T10:35:00Z"
  }
}
```

**Save to Postman Environment:**
```javascript
if (pm.response.code === 201) {
  const json = pm.response.json();
  pm.environment.set("outfitId", json.data.id);
}
```

**Error Responses:**
- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Missing token

---

### Step 32: Get All Outfits

**Endpoint:** `GET /api/outfits`  
**Authentication:** None  
**Headers:**
```
Content-Type: application/json
```

**Query Parameters (Optional):**
```
?skip=0&take=10
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Outfits retrieved successfully",
  "data": [
    {
      "id": "outfitxxx1",
      "title": "Summer Party Look",
      "slug": "summer-party-look-clxxx123",
      "style": "Casual",
      "occasion": "Party",
      "likes": 15,
      "views": 234,
      "creator": {
        "id": "clxxx123",
        "name": "User001"
      },
      "items": [
        {
          "product": {
            "name": "PRODUCT001",
            "price": 2500.00
          }
        }
      ]
    }
  ]
}
```

---

### Step 33: Get Outfit by Slug

**Endpoint:** `GET /api/outfits/slug/:slug`  
**Authentication:** None  
**Headers:**
```
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Outfit retrieved successfully",
  "data": {
    "id": "outfitxxx1",
    "title": "Summer Party Look",
    "description": "Perfect outfit for summer parties",
    "style": "Casual",
    "occasion": "Party",
    "season": "Summer",
    "likes": 15,
    "views": 234,
    "creator": {
      "id": "clxxx123",
      "name": "User001"
    },
    "items": [
      {
        "product": {
          "id": "clxxx456",
          "name": "PRODUCT001",
          "price": 2500.00,
          "slug": "product001"
        }
      }
    ]
  }
}
```

---

### Step 34: Get My Outfits

**Endpoint:** `GET /api/outfits/my`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Your outfits retrieved successfully",
  "data": [
    {
      "id": "outfitxxx1",
      "title": "Summer Party Look",
      "slug": "summer-party-look-clxxx123",
      "style": "Casual",
      "occasion": "Party",
      "isPublic": true
    }
  ]
}
```

---

### Step 35: Get Saved Outfits

**Endpoint:** `GET /api/outfits/saved`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Saved outfits retrieved successfully",
  "data": [
    {
      "id": "outfitxxx1",
      "title": "Summer Party Look",
      "creator": {
        "name": "User002"
      }
    }
  ]
}
```

---

### Step 36: Update Outfit

**Endpoint:** `PATCH /api/outfits/:id`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Summer Party Look - Updated",
  "description": "Updated description",
  "isPublic": false
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Outfit updated successfully",
  "data": {
    "id": "outfitxxx1",
    "title": "Summer Party Look - Updated",
    "description": "Updated description",
    "isPublic": false
  }
}
```

---

### Step 37: Delete Outfit

**Endpoint:** `DELETE /api/outfits/:id`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Outfit deleted successfully"
}
```

---

### Step 38: Save Outfit

**Endpoint:** `POST /api/outfits/:id/save`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Outfit saved successfully"
}
```

---

### Step 39: Unsave Outfit

**Endpoint:** `DELETE /api/outfits/:id/save`  
**Authentication:** Required (Bearer Token)  
**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Outfit unsaved successfully"
}
```

---

## Vendor Management

### Step 40: Get All Vendors

**Endpoint:** `GET /api/vendors`  
**Authentication:** None  
**Headers:**
```
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Vendors retrieved successfully",
  "data": [
    {
      "id": "vendorxxx1",
      "shopName": "BUSINESS001",
      "phone": "0712345678",
      "location": "Nairobi",
      "description": "Premium fashion store",
      "verified": true,
      "facebook": "https://facebook.com/business001",
      "instagram": "https://instagram.com/business001",
      "productCount": 20
    }
  ]
}
```

---

### Step 41: Get Vendor Details

**Endpoint:** `GET /api/vendors/:id`  
**Authentication:** None  
**Headers:**
```
Content-Type: application/json
```

**Example URL:**
```
GET {{baseUrl}}/api/vendors/{{vendorId}}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Vendor retrieved successfully",
  "data": {
    "id": "vendorxxx1",
    "shopName": "BUSINESS001",
    "phone": "0712345678",
    "address": "123 Fashion Street",
    "location": "Nairobi",
    "description": "Premium fashion store offering quality items",
    "businessEmail": "business001@dressme.co.ke",
    "verified": true,
    "facebook": "https://facebook.com/business001",
    "instagram": "https://instagram.com/business001",
    "website": "https://business001.dressme.co.ke",
    "products": [
      {
        "id": "clxxx456",
        "name": "PRODUCT001",
        "price": 2500.00
      }
    ]
  }
}
```

---

## Production Validation Checklist

### ✅ Security & Access Control

**1. Unauthorized Access Prevention**
- [ ] Test: `GET /api/cart` without token → Should return `401 Unauthorized`
- [ ] Test: `POST /api/addresses` without token → Should return `401 Unauthorized`
- [ ] Test: `GET /api/orders` (non-admin user) → Should return `401 Unauthorized`
- [ ] Test: Invalid token → Should return `401 Unauthorized`

**2. User Isolation**
- [ ] Test: Get another user's order → Should return `404 Not Found` or `401 Unauthorized`
- [ ] Test: Delete another user's address → Should fail with `404` or `401`
- [ ] Test: Update another user's review → Should fail with `404` or `401`
- [ ] Test: Access another user's cart → Should show only own cart

**3. Role-Based Access**
- [ ] Test: Regular user creates product → Should return `403 Forbidden`
- [ ] Test: Regular user views admin orders → Should return `401 Unauthorized`
- [ ] Test: Vendor views vendor-only endpoints → Should succeed
- [ ] Test: Admin access to all endpoints → Should succeed

---

### ✅ Data Integrity & Relationships

**4. Stock Management**
- [ ] Before checkout: Get product details → Note stock count
- [ ] Create order with 2 items
- [ ] After checkout: Get product details → Stock should decrease by 2
- [ ] Create order exceeding stock → Should return `400 Bad Request`

**5. Cart Behavior**
- [ ] Add 3 items to cart
- [ ] Get cart → Should show 3 items
- [ ] Checkout → Order should contain same items
- [ ] Get cart after checkout → Cart should be empty
- [ ] Try checkout with empty cart → Should return `400 Bad Request`

**6. Address Validation**
- [ ] Create address with valid Kenyan phone → Should succeed
- [ ] Create address with invalid phone `1234567` → Should return `400 Bad Request`
- [ ] Create address with invalid label (numbers) → Should return `400 Bad Request`
- [ ] Create duplicate address → Should return `409 Conflict`
- [ ] Delete only address → Should return `409 Conflict`
- [ ] Set second address as default → First should automatically unset

**7. Default Address Logic**
- [ ] Create first address → Should automatically be default
- [ ] Create second address → Should not be default
- [ ] Set second address as default → First should become non-default
- [ ] Verify only one default exists

**8. Favorites**
- [ ] Add product to favorites → Should succeed
- [ ] Add same product again → Should return `409 Conflict`
- [ ] Get favorites → Should show product
- [ ] Remove from favorites → Should succeed
- [ ] Get favorites → Should not show product

**9. Reviews**
- [ ] Create review for product → Should succeed
- [ ] Create second review for same product → Should return `409 Conflict`
- [ ] Get product reviews → Should show 1 review with correct rating
- [ ] Update review with new rating → Product average should update
- [ ] Delete review → Product average should recalculate

**10. Product Variants**
- [ ] Get product details → Should have 3-5 variants
- [ ] Add variant to cart → Should include size and color
- [ ] Add same product different variant → Should be separate cart item
- [ ] Remove variant from cart → Cart quantity should decrease

---

### ✅ Validation & Error Handling

**11. Request Validation**
- [ ] Register with missing name → Should return `400 Bad Request`
- [ ] Login with missing password → Should return `400 Bad Request`
- [ ] Create address with short name → Should return `400 Bad Request`
- [ ] Create review with rating 6 → Should return `400 Bad Request`
- [ ] Create order with invalid addressId → Should return `400 Bad Request`

**12. Not Found Errors**
- [ ] Get non-existent product → Should return `404 Not Found`
- [ ] Get non-existent order → Should return `404 Not Found`
- [ ] Get non-existent address → Should return `404 Not Found`
- [ ] Delete non-existent cart item → Should return `404 Not Found`

**13. Conflict Errors**
- [ ] Register with existing email → Should return `409 Conflict`
- [ ] Create duplicate address → Should return `409 Conflict`
- [ ] Add duplicate favorite → Should return `409 Conflict`
- [ ] Create duplicate review → Should return `409 Conflict`

---

### ✅ Data Consistency

**14. Order Consistency**
- [ ] Create order → Verify all items copied to order items
- [ ] Product prices frozen in order (not updated if product price changes)
- [ ] Order status changes preserved (PENDING → PROCESSING → SHIPPED)
- [ ] Cannot modify shipped/delivered orders

**15. Cart Consistency**
- [ ] Add item with quantity 5
- [ ] Update to quantity 3 → Should show 3
- [ ] Update to quantity 0 → Should remove item
- [ ] Remove from cart → Item gone, quantity reflects

**16. Outfit Consistency**
- [ ] Create outfit with 3 products
- [ ] Get outfit → All 3 products present
- [ ] Update outfit → Changes reflected
- [ ] Delete outfit → Cannot access afterwards

---

### ✅ Seeded Data Quality

**17. User Seeding**
- [ ] All 20 users exist (USER001-USER020)
- [ ] Login with user001@dressme.co.ke → Success
- [ ] Passwords are hashed (can login)
- [ ] First user is ADMIN role
- [ ] Other users are USER role

**18. Product Seeding**
- [ ] 100 products exist
- [ ] All products have variants (3-5 each)
- [ ] All products linked to vendors
- [ ] All products linked to brands
- [ ] All products linked to categories
- [ ] Product stock varies

**19. Vendor Seeding**
- [ ] 5 vendors created
- [ ] Vendors linked to users
- [ ] Vendor users have VENDOR role
- [ ] Vendor products accessible

**20. Address Seeding**
- [ ] Each user has 2 addresses
- [ ] First address is default
- [ ] Addresses have valid Kenyan data
- [ ] Phone numbers valid format

---

### ✅ Response Format

**21. Successful Responses**
- [ ] All `200/201` responses have `success: true`
- [ ] All responses have `message` field
- [ ] All responses have `data` field
- [ ] Consistent structure across endpoints

**22. Error Responses**
- [ ] All errors have `success: false`
- [ ] Errors have `message` explaining issue
- [ ] Status codes are accurate (400, 401, 403, 404, 409, 500)
- [ ] No sensitive data in error messages

---

### ✅ Performance

**23. Response Times**
- [ ] List endpoints return in < 1 second
- [ ] Detail endpoints return in < 500ms
- [ ] Create operations in < 1 second
- [ ] Pagination works (skip/take parameters)

**24. Database**
- [ ] No N+1 query problems
- [ ] Relationships properly loaded
- [ ] Data efficiently retrieved
- [ ] Indexes on foreign keys

---

### ✅ Complete User Journey

**Journey: Browse → Add to Cart → Checkout → Leave Review**

1. [ ] Register/Login → Get token
2. [ ] Browse products → Get product list
3. [ ] View product details → See variants
4. [ ] Add to cart with variant → Cart updated
5. [ ] Add address → Address created
6. [ ] Checkout → Order created, cart cleared
7. [ ] View order → Order details correct
8. [ ] Leave review → Review created
9. [ ] View review on product → Visible
10. [ ] Add to favorites → Favorite saved

---

### ✅ Admin Journey

**Journey: View Dashboard → Manage Products → Update Order Status**

1. [ ] Login as admin → Token received
2. [ ] View all orders → Admin access
3. [ ] Get vendor orders (as vendor) → Filtered correctly
4. [ ] Update order status → Status changed
5. [ ] Update payment status → Payment status changed
6. [ ] Delete product (as admin) → Product deleted
7. [ ] View product stats → Accurate

---

## Conclusion

This comprehensive guide provides:
- ✅ All 40+ endpoints documented
- ✅ Real seeded data examples
- ✅ Step-by-step customer journey
- ✅ Variable usage and extraction
- ✅ Complete production validation
- ✅ Security & data integrity checks
- ✅ Error scenarios and responses
- ✅ Ready-to-use Postman flow

**Next Steps:**
1. Import this guide into Postman
2. Run through each endpoint in order
3. Verify all variables auto-populate
4. Complete the Production Validation Checklist
5. Confirm backend is production-ready

---

**Document Version:** 1.0.0  
**Status:** Production-Ready ✅  
**Last Updated:** 2026-07-14
