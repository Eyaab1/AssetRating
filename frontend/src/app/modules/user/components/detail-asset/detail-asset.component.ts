import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ReviewPopupComponent } from '../review-popup/review-popup.component';
import { ReviewComponentComponent } from '../../review-component/review-component.component';

import { AssetServiceService } from '../../../../shared/services/asset-service.service';
import { CommentService } from '../../../../shared/services/comment.service';
import { RatingService } from '../../../../shared/services/rating.service';

import { Comment } from '../../../../shared/models/comment';
import { Rating } from '../../../../shared/models/rating';
import { Asset } from '../../../../shared/models/asset';
import { AssetRelease } from '../../../../shared/models/asset-release';
import { DecodedToken } from '../../../../shared/decoded-token';

import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail-asset',
  standalone: true,
  imports: [CommonModule, ReviewPopupComponent, ReviewComponentComponent, FormsModule],
  templateUrl: './detail-asset.component.html',
  styleUrl: './detail-asset.component.css'
})
export class DetailAssetComponent {
  @ViewChild(ReviewComponentComponent) reviewComponent!: ReviewComponentComponent;
@ViewChild('reviewModal', { static: false }) reviewModal!: ReviewPopupComponent;

  // user & asset  
  private userId: string = '';
  assetSelected!: Asset | undefined;
  sameCategoryAssets: Asset[] = [];

  //  tabs 
  activeTab: 'docs' | 'releases' = 'docs';
  safeDocUrl: SafeResourceUrl | null = null;

  // reviews and ratings
  comments: Comment[] = [];
  ratings: Rating[] = [];
  categoryAverages: { [key: string]: number } = {};
  ratingCategories: { label: string, field: string }[] = [
    { label: 'Functionality', field: 'functionality' },
    { label: 'Performance', field: 'performance' },
    { label: 'Integration', field: 'integration' },
    { label: 'Documentation', field: 'documentation' }
  ];

  //  release  
  assetReleases: AssetRelease[] = [];
  selectedRelease: AssetRelease | null = null;
  showReleasePopup = false;
  newReleaseVersion = '';
  newReleaseDoc = '';
  newReleaseFileObject: File | null = null;
  newReleaseFile = '';
  releaseDocFile: File | null = null;
  newReleaseDate: string = '';
  releaseRatings: { [releaseId: number]: number } = {};

  constructor(
    private route: ActivatedRoute,
    private assetService: AssetServiceService,
    private commentService: CommentService,
    private ratingService: RatingService,
    private sanitizer: DomSanitizer,
    private router:Router,
    private cdr: ChangeDetectorRef,

  ) {}
  highlightReviewId: string | null = null;
highlightReportId: string | null = null;
focusReviewId: string | null = null;
fromReport: boolean = false;
 ngOnInit(): void {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded: DecodedToken = jwtDecode(token);
    this.userId = decoded.userId?.toString() ?? '';
  }

  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (id) this.loadAssetById(id);
  });
  this.route.queryParams.subscribe(params => {
    this.focusReviewId = params['focusReviewId'];
    this.fromReport = params['fromReport'] === 'true';

    if (this.focusReviewId) {
      setTimeout(() => {
        const type = this.fromReport ? 'report' : 'review';
        this.scrollToComment(this.focusReviewId!, type);
      }, 500);
    }
  });

}

scrollToComment(commentId: string, type: 'review' | 'report') {
  const el = document.getElementById(`review-${commentId}`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    this.highlightReviewId = null;
    this.highlightReportId = null;
    setTimeout(() => {
      if (type === 'review') {
        this.highlightReviewId = commentId;
      } else {
        this.highlightReportId = commentId;
      }
      setTimeout(() => {
        if (type === 'review') {
          this.highlightReviewId = null;
        } else {
          this.highlightReportId = null;
        }
      }, 2500);
    }, 100);
  }
}

loadAssetById(id: string): void {
  this.assetService.getAssetById(id).subscribe({
    next: (data) => {
      this.assetSelected = data;
      if (data.documentation) {
        this.safeDocUrl = this.getSafeDocDirect(data.documentation);
      }
      console.log("date asset",this.assetSelected.publishDate);
      this.loadComments();
      this.loadRatings(data.id);
      this.loadReleases(data.id);
      this.loadCategoryAverages(data.id);
      const firstCategory = data.categories?.[0];
      if (firstCategory?.id != null) {
        this.loadSameCategoryAssets(firstCategory.id);
      }
    },
    error: (err) => console.error('Error fetching asset', err)
  });
}


  activeMainTab: 'docs' | 'releases' = 'docs';
  activeReleaseTabs: { [releaseId: string]: 'docs' | 'feedback' } = {};
  
  setReleaseTab(releaseId: string, tab: 'docs' | 'feedback') {
    this.activeReleaseTabs[releaseId] = tab;
  }

  loadComments(): void {
    const assetId = this.assetSelected?.id;
    if (!assetId) return;
    this.commentService.getCommentsByAsset(assetId).subscribe({
      next: data => {
        this.comments = data.filter(comment => !comment.parentReviewId);
        this.comments.forEach(comment => {
          if (comment.replies) {
            comment.replies = comment.replies.filter(reply => reply.parentReviewId === comment.id);
          }
        });
      },
      error: err => console.error('Error loading comments', err)
    });
  }

  loadRatings(assetId: string): void {
    this.ratingService.getRatingsByAsset(assetId).subscribe({
      next: data => this.ratings = data,
      error: err => console.error('Error fetching ratings', err)
    });
  }
loadReleases(assetId: string): void {
  this.assetService.getReleasesByAsset(assetId).subscribe({
    next: (data: AssetRelease[]) => {
      this.assetReleases = data;
      this.releaseRatings = data.reduce((acc, release) => {
        if (release.id != null) acc[release.id] = 0;
        return acc;
      }, {} as { [releaseId: number]: number });
      data.forEach((release) => {
        const releaseId = release.id;
        const releasedAssetId = release.releasedAsset.id;
        if (releaseId != null && releasedAssetId) {
          this.ratingService.getAverageRatingForRelease(releasedAssetId).subscribe({
            next: (ratingResponse) => {
              this.releaseRatings = {
                ...this.releaseRatings,
                [releaseId]: ratingResponse.overall || 0
              };
              this.cdr.markForCheck();
            },
            error: () => {
              console.error(`Error fetching rating for release ${releaseId}`);
            }
          });
        }
      });
    },
    error: (err) => {
      console.error('Error loading releases', err);
    }
  });
}

  loadSameCategoryAssets(categoryId: number): void {
    this.assetService.getAssetsByCategory(categoryId).subscribe({
      next: assets => {
        this.sameCategoryAssets = assets.filter(a => a.id !== this.assetSelected?.id).slice(0, 4);
      },
      error: err => console.error('Failed to fetch same category assets', err)
    });
  }

  loadCategoryAverages(assetId: string): void {
    this.ratingService.getAverageRatingPerCategory(assetId).subscribe({
      next: averages => {
        this.categoryAverages = averages;
        console.log('Average ratings by category:', this.categoryAverages);
        this.cdr.detectChanges();
      },
      error: err => console.error('Error fetching average ratings by category', err)
    });
  }

  //  review submission 
  handleReviewSubmit(review: { review: { rating: number, text: string } }): void {
    if (!this.assetSelected || !this.userId) return;
    const assetId = this.assetSelected.id;

    const ratingPayload = {
      userId: Number(this.userId),
      assetId,
      functionality: 5,
      performance: 4,
      integration: 4,
      documentation: 5
    };

    this.ratingService.addRating(ratingPayload).subscribe({
      next: () => {
        this.loadRatings(assetId);
        this.loadCategoryAverages(assetId);
        
      },
      error: (err) => {
        if (err.status === 400 && err.error === 'You have already rated this asset.') {
          alert('You have already rated this asset.');
        } else {
          console.error('Error submitting rating', err);
        }
      }
    });

    const commentPayload = {
      userId: Number(this.userId),
      assetId,
      comment: review.review.text
    };

    this.commentService.addComment(commentPayload).subscribe({
      next: () => this.loadComments(),
      error: (err) => {
        if (err.status === 400 && err.error === 'Review contains inappropriate language.') {
          alert('Your comment contains inappropriate language.');
        } else {
          console.error('Error adding comment', err);
        }
      }
    });
  }

  onReviewSubmitted(): void {
    if (this.assetSelected?.id) {
      this.loadComments(); 
    this.loadRatings(this.assetSelected.id); 
    this.loadCategoryAverages(this.assetSelected.id);
    this.reviewComponent?.loadComments(); 
    }
  }
  

  // Release Submission
  // submitRelease(): void {
  //   if (!this.assetSelected || !this.newReleaseFileObject) return;

  //   this.assetService.uploadReleaseDocumentation(this.newReleaseFileObject).subscribe({
  //     next: (docPath) => {
  //       const payload = {
  //         originalAssetId: this.assetSelected!.id,
  //         version: this.newReleaseVersion,
  //         documentation: docPath,
  //         fileUrl: "/uploads/fake-path.zip"
  //       };

  //       this.assetService.uploadAssetReleaseFull(payload).subscribe({
  //         next: () => {
  //           this.loadReleases(this.assetSelected!.id);
  //           this.newReleaseVersion = '';
  //           this.newReleaseDoc = '';
  //           this.newReleaseFileObject = null;
  //           this.showReleasePopup = false;
  //         },
  //         error: (err) => console.error('Failed to create release:', err)
  //       });
  //     },
  //     error: (err) => console.error('Failed to upload PDF:', err)
  //   });
  // }

toggleRelease(releasedAssetId: string): void {
  if (this.selectedRelease?.releasedAsset?.id === releasedAssetId) {
    this.selectedRelease = null;
  } else {
    const match = this.assetReleases.find(
      r => r.releasedAsset?.id === releasedAssetId
    );
    if (match) {
      this.selectedRelease = match;
      this.activeReleaseTabs[releasedAssetId] = 'docs';
    }
  }
}

  selectRelease(release: AssetRelease): void {
    this.selectedRelease = release;
  }

  onReleaseDocSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.releaseDocFile = input.files[0];
    }
  }

  onNewReleaseFileSelected(event: any): void {
    this.newReleaseFileObject = event.target.files[0];
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

  getSafeDoc(docPath: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('http://localhost:8081' + docPath);
  }



  getSafeDocDirect(docPath: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('http://localhost:8081' + docPath);
  }

  getReleaseRating(releaseId?: number): number | null {
    if (releaseId == null) return null;
    return this.releaseRatings[releaseId] ?? null;
  }

  getReleasedAssetId(releasedAsset: Asset | undefined): string {
    return releasedAsset?.id ?? '';
  }

  getIcon(img: string): string {
    return img ? `assets/images/${img}` : 'assets/images/default4.jpg';
  }
  getImage(img:string): string{
    return img ? `http://localhost:8081${img}` : 'assets/images/default4.jpg';
  }

  goBack(): void {
    window.history.back();
  }

  openReleaseReview(releasedAssetId: string, versionLabel: string) {
    this.reviewModal.open(releasedAssetId, versionLabel);
  }
  onDownloadClicked(assetId: string) {
  if (!assetId) return;

  this.assetService.incrementDownload(assetId).subscribe({
    next: () => {
      const asset = this.assetSelected;
      if (asset) {
        asset.downloadCount = (asset.downloadCount || 0) + 1;

        Swal.fire({
          title: 'Download Successful',
          text: 'The asset has been downloaded',
          icon: 'success',
          confirmButtonColor: '#4f46e5',
          confirmButtonText: 'OK'
        });
      }
    },
    error: (err) => {
      console.error('Failed to increment download count', err);
      Swal.fire({
        title: 'Download Failed',
        text: 'The asset could not be downloaded at this time.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    }
  });
}

goTheDetail(assetId:String){
  this.router.navigate(['/contributorLayout/detail', assetId]);
}

}
