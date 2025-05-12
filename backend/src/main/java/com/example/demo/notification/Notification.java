package com.example.demo.notification;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;
import com.example.demo.auth.User;

@Entity
@Data
public class Notification {

    @Id
    private String id;

    private String content;
    private boolean read = false;
    private Date createdAt = new Date();

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private String relatedEntityId;

    private String relatedAssetId;

    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private User recipient;

	@ManyToOne
	@JoinColumn(name = "actor_id")
	private User actor;
	

    public Notification() {
		super();}
    
	public Notification(String content, boolean read, Date createdAt, User recipient, NotificationType type) {

		this.content = content;
		this.read = read;
		this.createdAt = createdAt;
		this.recipient = recipient;
		this.type=type;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public boolean isRead() {
		return read;
	}

	public void setRead(boolean read) {
		this.read = read;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public User getRecipient() {
		return recipient;
	}

	public void setRecipient(User recipient) {
		this.recipient = recipient;
	}

	public NotificationType getType() {
		return type;
	}

	public void setType(NotificationType type) {
		this.type = type;
	}

	public String getRelatedEntityId() {
		return relatedEntityId;
	}

	public void setRelatedEntityId(String relatedEntityId) {
		this.relatedEntityId = relatedEntityId;
	}

	public String getRelatedAssetId() {
		return relatedAssetId;
	}

	public void setRelatedAssetId(String relatedAssetId) {
		this.relatedAssetId = relatedAssetId;
	}
	public User getActor() {
	    return actor;
	}

	public void setActor(User actor) {
	    this.actor = actor;
	}
	
    
    
}
