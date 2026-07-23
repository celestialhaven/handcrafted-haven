# WDD 430 – Week 2 Group Project Report

## Handcrafted Haven

**Student Name:** Jones G. Mabala
**Group Number:** Team 3
**Meeting Date:** Wednesdays 
**Meeting Time:** 17 00 (UTC-0)
**Meeting Platform or Location:** MS TEAMS

## 1. Meeting Participants

The following group members participated in the meeting:

* Jones G. Mabala
* Armando Martin Fernandez Jara
* Eluwa V. Monday (I didn't attend the first call with this group, adding this line 
for init commit on this branch).


## 2. Meeting Summary

During our group meeting, we reviewed the requirements and scope of the Handcrafted Haven project. We discussed the main purpose of the application, which is to provide an online marketplace where artisans can create seller profiles, showcase handcrafted products, and connect with interested customers.

We identified the main required features, including seller profiles, product listings, product browsing, category and price filtering, ratings, and written product reviews.

The group also discussed the development technologies that will be used. The application will be developed using Next.js and TypeScript. GitHub will be used for source-code management, while GitHub Projects will be used to organize user stories, assignments, and development progress. The completed application will be deployed using Vercel.

We created a public GitHub repository and associated GitHub Project board. Group members were invited as collaborators, and each member was instructed to clone the repository to their local computer.

The group also began planning the visual design of the application. We selected a warm and natural visual theme that represents handmade products and craftsmanship. The design uses forest green, terracotta, cream, gold, and charcoal colors. Playfair Display was selected for headings, while Inter was selected for normal body text.

Finally, we brainstormed the initial user stories and work items that will guide the development of the project. Responsibilities will be assigned through the GitHub Project board, and each major feature will be developed on a separate Git branch before being reviewed and merged.

## 3. Project Purpose

Handcrafted Haven is a web marketplace for unique handmade products. It will allow artisans to share their stories, create seller profiles, and publish their products online.

Customers will be able to browse the catalog, filter products, view seller information, and leave ratings and written reviews.

## 4. Project Requirements

The application should include:

* Authenticated seller accounts
* Seller-profile pages
* Product listings
* Product names, descriptions, prices, categories, and images
* A browsable product catalog
* Product category filters
* Product price filters
* Individual product-detail pages
* Product ratings
* Written product reviews
* Responsive navigation and layouts
* Accessible and readable content
* Consistent branding
* SEO-friendly pages
* Database integration
* Deployment to Vercel

## 5. Project Limitations

The group has a limited development period, so the first version will focus on the required marketplace features.

The following features may be treated as optional unless the instructor confirms that they are required:

* Online payment processing
* Shopping-cart functionality
* Order tracking
* Shipping calculations
* Real-time messaging
* Advanced seller analytics
* Wishlist functionality

The group will prioritize a complete and functional application over adding too many unfinished features.

## 6. Repository and Project Board

**GitHub Repository URL:**
https://github.com/celestialhaven/handcrafted-haven.git

**GitHub Project Board URL:**
https://github.com/users/celestialhaven/projects/2

## 7. Evidence of Local Repository Clone

I might be working alone, but there is one that would like to join I have added him as collaborator

**Screenshot:**

public\image.png

## 8. Design Theme

### Design Concept

The visual theme is inspired by natural materials and handcrafted products such as woodwork, pottery, textiles, jewelry, and woven goods. The design will use warm colors, clear typography, product-focused images, and generous spacing.

### Color Palette

* Deep Forest: `#264653`
* Terracotta: `#E76F51`
* Golden Sand: `#E9C46A`
* Light Cream: `#FAF8F3`
* Soft Beige: `#F4E1C1`
* Charcoal: `#2B2D2F`

### Typography

* Heading font: Playfair Display
* Body font: Inter
* Backup font: Arial or sans-serif

### General Layout

The proposed application layout includes:

* Header with logo, navigation, search, and account access
* Hero section promoting unique handcrafted products
* Featured-product section
* Product categories
* Artisan or seller highlights
* Product cards in a responsive grid
* Footer containing project information and navigation links

### Component Style

Components will use:

* Rounded product cards
* Clear buttons
* Visible focus indicators
* Consistent spacing
* Responsive image sizes
* Proper heading hierarchy
* Accessible form labels
* Subtle shadows and hover effects

**Design Evidence:**

[Insert screenshot of the color palette, wireframe, Figma design, Canva design, or hand-drawn layout here]

## 9. Initial User Stories and Work Items

### 1. Create the Next.js Project

**User story:** As a developer, I need a properly configured Next.js application so the group can begin developing the website.

**Description:** Initialize the project using Next.js, TypeScript, ESLint, and a `src` directory. Add the project to the group repository and confirm that all members can run it locally.

### 2. Build the Main Navigation

**User story:** As a visitor, I want clear navigation so I can easily move between the main sections of the website.

**Description:** Create a responsive header containing the logo, home link, products link, sellers link, about link, and account access.

### 3. Build the Home Page

**User story:** As a visitor, I want to understand the purpose of Handcrafted Haven when I open the website.

**Description:** Create a home page containing a hero section, featured products, popular categories, featured artisans, and calls to action.

### 4. Create a Reusable Product Card

**User story:** As a visitor, I want product information presented consistently so I can easily compare products.

**Description:** Create a reusable card component containing the product image, product name, seller name, price, category, and rating.

### 5. Build the Product Catalog

**User story:** As a customer, I want to browse all available products so I can discover handcrafted items.

**Description:** Create a responsive product catalog that obtains product information from the application database.

### 6. Add Product Filtering

**User story:** As a customer, I want to filter products by category and price so I can find products that match my interests and budget.

**Description:** Add category and price-range filtering to the product catalog. Display a useful message when no products match the selected filters.

### 7. Build the Product-Detail Page

**User story:** As a customer, I want to view complete product information before deciding whether I am interested in an item.

**Description:** Create a dynamic product page containing the product image, name, description, price, category, seller information, rating, and reviews.

### 8. Build Seller Profiles

**User story:** As an artisan, I want a seller profile so customers can learn about me and view my products.

**Description:** Create seller-profile pages containing the seller name, photograph, biography, location, and collection of products.

### 9. Create Product Listings

**User story:** As an authenticated seller, I want to create product listings so I can showcase my handcrafted products.

**Description:** Create a protected form that allows sellers to enter a product name, description, price, category, image, and availability status.

### 10. Edit and Delete Product Listings

**User story:** As a seller, I want to manage my existing product listings so that the information remains accurate.

**Description:** Allow authenticated sellers to edit or remove only the products associated with their own account.

### 11. Add Ratings and Reviews

**User story:** As a user, I want to rate and review products so I can share my experience with other customers.

**Description:** Create a review form with a numerical rating and written comment. Display existing reviews and calculate the average product rating.

### 12. Create the Database

**User story:** As a development team, we need persistent data storage so product, seller, and review information is not lost.

**Description:** Configure the selected database and create data models for users, seller profiles, products, categories, and reviews.

### 13. Add Authentication

**User story:** As a seller, I want to securely sign in so I can manage my profile and products.

**Description:** Implement authentication and protect seller-only pages and actions from unauthorized access.

### 14. Perform Responsive and Accessibility Testing

**User story:** As a user, I want the application to work on different devices and with assistive technology.

**Description:** Test the application on desktop, tablet, and mobile screens. Check keyboard navigation, text contrast, image alternative text, form labels, and heading order.

### 15. Deploy the Application

**User story:** As an evaluator, I want access to a deployed application so I can review and test the completed project.

**Description:** Connect the GitHub repository to Vercel, configure the required environment variables, and verify that the production application works correctly.

## 10. Initial Responsibility Assignments

| Work Item                | Assigned Member | Status      |
| ------------------------ | --------------- | ----------- |
| Next.js project setup    | [Name]          | To Do       |
| README and documentation | Jones G. Mabala | Complete    |
| Design system            | [Name]          | To Do       |
| Navigation component     | [Name]          | To Do       |
| Home page                | [Name]          | To Do       |
| Product card             | [Name]          | To Do       |
| Database research        | [Name]          | To Do       |
| Authentication research  | [Name]          | To Do       |

## 11. Next Steps

Before the next meeting, the group will:

1. Complete the initial Next.js project setup.
2. Finalize the design theme.
3. Add the user stories to the GitHub Project board.
4. Assign initial development tasks.
5. Begin building the landing page and reusable components.
6. Report progress and unresolved issues in the next group meeting.
