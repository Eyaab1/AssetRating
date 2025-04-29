import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CommentComponent } from '../comment/comment.component';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { ReviewPopupComponent } from '../review-popup/review-popup.component';
import { Comment } from '../../../../shared/models/comment';
import { Asset } from '../../../../shared/models/asset';
import { AssetServiceService } from '../../../../shared/services/asset-service.service';
import { CommentService } from '../../../../shared/services/comment.service';
import { RatingService } from '../../../../shared/services/rating.service';
import { Rating } from '../../../../shared/models/rating';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../../../../shared/decoded-token';
import { ReviewComponentComponent } from '../../review-component/review-component.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AssetRelease } from '../../../../shared/models/asset-release';

@Component({
  selector: 'app-detail-asset',
  standalone: true,
  imports: [CommonModule, CommentComponent, ReviewPopupComponent,ReviewComponentComponent,FormsModule ],
  templateUrl: './detail-asset.component.html',
  styleUrl: './detail-asset.component.css'
})
export class DetailAssetComponent {
  //declaration
  
  private userId: string = '';
  comments: Comment[] = [];
  ratings: Rating[] = [];
  assetSelected!: Asset | undefined;
  activeTab: 'docs' | 'releases' = 'docs';
  sameCategoryAssets: Asset[] = [];
  safeDocUrl: SafeResourceUrl | null = null;
  assetReleases: AssetRelease[] = [];
  releaseDocFile: File | null = null;
  newReleaseDate: string = '';
  showReleasePopup = false;
  newReleaseVersion = '';
  newReleaseDoc = '';
  newReleaseFileObject: File | null = null;
  newReleaseFile = '';
  selectedRelease: AssetRelease | null = null;
  

  categoryAverages: { [key: string]: number } = {};

  ratingCategories: { label: string, field: string }[] = [
    { label: 'Functionality', field: 'functionality' },
    { label: 'Performance', field: 'performance' },
    { label: 'Integration', field: 'integration' },
    { label: 'Documentation', field: 'documentation' }
  ];


  constructor(
    private route: ActivatedRoute,
    private assetService: AssetServiceService,
    private commentService: CommentService,
    private ratingService: RatingService,
    private sanitizer: DomSanitizer 
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      this.userId = decoded.userId?.toString() ?? '';
    }
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.assetService.getAssetById(id).subscribe({
        next: (data) => {
          this.assetSelected = data;
          if (this.assetSelected.documentation) {
            this.safeDocUrl = this.sanitizer.bypassSecurityTrustResourceUrl('http://localhost:8080' + this.assetSelected.documentation);
          }
          if (this.assetSelected) {
            this.loadComments();
            this.loadRatings(this.assetSelected.id);
            if (this.assetSelected.categories?.length > 0) {
              const firstCategory = this.assetSelected.categories[0];
              if (firstCategory.id !== null) {
                this.loadSameCategoryAssets(firstCategory.id);
              }
            }
            this.loadReleases(this.assetSelected.id);
            this.ratingService.getAverageRatingPerCategory(this.assetSelected.id).subscribe({
              next: (averages) => {
                this.categoryAverages = averages;
              },
              error: (err) => {
                console.error('Error fetching average ratings by category', err);
              }
            });
          }
        },
        error: (err) => console.error('Error fetching asset', err)
      });
    }
   
    
  }

  //loading
  loadComments() {
    const assetId = this.assetSelected?.id;
    if (!assetId) return;
  
    this.commentService.getCommentsByAsset(assetId).subscribe({
      next: data => {
        // Filter root comments (those without parentReviewId)
        this.comments = data.filter(comment => !comment.parentReviewId);
  
        // For each root comment, ensure replies are properly loaded
        this.comments.forEach(comment => {
          if (comment.replies) {
            // Make sure replies exist and attach them to the comment
            comment.replies = comment.replies.filter(reply => reply.parentReviewId === comment.id);
          }
        });
  
        console.log('Root Comments loaded:', this.comments);
      },
      error: err => console.error('Error loading comments', err)
    });
  }
  
  

  loadRatings(assetId: string) {
    this.ratingService.getRatingsByAsset(assetId).subscribe({
      next: (data) => (this.ratings = data),
      error: (err) => console.error('Error fetching ratings', err)
    });
  }

  loadSameCategoryAssets(categoryId: number): void {
    this.assetService.getAssetsByCategory(categoryId).subscribe({
      next: (assets) => {
        this.sameCategoryAssets = assets.filter(a => a.id !== this.assetSelected?.id).slice(0, 4);
      },
      error: (err) => console.error('Failed to fetch same category assets', err)
    });
  }
  loadReleases(assetId: string): void {
    this.assetService.getReleasesByAsset(assetId).subscribe({
      next: (data) => {
        console.log('Loaded Releases:', data);
        this.assetReleases = data;
      },
      error: (err) => console.error('Error loading releases', err)
    });
  }
  

  //review fun
  handleReviewSubmit(review: { review: { rating: number, text: string } }): void {
    if (!this.assetSelected || !this.userId) return;

    const assetId = this.assetSelected.id;

    const backendRatingPayload = {
      userId: Number(this.userId),
      assetId: assetId,
      functionality: 5,
      performance: 4,
      integration: 4,
      documentation: 5
    };

    this.ratingService.addRating(backendRatingPayload).subscribe({
      next: () => {
        console.log('Rating submitted to backend successfully');
        this.loadRatings(assetId);
        this.ratingService.getAverageRatingPerCategory(assetId).subscribe({
          next: (averages) => {
            this.categoryAverages = averages;
          }
        });
      },
      error: (err) => console.error('Error submitting rating', err)
    });
    const commentPayload = {
      userId: Number(this.userId),
      assetId: assetId,
      comment: review.review.text
    };
    this.commentService.addComment(commentPayload).subscribe({
      next: () => {
        console.log('Comment added successfully');
        this.loadComments();
      },
      error: (err) => console.error('Error adding comment', err)
    });
  }

  //release fun
  submitRelease(): void {
    if (!this.assetSelected || !this.newReleaseFileObject) return;
  
    this.assetService.uploadReleaseDocumentation(this.newReleaseFileObject).subscribe({
      next: (docPath) => {
        const payload = {
          originalAssetId: this.assetSelected!.id,
          version: this.newReleaseVersion,
          documentation: docPath,
          fileUrl: "/uploads/fake-path.zip" 
        };
  
        this.assetService.uploadAssetReleaseFull(payload).subscribe({
          next: () => {
            this.loadReleases(this.assetSelected!.id);
            this.newReleaseVersion = '';
            this.newReleaseDoc = '';
            this.newReleaseFileObject = null;
            this.showReleasePopup = false;
          },
          error: (err) => console.error('Failed to create release:', err)
        });
      },
      error: (err) => console.error('Failed to upload PDF:', err)
    });
  }
  

  createStarDisplay(average: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(average);
    const hasHalfStar = average - fullStars >= 0.5;

    for (let i = 0; i < fullStars; i++) stars.push('full');
    if (hasHalfStar) stars.push('half');
    while (stars.length < 5) stars.push('empty');

    return stars;
  }

  getIcon(img?: string): string {
    return img ? `assets/images/${img}` : 'assets/images/default3.jpg';
  }
  toggleRelease(releaseId: number): void {
    if (this.selectedRelease?.id === releaseId) {
      this.selectedRelease = null;
    } else {
      const match = this.assetSelected?.releases?.find(r => r.id === releaseId);
      if (match) {
        this.selectedRelease = match;
  
        if (typeof match.releasedAsset === 'string') {
          this.assetService.getAssetById(match.releasedAsset).subscribe({
            next: (fullReleasedAsset) => {
              this.selectedRelease!.releasedAsset = fullReleasedAsset;
            },
            error: (err) => console.error('Failed to fetch released asset:', err)
          });
        }
      }
    }
  }
  
  
  selectRelease(release: any): void {
    this.selectedRelease = release;
  }  
  onReleaseDocSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.releaseDocFile = input.files[0];
    }
  }
  onNewReleaseFileSelected(event: any) {
    this.newReleaseFileObject = event.target.files[0];
  }
  getSafeDoc(docPath: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('http://localhost:8080' + docPath);
  }

 
  
  getSafeDocDirect(docPath: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('http://localhost:8080' + docPath);
  }

  goBack() {
    window.history.back();
  }
  // onNewReleaseFileSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     const file = input.files[0];
      
  //     // Optionally: upload the file via a service and store path
  //     const formData = new FormData();
  //     formData.append('file', file);
  
  //     this.assetService.uploadReleaseDoc(formData).subscribe({
  //       next: (path: string) => {
  //         this.newReleaseDoc = path;
  //         console.log('Uploaded doc path:', path);
  //       },
  //       error: (err) => console.error('Failed to upload doc:', err)
  //     });
  //   }
  // }
}
