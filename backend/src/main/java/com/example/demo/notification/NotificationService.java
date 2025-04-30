package com.example.demo.notification;

import com.example.demo.asset.model.Asset;
import com.example.demo.asset.repository.AssetRepository;
import com.example.demo.auth.AuthRepository;
import com.example.demo.auth.User;
import com.example.review.model.Review;

import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final AssetRepository assetRepository;
    private final AuthRepository authRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               AssetRepository assetRepository,
                               AuthRepository authRepository) {
        this.notificationRepository = notificationRepository;
        this.assetRepository = assetRepository;
        this.authRepository = authRepository;
    }

    public void notifyUser(User user, String content, NotificationType type, String relatedEntityId, String relatedAssetId) {
        Notification n = new Notification();
        n.setRecipient(user);
        n.setContent(content);
        n.setCreatedAt(new Date());
        n.setRead(false);
        n.setType(type);
        n.setRelatedEntityId(relatedEntityId);
        n.setRelatedAssetId(relatedAssetId);
        notificationRepository.save(n);
    }

    public void notifyContributorByAssetId(String assetId, String content, NotificationType type) {
        Asset asset = assetRepository.findById(assetId)
            .orElseThrow(() -> new RuntimeException("Asset not found"));

        String publisherEmail = asset.getPublisherMail();
        if (publisherEmail != null) {
            User contributor = authRepository.findByEmail(publisherEmail)
                .orElseThrow(() -> new RuntimeException("User not found by email: " + publisherEmail));
            notifyUser(contributor, content, type, assetId, assetId);
        }
    }

    public List<Notification> getNotificationsFor(User user) {
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user);
    }

    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    public void notifyContributorOfReportedReview(Review review, String reason, User commenter) {
        Asset asset = assetRepository.findById(review.getAssetId())
            .orElseThrow(() -> new RuntimeException("Asset not found: " + review.getAssetId()));

        String publisherEmail = asset.getPublisherMail();
        if (publisherEmail != null) {
            User contributor = authRepository.findByEmail(publisherEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + publisherEmail));

            String content = "Review by " + commenter.getFirstName() + " " + commenter.getLastName()
                + " on your asset \"" + asset.getName() + "\" was reported for: " + reason;

            // ✅ FIX: use review ID for relatedEntityId
            notifyUser(contributor, content, NotificationType.REVIEW_REPORTED, review.getId().toString(), asset.getId());
        }
    }

    public void notifyUserOfLikedReview(Review review, User liker) {
        User author = authRepository.findById(review.getUserId())
            .orElseThrow(() -> new RuntimeException("Review author not found"));

        Asset asset = assetRepository.findById(review.getAssetId())
            .orElseThrow(() -> new RuntimeException("Asset not found"));

        String content = "Your comment on the asset \"" + asset.getName() + "\" was liked by " +
                         liker.getFirstName() + " " + liker.getLastName();

        notifyUser(author, content, NotificationType.REVIEW_LIKED, review.getId().toString(), asset.getId());
    }

    public void notifyUserOfReply(Review parentReview, User replier) {
        User originalCommenter = authRepository.findById(parentReview.getUserId())
            .orElseThrow(() -> new RuntimeException("Original commenter not found"));

        Asset asset = assetRepository.findById(parentReview.getAssetId())
            .orElseThrow(() -> new RuntimeException("Asset not found"));

        String content = replier.getFirstName() + " " + replier.getLastName() +
                         " replied to your comment on the asset \"" + asset.getName() + "\"";

        notifyUser(originalCommenter, content, NotificationType.COMMENT_REPLIED, parentReview.getId().toString(), asset.getId());
    }
    public void notifyAllUsersOfAsset(Asset asset, NotificationType type) {
        String message;
        if (type == NotificationType.ASSET_PUBLISHED) {
            message = "🚀 New feature alert! A new asset titled \"" + asset.getName() + "\" has just been published — check it out now!";
        } else {
            message = "🔁 \"" + asset.getName() + "\" just got a new version! Discover the latest update now.";
        }

        List<User> allUsers = authRepository.findAll();
        for (User user : allUsers) {
            notifyUser(user, message, type, asset.getId(), asset.getId());
        }
    }


}
