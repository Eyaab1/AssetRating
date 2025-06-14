
# Technical Documentation

## Backend Architecture

### Asset Management System

#### Core Components

1. **Asset Model (`Asset.java`)**
   - Base abstract class for all asset types
   - Implements inheritance strategy using `@Inheritance(strategy = InheritanceType.SINGLE_TABLE)`
   - Key attributes:
     - `id`: Unique identifier
     - `name`: Asset name
     - `label`: Display label
     - `publisher`: Publisher information
     - `status`: Current status
     - `downloadCount`: Number of downloads
     - `tags`: Associated tags
     - `categories`: Associated categories
     - `releases`: Asset release history

2. **Asset Types**
   - Widget
   - Sheet
   - Template
   - Theme
   - UILibrary
   - Connector
   - Utility

#### Service Layer

1. **AssetService (`AssetService.java`)**
   - Core business logic implementation
   - Key functions:
     ```java
     // Asset CRUD Operations
     getAllAssets() // Retrieves all non-released assets
     getAssetById(String id) // Retrieves specific asset
     createAssetWithFile(AssetRequest request, MultipartFile documentation) // Creates new asset
     updateAsset(String id, Asset asset) // Updates existing asset
     deleteAsset(String id) // Soft deletes asset

     // Asset Release Management
     uploadAssetRelease(AssetReleaseRequest request) // Handles new releases
     getReleasesByAsset(String assetId) // Retrieves release history
     uploadReleaseDocumentation(MultipartFile file) // Handles documentation uploads

     // Asset Filtering
     filterAssets(String type, String name, String publisher, Status status, ...) // Filters assets based on criteria
     getAssetsByCategory(Long categoryId) // Retrieves assets by category
     ```

2. **Rating System (`RatingController.java`)**
   - Handles asset ratings and reviews
   - Endpoints:
     - POST `/api/ratings`: Submit new rating
     - GET `/api/ratings/{assetId}`: Get ratings for asset
     - GET `/api/ratings/user/{userId}`: Get user's ratings

## Frontend Architecture

### Core Services

1. **AssetService (`asset-service.service.ts`)**
   ```typescript
   // Asset Operations
   getAllAssets(): Observable<Asset[]>
   getAssetById(id: string): Observable<Asset>
   createAsset(asset: Asset): Observable<Asset>
   updateAsset(id: string, asset: Asset): Observable<Asset>
   deleteAsset(id: string): Observable<void>

   // Release Management
   getReleasesByAsset(assetId: string): Observable<AssetRelease[]>
   ```

2. **AdminAssetService (`admin-asset.service.ts`)**
   ```typescript
   // Admin-specific Operations
   uploadAssetRelease(payload: {
     originalAssetId: string;
     version: string;
     documentation: string;
     fileUrl: string;
   }): Observable<Asset>

   getReleasesByAsset(assetId: string): Observable<AssetRelease[]>
   ```

### Models

1. **Asset Model (`asset.ts`)**
   ```typescript
   class Asset {
     id: string;
     name: string;
     type: AssetType;
     label: string;
     publisher: string;
     publisherMail: string;
     publishDate: Date;
     license: LicenseType;
     status: StatusType;
     image: string;
     description: string;
     downloadCount: number;
     documentation: string;
     projectType: ProjectType;
     tags: Tag[];
     categories: Category[];
     releases?: AssetRelease[];
     parentAsset: Asset | null;
     ratings?: Rating[];
     comments?: Comment[];
     averageRating?: number;
     reviewsCount?: number;
   }
   ```

2. **AssetRelease Model (`asset-release.ts`)**
   ```typescript
   class AssetRelease {
     id: number;
     releaseVersion: string;
     publishedDate: Date;
     asset: Asset;
     releasedAsset: Asset;
   }
   ```

## Key Features Implementation

### 1. Asset Management
- Hierarchical asset structure with inheritance
- Support for multiple asset types
- File upload and documentation management
- Version control through releases

### 2. Rating System
- User-based ratings
- Average rating calculation
- Review management
- Rating analytics

### 3. Category and Tag System
- Multi-category support
- Tag-based organization
- Flexible categorization

### 4. Security
- Role-based access control
- JWT authentication
- Secure file handling

### 5. File Management
- Secure file uploads
- Documentation versioning
- File type validation

## API Endpoints

### Asset Endpoints
- GET `/api/assets`: List all assets
- GET `/api/assets/{id}`: Get specific asset
- POST `/api/assets`: Create new asset
- PUT `/api/assets/{id}`: Update asset
- DELETE `/api/assets/{id}`: Delete asset

### Release Endpoints
- POST `/api/assets/release/full`: Create new release
- GET `/api/assets/{assetId}/releases`: Get asset releases
- POST `/api/assets/releases/docs/upload`: Upload release documentation

### Rating Endpoints
- POST `/api/ratings`: Submit rating
- GET `/api/ratings/{assetId}`: Get asset ratings
- GET `/api/ratings/user/{userId}`: Get user ratings
