# Handcrafted Haven

Handcrafted Haven is a full-stack marketplace web application designed to help artisans showcase and sell unique handcrafted products. The platform connects creators with customers who appreciate handmade, locally produced, and sustainable items.

## Project Purpose

The purpose of Handcrafted Haven is to provide artisans with an accessible online platform where they can:

* Create and manage seller profiles.
* Share information about their craft and background.
* Create product listings with descriptions, prices, categories, and images.
* Present their handcrafted products to a larger audience.

Customers will be able to:

* Browse available handcrafted products.
* Filter products by category and price.
* View detailed product and seller information.
* Submit product ratings and written reviews.

## Core Features

### Seller Profiles

Authenticated sellers will have dedicated profile pages containing:

* Seller name
* Profile image
* Biography or craft story
* Location
* Contact or social information
* Collection of listed products

### Product Listings

Sellers will be able to create product listings containing:

* Product name
* Product description
* Product image
* Category
* Price
* Seller information
* Availability status

### Product Catalog

Visitors will be able to:

* Browse all available products.
* Search for products.
* Filter products by category.
* Filter products by price range.
* Open individual product-detail pages.

### Reviews and Ratings

Users will be able to:

* Give products a numerical rating.
* Write product reviews.
* View previous ratings and reviews.
* See the average rating for each product.

## Technology Stack

### Front End

* Next.js
* React
* TypeScript
* HTML
* CSS
* Responsive design

### Back End

* Node.js
* Next.js server actions or API routes
* Database: [Insert selected database]
* Authentication: [Insert selected authentication service]

### Development and Deployment

* Git
* GitHub
* GitHub Projects
* Vercel

## Design Goals

The website will follow these design principles:

* Responsive on desktop, tablet, and mobile devices
* Accessible to users with disabilities
* Clear and consistent navigation
* Readable typography
* Consistent branding and color usage
* Optimized images and page performance
* Search-engine-friendly page content and metadata

## Proposed Design System

### Color Palette

* Deep Forest: `#264653`
* Terracotta: `#E76F51`
* Golden Sand: `#E9C46A`
* Light Cream: `#FAF8F3`
* Soft Beige: `#F4E1C1`
* Charcoal: `#2B2D2F`

### Typography

* Headings: Playfair Display
* Body text: Inter
* Alternative system fonts: Arial, Helvetica, sans-serif

### Visual Style

Handcrafted Haven will use warm, natural colors inspired by wood, fabric, pottery, and other handcrafted materials. Product photography will be emphasized through clean cards, generous spacing, rounded corners, and subtle shadows.

## Proposed Pages

1. Home page
2. Product catalog
3. Product details
4. Seller directory
5. Seller profile
6. Create product listing
7. Edit product listing
8. Sign-in page
9. Registration page
10. About page
11. Contact page
12. Error and not-found pages

## Suggested Data Models

### User

* `id`
* `name`
* `email`
* `passwordHash` or authentication-provider ID
* `role`
* `image`
* `createdAt`
* `updatedAt`

### Seller Profile

* `id`
* `userId`
* `businessName`
* `biography`
* `location`
* `profileImage`
* `socialLinks`
* `createdAt`
* `updatedAt`

### Product

* `id`
* `sellerId`
* `name`
* `description`
* `price`
* `category`
* `imageUrl`
* `availability`
* `createdAt`
* `updatedAt`

### Review

* `id`
* `productId`
* `userName` or `userId`
* `rating`
* `comment`
* `createdAt`

### Category

* `id`
* `name`
* `slug`
* `description`

## Getting Started

Clone the repository:

```bash
git clone [repository-url]
```

Move into the project directory:

```bash
cd handcrafted-haven
```

Install the dependencies:

```bash
npm install
```

Create an environment file:

```bash
cp .env.example .env.local
```

Start the development server:

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

## Environment Variables

The following variables may be required:

```env
DATABASE_URL=
AUTH_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Do not commit `.env.local` or private credentials to GitHub.

## Development Workflow

Before working on a new task:

```bash
git checkout main
git pull origin main
```

Create a new feature branch:

```bash
git checkout -b feature/product-catalog
```

After completing your changes:

```bash
git add .
git commit -m "Add product catalog page"
git push origin feature/product-catalog
```

Create a pull request on GitHub. Another group member should review the changes before merging them into the `main` branch.

## Branch Naming

Use descriptive branch names:

```text
feature/home-page
feature/product-filter
feature/seller-profile
fix/mobile-navigation
docs/update-readme
```

## Commit Message Examples

```text
Add responsive product card component
Create seller profile data model
Fix mobile navigation alignment
Update project documentation
```

## Group Members

* Jones G. Mabala [jonzmabz04@gmail.com or celestialhaven]
* [Member 2]
* [Member 3]
* [Member 4]

## Project Links

* GitHub Repository: https://github.com/celestialhaven/handcrafted-haven.git
* GitHub Project Board: https://github.com/users/celestialhaven/projects/2
* Deployed Application: [Vercel]
* Demonstration Video: [Insert URL]

## Current Project Scope

The initial project will focus on seller profiles, product listings, product discovery, filtering, ratings, and reviews.

Online payment processing and complete order management will only be implemented if they are confirmed as required and the group has sufficient development time.

## License

This project was developed for the WDD 430 Web Full-Stack Development course at Brigham Young University–Idaho.
