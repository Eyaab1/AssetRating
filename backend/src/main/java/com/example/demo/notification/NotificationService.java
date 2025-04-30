package com.example.demo.notification;

import com.example.demo.asset.model.Asset;
import com.example.demo.asset.repository.AssetRepository;
import com.example.demo.auth.AuthRepository;
import com.example.demo.auth.User;
import com.example.review.model.Review;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final AssetRepository assetRepository;
    private final AuthRepository authRepository;
    
    public NotificationService(NotificationRepository notificationRepository, AssetRepository assetRepository,AuthRepository authRepository) {
		this.notificationRepository = notificationRepository;
		this.assetRepository = assetRepository;
		this.authRepository=authRepository;
	}

	public void notifyUser(User user, String content) {
        Notification n = new Notification();
        n.setRecipient(user);
        n.setContent(content);
        n.setCreatedAt(new Date());
        n.setRead(false);
        notificationRepository.save(n);
    }

	public void notifyContributorByAssetId(String assetId, String content) {
	    Asset asset = assetRepository.findById(assetId)
	        .orElseThrow(() -> new RuntimeException("Asset not found"));

	    String publisherEmail = asset.getPublisherMail();

	    if (publisherEmail != null) {
	        User contributor = authRepository.findByEmail(publisherEmail)
	            .orElseThrow(() -> new RuntimeException("User not found by email: " + publisherEmail));
	        notifyUser(contributor, content);
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

            notifyUser(contributor, content);
        }
    }
}
